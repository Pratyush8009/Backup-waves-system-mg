import {
  Component, ElementRef, ViewChild, AfterViewInit, OnInit,
  EventEmitter, Output, HostListener, ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { newInstance, BrowserJsPlumbInstance } from '@jsplumb/browser-ui';
import { ActivatedRoute, Router } from '@angular/router';

// NG-ZORRO Imports
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzSplitterModule } from 'ng-zorro-antd/splitter';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzSegmentedModule } from 'ng-zorro-antd/segmented';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';

import { FlowConfigPanel } from '../../components/right-side-panel/flow-config-panel/flow-config-panel';

import {
  BlockItem,
  ConnectionRecord,
  SavedConnectionRecord,
  getBlocks,
} from '../block-editor/data';

import { SavedFlow, savedFlows as importedSavedFlows, NodeModel, Panel, panels } from './flow-data';

@Component({
  selector: 'app-flow-editor',
  standalone: true,
  imports: [
    CommonModule, FormsModule, NzButtonModule, NzBreadCrumbModule,
    NzSplitterModule, NzIconModule, NzTooltipModule, NzDividerModule,
    NzModalModule, NzSelectModule, NzInputModule, NzCollapseModule, NzFormModule,
    FlowConfigPanel, NzPopoverModule, NzSegmentedModule, NzDropDownModule
  ],
  templateUrl: './flow-editor.html',
  styleUrl: './flow-editor.css'
})
export class FlowEditor implements AfterViewInit, OnInit {
  @Output() fullscreenChange = new EventEmitter<boolean>();
  @ViewChild('container') container!: ElementRef;

  panels: Panel[] = panels;
  instance!: BrowserJsPlumbInstance;
  selectedNode: NodeModel | null = null;

  systemId: string = 'SYS-101';
  unitId: string = 'UNIT-802';
  modelId: string = 'MODEL-v2.1';
  pipelineId: string = '958769348796';
  isFullscreen: boolean = false;
  showFlowDebug: string = '';

  activeConnections: ConnectionRecord[] = [];
  private isProgrammaticConnecting = false;

  zoomLevel: number = 1.0;
  private readonly MIN_ZOOM: number = 0.3;
  private readonly MAX_ZOOM: number = 2.5;
  private readonly ZOOM_STEP: number = 0.1;

  isContextMenuVisible = false;
  contextMenuPosition = { x: 0, y: 0 };
  contextMenuNode: NodeModel | null = null;

  // Left Panel Navigation & Filter State
  leftPanelMode: 'Block' | 'Nodes' = 'Block';
  panelOptions: string[] = ['Block', 'Nodes'];
  flowSearchQuery: string = '';
  nodeSearchQuery: string = '';

  // Flow Modal State
  isFlowModalVisible = false;
  isEditMode = false;
  editingFlowId: string | null = null;
  flowFormName: string = '';
  flowFormDescription: string = '';

  // Deep clone initial data to break shared references
  blocks: BlockItem[] = getBlocks();
  savedFlows: SavedFlow[] = JSON.parse(JSON.stringify(importedSavedFlows));

  selectedBlockId: string = this.blocks.length > 0 ? this.blocks[0].value : '';
  activeFlowId: string = '';
  draggedNode: NodeModel | null = null;

  constructor(
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private message: NzMessageService,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.unitId = params.get('unitId') || this.unitId;
      this.systemId = params.get('systemId') || this.systemId;
      this.modelId = params.get('modelId') || this.modelId;
      this.pipelineId = params.get('pipelineId') || this.pipelineId;
      const blockId = params.get('blockId');
      if (blockId) {
        this.selectedBlockId = blockId;
      }
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initJsPlumb();
      if (this.selectedBlockId) {
        this.syncActiveFlowForBlock(this.selectedBlockId);
      }
    }, 0);
  }

  get activeFlow(): SavedFlow | null {
    return this.savedFlows.find(f => f.id === this.activeFlowId) || null;
  }

  get selectedBlock(): BlockItem {
    return this.blocks.find(b => b.value === this.selectedBlockId) || this.blocks[0];
  }

  get filteredFlows(): SavedFlow[] {
    return this.savedFlows.filter(f =>
      f.blockId === this.selectedBlockId &&
      f.name.toLowerCase().includes(this.flowSearchQuery.toLowerCase())
    );
  }

  get filteredPanels(): Panel[] {
    if (!this.nodeSearchQuery.trim()) {
      return this.panels;
    }
    const query = this.nodeSearchQuery.toLowerCase();
    return this.panels.map(panel => ({
      ...panel,
      nodes: panel.nodes.filter(n =>
        n.name.toLowerCase().includes(query) ||
        (n.description && n.description.toLowerCase().includes(query)) ||
        (n.category && n.category.toLowerCase().includes(query))
      )
    })).filter(panel => panel.nodes.length > 0);
  }

  get totalFlowsCount(): number {
    return this.savedFlows.filter(f => f.blockId === this.selectedBlockId).length;
  }

  get validFlowsCount(): number {
    return this.savedFlows.filter(f => f.blockId === this.selectedBlockId && (!f.nodes || f.nodes.every(n => !n.hasError))).length;
  }

  get invalidFlowsCount(): number {
    return this.savedFlows.filter(f => f.blockId === this.selectedBlockId && f.nodes && f.nodes.some(n => n.hasError)).length;
  }

  onBlockChange(blockId: string) {
    this.selectedBlockId = blockId;
    this.syncActiveFlowForBlock(blockId);
  }

  public syncActiveFlowForBlock(blockId: string) {
    const flowsForBlock = this.savedFlows.filter(f => f.blockId === blockId);
    if (flowsForBlock.length > 0) {
      this.selectFlow(flowsForBlock[0].id);
    } else {
      this.clearCanvas();
      this.activeFlowId = '';
      this.selectedNode = null;
      this.activeConnections = [];
    }
  }

  createNewFlow() {
    const flowsForBlock = this.savedFlows.filter(f => f.blockId === this.selectedBlockId);
    this.isEditMode = false;
    this.editingFlowId = null;
    this.flowFormName = `Flow-${flowsForBlock.length + 1}`;
    this.flowFormDescription = '';
    this.isFlowModalVisible = true;
  }

  editFlow(flowId: string, event?: MouseEvent) {
    if (event) event.stopPropagation();
    const flow = this.savedFlows.find(f => f.id === flowId);
    if (flow) {
      this.isEditMode = true;
      this.editingFlowId = flowId;
      this.flowFormName = flow.name;
      this.flowFormDescription = flow.description || '';
      this.isFlowModalVisible = true;
    }
  }

  handleFlowModalOk() {
    if (!this.flowFormName.trim()) {
      this.message.warning('Please enter a flow name.');
      return;
    }

    if (this.isEditMode && this.editingFlowId) {
      const flow = this.savedFlows.find(f => f.id === this.editingFlowId);
      if (flow) {
        flow.name = this.flowFormName.trim();
        flow.description = this.flowFormDescription.trim();
        this.message.success('Flow updated successfully!');
      }
    } else {
      const newId = 'FLOW-' + Date.now();
      const newFlow: SavedFlow = {
        id: newId,
        blockId: this.selectedBlockId,
        name: this.flowFormName.trim(),
        description: this.flowFormDescription.trim(),
        nodes: [],
        connections: []
      };
      this.savedFlows.push(newFlow);
      this.selectFlow(newId);
      this.message.success('Flow created successfully!');
    }

    this.isFlowModalVisible = false;
  }

  handleFlowModalCancel() {
    this.isFlowModalVisible = false;
  }

  selectFlow(flowId: string) {
    // Preserve current connections into state before leaving
    this.updateActiveConnections();

    // Wipes all endpoints & connectors from DOM/jsPlumb memory instance
    this.clearCanvas();

    this.activeFlowId = flowId;
    this.selectedNode = null;

    // Force Angular to render the activeFlow's DOM nodes (*ngFor)
    this.cdr.detectChanges();

    // Defer setup until Angular guarantees DOM node initialization
    setTimeout(() => {
      const current = this.activeFlow;
      if (current) {
        current.nodes.forEach(n => this.setupNode(n));
        this.restoreConnections(current.connections || []);
      }
    }, 50);
  }

  deleteFlow(flowId: string, event?: MouseEvent) {
    if (event) event.stopPropagation();
    const index = this.savedFlows.findIndex(f => f.id === flowId);
    if (index !== -1) {
      this.savedFlows.splice(index, 1);
    }

    if (this.activeFlowId === flowId) {
      const remaining = this.filteredFlows;
      if (remaining.length > 0) {
        this.selectFlow(remaining[0].id);
      } else {
        this.clearCanvas();
        this.activeFlowId = '';
        this.selectedNode = null;
        this.activeConnections = [];
      }
    }
  }

  private clearCanvas() {
    if (!this.instance) return;
    this.isProgrammaticConnecting = true;
    try {
      this.instance.deleteEveryConnection();
      if (this.activeFlow) {
        this.activeFlow.nodes.forEach(n => {
          if (n.instanceId) {
            const el = document.getElementById(n.instanceId);
            if (el) {
              this.instance.removeAllEndpoints(el);
              this.instance.unmanage(el);
            }
          }
        });
      }
    } finally {
      this.isProgrammaticConnecting = false;
    }
  }

  private restoreConnections(conns: ConnectionRecord[]) {
    this.isProgrammaticConnecting = true;
    try {
      conns.forEach(c => {
        const sUuid = `${c.sourceInstanceId}-${c.sourcePortId}`;
        const tUuid = `${c.targetInstanceId}-${c.targetPortId}`;
        try {
          this.instance.connect({ uuids: [sUuid, tUuid] });
        } catch (e) { }
      });
    } finally {
      this.isProgrammaticConnecting = false;
    }
    this.updateActiveConnections();
  }

  private initJsPlumb() {
    if (!this.container) return;

    this.instance = newInstance({ container: this.container.nativeElement });
    this.instance.importDefaults({
      connector: { type: 'Flowchart', options: { cornerRadius: 5, stub: 10 } },
      paintStyle: { stroke: '#4a4a4a', strokeWidth: 2 },
      endpoint: { type: 'Rectangle', options: { width: 6, height: 16 } },
      endpointStyle: { fill: '#4a4a4a' }
    });

    this.instance.bind('connection', (info: any) => {
      if (this.isProgrammaticConnecting) return;

      if (info.sourceId === info.targetId) {
        this.instance.deleteConnection(info.connection);
        return;
      }

      if (this.isDuplicateConnection(info.connection)) {
        this.instance.deleteConnection(info.connection);
        return;
      }

      this.updateActiveConnections();
    });

    const handleDetach = () => {
      if (this.isProgrammaticConnecting) return;
      setTimeout(() => {
        this.updateActiveConnections();
      }, 20);
    };

    this.instance.bind('connection:detach', handleDetach);
    this.instance.bind('connection:remove', handleDetach);
  }

  private getPortIdFromEndpoint(ep: any): string | null {
    if (!ep) return null;
    return ep.data?.portId || ep.userAttribute?.portId || ep.payload?.portId || null;
  }

  private getNodeIdFromEndpoint(ep: any): string | null {
    if (!ep) return null;
    return ep.data?.nodeId || ep.element?.id || null;
  }

  private getPortUuid(ep: any): string | null {
    if (!ep) return null;
    const nodeId = this.getNodeIdFromEndpoint(ep);
    const portId = this.getPortIdFromEndpoint(ep);
    if (nodeId && portId) {
      return `${nodeId}-${portId}`;
    }
    return null;
  }

  private isDuplicateConnection(conn: any): boolean {
    if (!conn || !conn.endpoints || conn.endpoints.length < 2) return false;

    const sUuid = this.getPortUuid(conn.endpoints[0]);
    const tUuid = this.getPortUuid(conn.endpoints[1]);

    if (!sUuid || !tUuid) return false;

    const raw = this.instance.getConnections();
    const connectionsArray = Array.isArray(raw) ? raw : Object.values(raw);

    let matchCount = 0;
    for (const c of connectionsArray) {
      if (c.endpoints && c.endpoints.length === 2) {
        const s = this.getPortUuid(c.endpoints[0]);
        const t = this.getPortUuid(c.endpoints[1]);
        if (s === sUuid && t === tUuid) {
          matchCount++;
          if (matchCount > 1) return true;
        }
      }
    }
    return false;
  }

  public updateActiveConnections() {
    if (!this.instance || !this.activeFlow) return;

    const raw = this.instance.getConnections();
    const connectionsArray = Array.isArray(raw) ? raw : Object.values(raw);

    const existingConnectionsMap = new Map<string, ConnectionRecord>();
    if (this.activeFlow.connections) {
      this.activeFlow.connections.forEach(c => {
        const key = `${c.sourceInstanceId}:${c.sourcePortId}->${c.targetInstanceId}:${c.targetPortId}`;
        existingConnectionsMap.set(key, c);
      });
    }

    const seen = new Set<string>();
    const list: ConnectionRecord[] = [];

    connectionsArray.forEach((c: any) => {
      const sourceInstId = c.sourceId;
      const targetInstId = c.targetId;
      const sourcePortId = this.getPortIdFromEndpoint(c.endpoints?.[0]);
      const targetPortId = this.getPortIdFromEndpoint(c.endpoints?.[1]);

      if (sourceInstId && targetInstId && sourcePortId && targetPortId) {
        const connectionKey = `${sourceInstId}:${sourcePortId}->${targetInstId}:${targetPortId}`;
        if (!seen.has(connectionKey)) {
          seen.add(connectionKey);

          const existingConn = existingConnectionsMap.get(connectionKey);
          list.push({
            sourceInstanceId: sourceInstId,
            targetInstanceId: targetInstId,
            sourcePortId,
            targetPortId,
            mapping: existingConn?.mapping || []
          });
        }
      }
    });

    this.activeConnections = list;
    if (this.activeFlow) {
      this.activeFlow.connections = list;
    }
    this.cdr.detectChanges();
  }

  public setupNode(node: NodeModel) {
    if (!node.instanceId) return;

    const el = document.getElementById(node.instanceId);
    if (!el) return;

    this.instance.manage(el);

    this.instance.bind('drag:stop', (p: any) => {
      if (p.el && p.el.id === node.instanceId) {
        node.uiLayout.canvasX = parseFloat(p.el.style.left) || node.uiLayout.canvasX;
        node.uiLayout.canvasY = parseFloat(p.el.style.top) || node.uiLayout.canvasY;
      }
    });

    const inputs = node.ports.filter(p => p.portType === 'INPUT');
    const outputs = node.ports.filter(p => p.portType === 'OUTPUT');

    node.ports.forEach(port => {
      const isInput = port.portType === 'INPUT';
      const typedPorts = isInput ? inputs : outputs;
      const index = typedPorts.findIndex(p => p.id === port.id);
      const yPos = (index + 1) / (typedPorts.length + 1);

      const endpointUuid = `${node.instanceId}-${port.id}`;
      const endpointColor = '#4a4a4a';

      const epOptions: any = {
        endpoint: { type: 'Rectangle', options: { width: 6, height: 16 } },
        paintStyle: { fill: endpointColor },
        anchor: isInput ? [0, yPos, -1, 0] : [1, yPos, 1, 0],
        source: !isInput,
        target: isInput,
        maxConnections: isInput ? -1 : -1,
        uuid: endpointUuid,
        data: {
          nodeId: node.instanceId,
          portId: port.id
        }
      };

      const ep = this.instance.addEndpoint(el, epOptions);
      if (ep) {
        (ep as any).data = {
          nodeId: node.instanceId,
          portId: port.id
        };
      }
    });
  }


  public refreshNodeEndpoints(node: NodeModel) {
    if (!node.instanceId) return;
    const el = document.getElementById(node.instanceId);
    if (!el) return;

    this.isProgrammaticConnecting = true;

    try {
      const rawConns = this.instance.getConnections();
      const connectionsArray = Array.isArray(rawConns) ? rawConns : Object.values(rawConns);

      const savedConnections: SavedConnectionRecord[] = [];

      connectionsArray.forEach((conn: any) => {
        if (conn.endpoints && conn.endpoints.length === 2) {
          const sNodeId = this.getNodeIdFromEndpoint(conn.endpoints[0]);
          const sPortId = this.getPortIdFromEndpoint(conn.endpoints[0]);
          const tNodeId = this.getNodeIdFromEndpoint(conn.endpoints[1]);
          const tPortId = this.getPortIdFromEndpoint(conn.endpoints[1]);

          if (sNodeId && sPortId && tNodeId && tPortId) {
            savedConnections.push({
              sourceNodeId: sNodeId,
              sourcePortId: sPortId,
              targetNodeId: tNodeId,
              targetPortId: tPortId
            });
          }
        }
      });

      this.instance.removeAllEndpoints(el);
      this.setupNode(node);

      savedConnections.forEach(record => {
        const sUuid = `${record.sourceNodeId}-${record.sourcePortId}`;
        const tUuid = `${record.targetNodeId}-${record.targetPortId}`;

        try {
          this.instance.connect({ uuids: [sUuid, tUuid] });
        } catch (e) { }
      });

    } finally {
      this.isProgrammaticConnecting = false;
    }
    this.updateActiveConnections();
  }

  public onWheel(event: WheelEvent) {
    if (event.ctrlKey || event.metaKey) {
      event.preventDefault();
      const delta = event.deltaY < 0 ? this.ZOOM_STEP : -this.ZOOM_STEP;
      this.setZoom(this.zoomLevel + delta);
    }
  }

  public zoomIn() {
    if (this.zoomLevel < this.MAX_ZOOM) this.setZoom(this.zoomLevel + this.ZOOM_STEP);
  }

  public zoomOut() {
    if (this.zoomLevel > this.MIN_ZOOM) this.setZoom(this.zoomLevel - this.ZOOM_STEP);
  }

  public resetZoom() {
    this.setZoom(1.0);
  }

  private setZoom(zoom: number) {
    this.zoomLevel = Math.min(Math.max(zoom, this.MIN_ZOOM), this.MAX_ZOOM);
    this.instance.setZoom(this.zoomLevel);
  }

  onDragStart(event: DragEvent, node: NodeModel) {
    this.draggedNode = node;
    event.dataTransfer?.setData('text/plain', node.nodeId);
  }

  onDragOver(event: DragEvent) { event.preventDefault(); }

  onDrop(event: DragEvent) {
    event.preventDefault();

    if (!this.activeFlow) {
      this.message.warning('Please create or select a flow first before dragging nodes onto the canvas!');
      return;
    }
    if (!this.draggedNode) return;
    const rect = this.container.nativeElement.getBoundingClientRect();

    // Deep clone the dragged node definition to ensure object independence
    const newNode: NodeModel = JSON.parse(JSON.stringify(this.draggedNode));

    newNode.instanceId = 'NDI-' + Date.now();
    newNode.uiLayout.canvasX = (event.clientX - rect.left) / this.zoomLevel;
    newNode.uiLayout.canvasY = (event.clientY - rect.top) / this.zoomLevel;
    this.activeFlow.nodes.push(newNode);

    this.cdr.detectChanges();
    setTimeout(() => {
      this.setupNode(newNode);
    }, 0);

    this.draggedNode = null;
  }

  openContextMenu(event: MouseEvent, node: NodeModel) {
    event.preventDefault();
    event.stopPropagation();
    this.contextMenuNode = node;
    this.contextMenuPosition = { x: event.clientX, y: event.clientY };
    this.isContextMenuVisible = true;
  }

  @HostListener('document:click')
  closeContextMenu() { this.isContextMenuVisible = false; }

  deleteNode() {
    if (!this.contextMenuNode || !this.activeFlow) return;
    const el = document.getElementById(this.contextMenuNode.instanceId!);
    if (el) {
      this.instance.removeAllEndpoints(el);
      this.instance.unmanage(el);
    }
    this.activeFlow.nodes = this.activeFlow.nodes.filter(n => n.instanceId !== this.contextMenuNode!.instanceId);
    if (this.selectedNode?.instanceId === this.contextMenuNode.instanceId) {
      this.selectedNode = null;
    }

    setTimeout(() => {
      this.updateActiveConnections();
    }, 20);
  }

  saveCurrentFlow() {
    if (!this.activeFlow) {
      this.message.warning('No active flow available to save.');
      return;
    }
    this.updateActiveConnections();
    this.showFlowDebug = JSON.stringify(this.activeFlow);
    this.message.success('Flow saved successfully!');
  }

  toggleFullscreen() {
    this.isFullscreen = !this.isFullscreen;
    this.fullscreenChange.emit(this.isFullscreen);
  }

  selectNode(node: NodeModel, event: MouseEvent) {
    event.stopPropagation();
    this.selectedNode = node;
  }

  deselectNode(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('canvas')) {
      this.selectedNode = null;
    }
  }

  onBack() {
    this.router.navigate([`/units/${this.unitId}/systems/${this.systemId}/models/MDL-660e8400-e29b-41d4-a716-446655440101/schema/block-editor/`]);
  }
}

