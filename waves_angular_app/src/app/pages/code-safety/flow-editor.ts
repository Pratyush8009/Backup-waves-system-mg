import {
  Component, ElementRef, ViewChild, AfterViewInit, OnInit,
  EventEmitter, Output, HostListener, ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { newInstance, BrowserJsPlumbInstance, EVENT_CONNECTION_CLICK } from '@jsplumb/browser-ui';
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
import { FlowList } from '../../components/model-details/flow-list/flow-list';
import {
  BlockItem,
  ConnectionRecord,
  SavedConnectionRecord,
  getBlocks,
  Port,
  SchemaField, model
} from '../block-editor/data';

import {
  SavedFlow,
  savedFlows as importedSavedFlows,
  NodeModel,
  Panel,
  panels,
  addSchemaFieldToPortInFlow,
  isInputSchemaMappedInFlow,
  addOrUpdateConnectionMappingInFlow,
  removeConnectionMappingFromFlow,
  getDataTypeColor,
  getDataTypeTextColor,
  saveFlow,
  deleteFlow,
  getSavedFlows, validateFlowEditorGuidance,
  FlowGuidanceState
} from './flow-data';

interface FieldMappingPair {
  sourceField: SchemaField | null;
  targetField: SchemaField | null;
}

interface ExpandedPopoverState {
  activeMode: 'OUTPUT_ONLY' | 'INPUT_ONLY' | 'MAPPER_ACTIVE';
  sourceNode: NodeModel | null;
  sourcePort: Port | null;
  targetNode: NodeModel | null;
  targetPort: Port | null;
  connection: ConnectionRecord | null;
  mappings: FieldMappingPair[];
}

interface SchemaPopoverState {
  targetKey: 'ADD_OUTPUT' | 'ADD_INPUT' | null;
  mode: 'ADD';
  name: string;
  type: string;
  description: string;
  targetNode: NodeModel | null;
  targetPort: Port | null;
  isBlockSchemaSelection: boolean;
  blockSchemaSource: 'BLOCK_INPUT' | 'BLOCK_OUTPUT' | null;
}

interface BlockSchemaOption {
  field: SchemaField;
  disabled: boolean;
  disabledReason?: string;
}

export type EditorMode = 'VIEW' | 'EDIT';

@Component({
  selector: 'app-flow-editor',
  standalone: true,
  imports: [
    CommonModule, FormsModule, NzButtonModule, NzBreadCrumbModule,
    NzSplitterModule, NzIconModule, NzTooltipModule, NzDividerModule,
    NzModalModule, NzSelectModule, NzInputModule, NzCollapseModule, NzFormModule,
    FlowConfigPanel, NzPopoverModule, NzSegmentedModule, NzDropDownModule, FlowList
  ],
  templateUrl: './flow-editor.html',
  styleUrl: './flow-editor.css'
})
export class FlowEditor2 implements AfterViewInit, OnInit {
  @Output() fullscreenChange = new EventEmitter<boolean>();
  @ViewChild('container') container!: ElementRef;
  guidance: FlowGuidanceState = validateFlowEditorGuidance(null);

  panels: Panel[] = panels;
  instance!: BrowserJsPlumbInstance;
  selectedNode: NodeModel | null = null;
  currentConfigViewMode: 'NODE' | 'FLOW' | 'BLOCK' = 'FLOW';

  systemId: string = 'SYS-101';
  unitId: string = 'UNIT-802';
  modelId: string = 'MODEL-v2.1';
  flowPramId: string = '';
  pipelineId: string = '958769348796';
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

  leftPanelMode: 'Block' | 'Nodes' = 'Block';
  panelOptions: string[] = ['Block', 'Nodes'];
  flowSearchQuery: string = '';
  nodeSearchQuery: string = '';

  isFlowModalVisible = false;
  isEditMode = false;
  editingFlowId: string | null = null;
  flowFormName: string = '';
  flowFormDescription: string = '';

  blocks: BlockItem[] = getBlocks();
  savedFlows: SavedFlow[] = importedSavedFlows;

  selectedBlockId: string = this.blocks.length > 0 ? this.blocks[0].value : '';
  activeFlowId: string = '';
  draggedNode: NodeModel | null = null;

  editorMode: EditorMode = 'VIEW';

  private refreshGuidance(): void {
    const flow = this.activeFlow;
    if (!flow) {
      this.guidance = validateFlowEditorGuidance(null);
    } else {
      this.guidance = validateFlowEditorGuidance(flow);
    }
    this.cdr.detectChanges();
  }

  get isViewMode(): boolean {
    return this.editorMode === 'VIEW';
  }

  get isEditModeActive(): boolean {
    return this.editorMode === 'EDIT';
  }

  isPopoverVisible = false;
  popoverPosition = { x: 0, y: 0 };
  popoverState: ExpandedPopoverState = {
    activeMode: 'OUTPUT_ONLY',
    sourceNode: null,
    sourcePort: null,
    targetNode: null,
    targetPort: null,
    connection: null,
    mappings: []
  };

  schemaPopoverState: SchemaPopoverState = {
    targetKey: null,
    mode: 'ADD',
    name: '',
    type: 'decimal',
    description: '',
    targetNode: null,
    targetPort: null,
    isBlockSchemaSelection: false,
    blockSchemaSource: null
  };
  getDataTypeColor = getDataTypeColor;
  getDataTypeTextColor = getDataTypeTextColor;

  draggedSchemaField: { field: SchemaField; origin: 'SOURCE' | 'TARGET' } | null = null;

  blockSchemaOptions: BlockSchemaOption[] = [];
  selectedBlockSchemaFieldId: string | null = null;

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
      this.flowPramId = params.get('flowId') ?? '';

      if (blockId) {
        this.selectedBlockId = blockId;
      }
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initJsPlumb();
      if (this.selectedBlockId) {
        const flowFromUrl = this.flowPramId
          ? this.savedFlows.find(f => f.id === this.flowPramId)
          : null;

        if (flowFromUrl) {
          this.selectFlow(this.flowPramId);
        } else {
          this.syncActiveFlowForBlock(this.selectedBlockId);
        }
      }
      this.refreshGuidance();
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

  isInputBlockNode(node: NodeModel | null | undefined): boolean {
    return !!node && node.nodeType === 'INPUT';
  }

  isOutputBlockNode(node: NodeModel | null | undefined): boolean {
    return !!node && node.nodeType === 'OUTPUT';
  }

  isBlockOutputSchemaUsedInOtherFlows(fieldId: string): boolean {
    const flowsForBlock = this.savedFlows.filter(f => f.blockId === this.selectedBlockId);

    for (const flow of flowsForBlock) {
      if (this.activeFlowId && flow.id === this.activeFlowId) {
        continue;
      }
      const outputNode = flow.nodes.find(n => n.nodeType === 'OUTPUT');
      if (!outputNode) continue;

      for (const port of outputNode.ports) {
        if (port.schema?.some(f => f.id === fieldId)) {
          return true;
        }
      }
    }
    return false;
  }

  isFieldAlreadyOnCurrentPort(fieldId: string, targetPort: Port | null): boolean {
    if (!targetPort || !Array.isArray(targetPort.schema)) return false;
    return targetPort.schema.some(f => f.id === fieldId);
  }

  private computeBlockSchemaOptions(): BlockSchemaOption[] {
    const source = this.schemaPopoverState.blockSchemaSource;
    if (!source) return [];

    const allFields = source === 'BLOCK_INPUT' ? this.blockInputSchemas : this.blockOutputSchemas;
    const targetPort = this.schemaPopoverState.targetPort;
    const options: BlockSchemaOption[] = [];

    for (const field of allFields) {
      const alreadyOnThisPort = this.isFieldAlreadyOnCurrentPort(field.id, targetPort);

      let disabled = false;
      let reason: string | undefined = undefined;

      if (alreadyOnThisPort) {
        disabled = true;
        reason = 'Already added to this port';
      } else if (source === 'BLOCK_OUTPUT' && this.isBlockOutputSchemaUsedInOtherFlows(field.id)) {
        disabled = true;
        reason = 'Already used by another flow';
      }
      options.push({ field, disabled, disabledReason: reason });
    }
    return options;
  }

  onBlockChange(blockId: string) {
    this.selectedBlockId = blockId;
    this.syncActiveFlowForBlock(blockId);
    this.currentConfigViewMode = 'BLOCK';
    this.closePopover();
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
      this.editorMode = 'VIEW';
      this.closePopover();
      this.refreshGuidance();
    }
  }

  onViewBlockClick(): void {
    this.clearCanvas();
    this.selectedNode = null;
    this.activeFlowId = '';
    this.activeConnections = [];
    this.currentConfigViewMode = 'BLOCK';
    this.editorMode = 'VIEW';
    this.closePopover();
    this.refreshGuidance();
    this.cdr.detectChanges();
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
        saveFlow(flow);
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

      saveFlow(newFlow);
      this.selectFlow(newId);
      this.message.success('Flow created successfully!');
      this.refreshGuidance();
    }

    this.isFlowModalVisible = false;
    this.cdr.detectChanges();
  }

  handleFlowModalCancel() {
    this.isFlowModalVisible = false;
  }

  selectFlow(flowId: string) {
    if (this.activeFlowId) {
      this.updateActiveConnections();
    }
    this.currentConfigViewMode = 'FLOW';
    this.clearCanvas();
    this.closePopover();

    this.activeFlowId = flowId;
    this.selectedNode = null;
    this.editorMode = 'VIEW';
    this.cdr.detectChanges();

    setTimeout(() => {
      const current = this.activeFlow;
      if (current) {
        current.nodes.forEach(n => this.setupNode(n));
        this.restoreConnections(current.connections || []);
        this.cdr.detectChanges();
        this.refreshGuidance();
      }
    }, 50);
  }

  deleteFlow(flowId: string, event?: MouseEvent) {
    if (event) event.stopPropagation();

    deleteFlow(flowId);

    if (this.activeFlowId === flowId) {
      const remaining = this.filteredFlows;
      if (remaining.length > 0) {
        this.selectFlow(remaining[0].id);
      } else {
        this.clearCanvas();
        this.activeFlowId = '';
        this.selectedNode = null;
        this.activeConnections = [];
        this.editorMode = 'VIEW';
        this.closePopover();
      }
    }
    this.refreshGuidance();
    this.cdr.detectChanges();
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
      const seen = new Set<string>();
      conns.forEach(c => {
        const key = `${c.sourceInstanceId}:${c.sourcePortId}->${c.targetInstanceId}:${c.targetPortId}`;
        if (seen.has(key)) return;
        seen.add(key);

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

  enterEditMode(): void {
    if (!this.activeFlow) {
      this.message.warning('No flow selected.');
      return;
    }
    this.editorMode = 'EDIT';
    this.leftPanelMode = 'Nodes';
    this.refreshAllEndpointsForMode();
    this.cdr.detectChanges();
    this.message.info('Edit mode enabled. Make your changes and click Save.');
  }

  private refreshAllEndpointsForMode(): void {
    if (!this.activeFlow) return;
    const current = this.activeFlow;
    current.nodes.forEach(n => {
      this.refreshNodeEndpoints(n);
    });
  }

  saveCurrentFlow() {
    if (!this.activeFlow) {
      this.message.warning('No active flow available to save.');
      return;
    }

    this.updateActiveConnections();
    this.deduplicateActiveConnections();
    this.syncToDataModel();
    saveFlow(this.activeFlow);
    this.showFlowDebug = JSON.stringify(this.activeFlow, null, 2);
    this.message.success('Flow saved successfully!');
    console.log('SAVED FLOW IS:', this.showFlowDebug);

    this.editorMode = 'VIEW';
    this.currentConfigViewMode = 'FLOW';
    this.leftPanelMode = 'Block';
    this.refreshAllEndpointsForMode();
    this.closePopover();
    this.refreshGuidance();
    this.cdr.detectChanges();
  }

  /**
   * Removes any duplicate connections (same source+port -> target+port).
   */
  private deduplicateActiveConnections() {
    const seen = new Set<string>();
    const uniqueConns: ConnectionRecord[] = [];

    for (const c of this.activeConnections) {
      const key = `${c.sourceInstanceId}:${c.sourcePortId}->${c.targetInstanceId}:${c.targetPortId}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueConns.push(c);
      }
    }

    this.activeConnections = uniqueConns;
    if (this.activeFlow) {
      this.activeFlow.connections = uniqueConns;
    }
  }

  private initJsPlumb() {
    if (!this.container) return;

    this.instance = newInstance({
      container: this.container.nativeElement,
      // NOTE: Do NOT set connectionsDetachable:false globally — we want it
      // to be mode-dependent (endpoint-level config controls it).
      dragOptions: {
        stop: (params: any) => {
          if (this.isViewMode) return;
          const el = params.el as HTMLElement;
          if (el && this.activeFlow) {
            const instanceId = el.getAttribute('id');
            const targetNode = this.activeFlow.nodes.find(n => n.instanceId === instanceId);
            if (targetNode) {
              targetNode.uiLayout.canvasX = Math.round(el.offsetLeft);
              targetNode.uiLayout.canvasY = Math.round(el.offsetTop);
              this.cdr.detectChanges();
            }
          }
        }
      }
    });

    this.instance.importDefaults({
      connector: { type: 'Flowchart', options: { cornerRadius: 5, stub: 10 } },
      paintStyle: { stroke: '#4a4a4a', strokeWidth: 3 },
      endpoint: { type: 'Rectangle', options: { width: 6, height: 16 } },
      endpointStyle: { fill: '#c2c2c2' }
      // NOTE: connectionsDetachable is intentionally NOT set here.
      // It is set per-endpoint in setupNode() based on current mode.
    });

    this.instance.bind(EVENT_CONNECTION_CLICK, (conn: any, originalEvent: MouseEvent) => {
      if (originalEvent) {
        originalEvent.stopPropagation();
        originalEvent.preventDefault();
      }

      if (!this.activeFlow) return;

      const sourceId = conn.sourceId || conn.source?.id;
      const targetId = conn.targetId || conn.target?.id;

      const sourceNode = this.activeFlow.nodes.find(n => n.instanceId === sourceId);
      const targetNode = this.activeFlow.nodes.find(n => n.instanceId === targetId);

      const sPortId = this.getPortIdFromEndpoint(conn.endpoints?.[0]);
      const tPortId = this.getPortIdFromEndpoint(conn.endpoints?.[1]);

      const sourcePort = sourceNode?.ports.find(p => p.id === sPortId) || null;
      const targetPort = targetNode?.ports.find(p => p.id === tPortId) || null;

      const activeConn = this.activeConnections.find(
        ac => ac.sourceInstanceId === sourceId &&
          ac.targetInstanceId === targetId &&
          ac.sourcePortId === sPortId &&
          ac.targetPortId === tPortId
      ) || null;

      const pageX = originalEvent?.clientX || window.innerWidth / 2;
      const pageY = originalEvent?.clientY || window.innerHeight / 2;

      this.popoverPosition = { x: pageX, y: pageY - 15 };
      this.popoverState = {
        activeMode: 'MAPPER_ACTIVE',
        sourceNode: sourceNode || null,
        sourcePort: sourcePort,
        targetNode: targetNode || null,
        targetPort: targetPort,
        connection: activeConn,
        mappings: this.buildMappingPairs(sourcePort, targetPort, activeConn)
      };

      this.resetPopoverState();
      this.isPopoverVisible = true;
      this.cdr.detectChanges();
    });

    this.instance.bind('connection', (info: any) => {
      if (this.isProgrammaticConnecting) return;

      // In view mode, immediately undo any user-initiated connection.
      if (this.isViewMode) {
        try { this.instance.deleteConnection(info.connection); } catch (e) { }
        return;
      }

      if (info.sourceId === info.targetId) {
        try { this.instance.deleteConnection(info.connection); } catch (e) { }
        return;
      }

      if (this.isDuplicateConnection(info.connection)) {
        try { this.instance.deleteConnection(info.connection); } catch (e) { }
        return;
      }

      this.updateActiveConnections();
    });

    // ---- Detach handling ----
    // VIEW MODE  : disallow detach -> recreate the connection we just lost.
    // EDIT MODE  : allow detach    -> just refresh connection list.
    const handleDetach = (info?: any) => {
      if (this.isProgrammaticConnecting) return;

      if (this.isViewMode) {
        // Recreate connection that was (somehow) detached in view mode.
        if (info && info.connection) {
          const sourceId = info.connection.sourceId;
          const targetId = info.connection.targetId;
          const sPortId = this.getPortIdFromEndpoint(info.connection.endpoints?.[0]);
          const tPortId = this.getPortIdFromEndpoint(info.connection.endpoints?.[1]);

          if (sourceId && targetId && sPortId && tPortId) {
            setTimeout(() => {
              try {
                this.isProgrammaticConnecting = true;
                this.instance.connect({
                  uuids: [`${sourceId}-${sPortId}`, `${targetId}-${tPortId}`]
                });
              } catch (e) { } finally {
                this.isProgrammaticConnecting = false;
              }
              this.updateActiveConnections();
            }, 0);
          }
        }
        return;
      }

      // EDIT MODE: refresh connection list after detach.
      setTimeout(() => {
        this.updateActiveConnections();
      }, 20);
    };

    this.instance.bind('connection:detach', handleDetach);
    this.instance.bind('connection:remove', (info: any) => {
      if (this.isProgrammaticConnecting) return;

      // If view mode and something got removed, restore it.
      if (this.isViewMode) {
        handleDetach(info);
        return;
      }

      setTimeout(() => {
        this.updateActiveConnections();
      }, 20);
    });
  }

  onPortClick(event: MouseEvent, node: NodeModel, port: Port) {
    event.stopPropagation();
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    this.popoverPosition = { x: rect.left + rect.width / 2, y: rect.top - 10 };

    const isOutput = port.portType === 'OUTPUT';
    this.popoverState = {
      activeMode: isOutput ? 'OUTPUT_ONLY' : 'INPUT_ONLY',
      sourceNode: isOutput ? node : null,
      sourcePort: isOutput ? port : null,
      targetNode: !isOutput ? node : null,
      targetPort: !isOutput ? port : null,
      connection: null,
      mappings: []
    };

    this.resetPopoverState();
    this.isPopoverVisible = true;
    this.cdr.detectChanges();
  }

  private buildMappingPairs(sourcePort: Port | null, targetPort: Port | null, conn: ConnectionRecord | null): FieldMappingPair[] {
    if (!conn || !conn.mapping) return [];

    return conn.mapping.map(m => {
      const sourceField = sourcePort?.schema.find(f => f.id === m.sourceFieldId) || null;
      const targetField = targetPort?.schema.find(f => f.id === m.targetFieldId) || null;
      return { sourceField, targetField };
    });
  }

  openAddPopover(type: 'OUTPUT' | 'INPUT') {
    if (this.isViewMode) return;

    const isOutput = type === 'OUTPUT';
    const targetNode = isOutput ? this.popoverState.sourceNode : this.popoverState.targetNode;
    const targetPort = isOutput ? this.popoverState.sourcePort : this.popoverState.targetPort;

    let isBlockSelection = false;
    let blockSource: 'BLOCK_INPUT' | 'BLOCK_OUTPUT' | null = null;

    if (isOutput && this.isInputBlockNode(targetNode)) {
      isBlockSelection = true;
      blockSource = 'BLOCK_INPUT';
    } else if (!isOutput && this.isOutputBlockNode(targetNode)) {
      isBlockSelection = true;
      blockSource = 'BLOCK_OUTPUT';
    }

    this.schemaPopoverState = {
      targetKey: isOutput ? 'ADD_OUTPUT' : 'ADD_INPUT',
      mode: 'ADD',
      name: '',
      type: 'decimal',
      description: '',
      targetNode: targetNode,
      targetPort: targetPort,
      isBlockSchemaSelection: isBlockSelection,
      blockSchemaSource: blockSource
    };

    if (isBlockSelection) {
      this.blockSchemaOptions = this.computeBlockSchemaOptions();
      this.selectedBlockSchemaFieldId = null;
    } else {
      this.blockSchemaOptions = [];
      this.selectedBlockSchemaFieldId = null;
    }

    this.cdr.detectChanges();
  }

  resetPopoverState() {
    this.schemaPopoverState = {
      targetKey: null,
      mode: 'ADD',
      name: '',
      type: 'decimal',
      description: '',
      targetNode: null,
      targetPort: null,
      isBlockSchemaSelection: false,
      blockSchemaSource: null
    };
    this.blockSchemaOptions = [];
    this.selectedBlockSchemaFieldId = null;
    this.cdr.detectChanges();
  }

  isBlockSchemaOptionDisabled(fieldId: string): boolean {
    const opt = this.blockSchemaOptions.find(o => o.field.id === fieldId);
    return opt ? opt.disabled : false;
  }

  getBlockSchemaDisabledReason(fieldId: string): string {
    const opt = this.blockSchemaOptions.find(o => o.field.id === fieldId);
    return opt?.disabledReason || '';
  }

  get selectableBlockSchemaOptions(): BlockSchemaOption[] {
    return this.blockSchemaOptions.filter(o => !o.disabled);
  }

  saveSchema() {
    if (this.isViewMode) return;
    if (this.schemaPopoverState.isBlockSchemaSelection) {
      this.addBlockSchemaFieldToNode();
      return;
    }
    this.addCustomSchemaField();
  }

  addBlockSchemaFieldToNode() {
    const { targetNode, targetPort } = this.schemaPopoverState;

    if (!targetNode || !targetPort || !this.activeFlow) return;
    if (!this.selectedBlockSchemaFieldId) {
      this.message.warning('Please select a schema field.');
      return;
    }

    const opt = this.blockSchemaOptions.find(o => o.field.id === this.selectedBlockSchemaFieldId);
    if (!opt) {
      this.message.error('Selected schema not found.');
      return;
    }
    if (opt.disabled) {
      this.message.warning(opt.disabledReason || 'This schema field is not selectable.');
      return;
    }

    const sourceField = opt.field;

    const added = addSchemaFieldToPortInFlow(
      this.activeFlow,
      targetNode.instanceId!,
      targetPort.id,
      {
        name: sourceField.name,
        type: sourceField.type,
        description: sourceField.description || ''
      }
    );

    if (added) {
      added.id = sourceField.id;
      this.syncToDataModel();
      this.cdr.detectChanges();
      this.resetPopoverState();
      this.message.success('Block schema field added successfully!');
      this.refreshGuidance();
    } else {
      this.message.error('Failed to add schema field.');
    }
  }

  addCustomSchemaField() {
    const { targetNode, targetPort, name, type, description } = this.schemaPopoverState;
    if (!targetNode || !targetPort || !name.trim() || !this.activeFlow) return;

    const newField = addSchemaFieldToPortInFlow(
      this.activeFlow,
      targetNode.instanceId!,
      targetPort.id,
      {
        name: name.trim(),
        type: type,
        description: description.trim()
      }
    );

    if (newField) {
      this.syncToDataModel();
      this.cdr.detectChanges();
      this.resetPopoverState();
      this.message.success('Schema field added successfully!');
      this.refreshGuidance();
    }
  }

  isOutputDisabled(field: SchemaField): boolean {
    const { connection, mappings } = this.popoverState;
    if (!connection) return false;
    return mappings.some(p => p.sourceField?.id === field.id);
  }

  isInputDisabled(field: SchemaField): boolean {
    const { targetNode, targetPort, mappings } = this.popoverState;

    if (mappings.some(p => p.targetField?.id === field.id)) {
      return true;
    }

    if (!targetNode || !targetPort || !this.activeFlow) return false;
    const targetInstId = targetNode.instanceId || targetNode.nodeId;
    return isInputSchemaMappedInFlow(this.activeFlow, targetInstId, targetPort.id, field.id);
  }

  isTypeCompatible(sourceType: string, targetType: string): boolean {
    if (!sourceType || !targetType) return false;
    const s = sourceType.toLowerCase();
    const t = targetType.toLowerCase();
    if (s === t) return true;
    if ((s === 'number' || s === 'integer' || s === 'decimal') &&
      (t === 'number' || t === 'integer' || t === 'decimal')) {
      return true;
    }
    return false;
  }

  onSchemaFieldDragStart(event: DragEvent, field: SchemaField, origin: 'SOURCE' | 'TARGET') {
    if (!field) return;
    if (this.isViewMode) {
      event.preventDefault();
      return;
    }

    if (origin === 'SOURCE' && this.isOutputDisabled(field)) {
      event.preventDefault();
      return;
    }

    if (origin === 'TARGET' && this.isInputDisabled(field)) {
      event.preventDefault();
      return;
    }

    this.draggedSchemaField = { field, origin };
    event.dataTransfer?.setData('text/plain', JSON.stringify({ fieldId: field.id, origin }));
  }

  onMapperRowDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onMapperRowDrop(event: DragEvent, existingPairIndex?: number) {
    event.preventDefault();
    if (this.isViewMode) return;
    if (!this.draggedSchemaField || !this.popoverState.connection || !this.activeFlow) return;

    const { sourceNode, targetNode, sourcePort, targetPort, connection } = this.popoverState;
    if (!sourceNode || !targetNode || !sourcePort || !targetPort || !connection) return;

    let targetMappingIndex = existingPairIndex ?? this.popoverState.mappings.length;

    if (!this.popoverState.mappings[targetMappingIndex]) {
      this.popoverState.mappings[targetMappingIndex] = { sourceField: null, targetField: null };
    }

    const currentPair = this.popoverState.mappings[targetMappingIndex];

    if (this.draggedSchemaField.origin === 'SOURCE') {
      if (this.isOutputDisabled(this.draggedSchemaField.field)) {
        console.warn(`Output field ${this.draggedSchemaField.field.name} is already mapped in this connection.`);
        this.draggedSchemaField = null;
        return;
      }

      if (currentPair.targetField && !this.isTypeCompatible(this.draggedSchemaField.field.type, currentPair.targetField.type)) {
        console.warn(`Type mismatch: Cannot map ${this.draggedSchemaField.field.type} to ${currentPair.targetField.type}`);
        this.draggedSchemaField = null;
        return;
      }
      currentPair.sourceField = this.draggedSchemaField.field;
    } else {
      if (this.isInputDisabled(this.draggedSchemaField.field)) {
        console.warn(`Input field ${this.draggedSchemaField.field.name} is already mapped.`);
        this.draggedSchemaField = null;
        return;
      }

      if (currentPair.sourceField && !this.isTypeCompatible(currentPair.sourceField.type, this.draggedSchemaField.field.type)) {
        console.warn(`Type mismatch: Cannot map ${currentPair.sourceField.type} to ${this.draggedSchemaField.field.type}`);
        this.draggedSchemaField = null;
        return;
      }

      currentPair.targetField = this.draggedSchemaField.field;
    }

    if (currentPair.sourceField && currentPair.targetField) {
      addOrUpdateConnectionMappingInFlow(
        this.activeFlow,
        connection.sourceInstanceId,
        connection.targetInstanceId,
        connection.sourcePortId,
        connection.targetPortId,
        currentPair.sourceField.id,
        currentPair.targetField.id
      );
      this.syncToDataModel();
      this.refreshGuidance();
    }

    this.draggedSchemaField = null;
    this.cdr.detectChanges();
  }

  removeMappingRow(index: number) {
    if (this.isViewMode) return;

    const pair = this.popoverState.mappings[index];
    const { connection } = this.popoverState;

    if (pair && pair.sourceField && pair.targetField && connection && this.activeFlow) {
      removeConnectionMappingFromFlow(
        this.activeFlow,
        connection.sourceInstanceId,
        connection.targetInstanceId,
        connection.sourcePortId,
        connection.targetPortId,
        pair.sourceField.id,
        pair.targetField.id
      );
      this.syncToDataModel();
      this.refreshGuidance();
    }

    this.popoverState.mappings.splice(index, 1);
    this.cdr.detectChanges();
  }

  closePopover() {
    this.isPopoverVisible = false;
    this.draggedSchemaField = null;
    this.resetPopoverState();
  }

  private syncToDataModel() {
    if (this.activeFlow) {
      this.activeFlow.connections = [...this.activeConnections];
      const index = this.savedFlows.findIndex(f => f.id === this.activeFlow!.id);
      if (index !== -1) {
        const existingFlow = this.savedFlows[index];
        existingFlow.nodes = this.activeFlow.nodes;
        existingFlow.connections = this.activeFlow.connections;
        existingFlow.name = this.activeFlow.name;
        existingFlow.description = this.activeFlow.description;
        existingFlow.blockId = this.activeFlow.blockId;
      }
    }
    this.cdr.detectChanges();
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
    this.refreshGuidance();
    this.cdr.detectChanges();
  }

  public setupNode(node: NodeModel) {
    if (!node.instanceId) return;

    const el = document.getElementById(node.instanceId);
    if (!el) return;

    el.style.left = `${node.uiLayout.canvasX}px`;
    el.style.top = `${node.uiLayout.canvasY}px`;

    this.instance.manage(el);
    this.instance.setPosition(el, { x: node.uiLayout.canvasX, y: node.uiLayout.canvasY });

    try {
      this.instance.setDraggable(el, !this.isViewMode);
    } catch (e) { }

    const inputs = node.ports.filter(p => p.portType === 'INPUT');
    const outputs = node.ports.filter(p => p.portType === 'OUTPUT');

    // This is the key flag: in VIEW mode, endpoints cannot create OR detach.
    // In EDIT mode, they can create AND detach.
    const endpointsActive = !this.isViewMode;

    node.ports.forEach(port => {
      const isInput = port.portType === 'INPUT';
      const typedPorts = isInput ? inputs : outputs;
      const index = typedPorts.findIndex(p => p.id === port.id);
      const yPos = (index + 1) / (typedPorts.length + 1);

      const endpointUuid = `${node.instanceId}-${port.id}`;
      const endpointColor = '#000000';

      const epOptions: any = {
        endpoint: {
          type: 'Rectangle',
          options: { width: 6, height: 16 }
        },
        paintStyle: { fill: endpointColor },
        anchor: isInput ? [0, yPos, -1, 0] : [1, yPos, 1, 0],
        source: endpointsActive ? !isInput : false,
        target: endpointsActive ? isInput : false,
        maxConnections: -1,
        uuid: endpointUuid,
        // ---- Mode-dependent flags ----
        // EDIT: allow detach   -> connectionsDetachable: true
        // VIEW: block detach   -> connectionsDetachable: false
        connectionsDetachable: endpointsActive,
        // Prevent re-attaching a detached connection (avoids duplicates)
        reattach: endpointsActive,
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

      // Capture existing connections (deduplicated)
      const savedConnections: SavedConnectionRecord[] = [];
      const seenConnKeys = new Set<string>();

      connectionsArray.forEach((conn: any) => {
        if (conn.endpoints && conn.endpoints.length === 2) {
          const sNodeId = this.getNodeIdFromEndpoint(conn.endpoints[0]);
          const sPortId = this.getPortIdFromEndpoint(conn.endpoints[0]);
          const tNodeId = this.getNodeIdFromEndpoint(conn.endpoints[1]);
          const tPortId = this.getPortIdFromEndpoint(conn.endpoints[1]);

          if (sNodeId && sPortId && tNodeId && tPortId) {
            const connKey = `${sNodeId}:${sPortId}->${tNodeId}:${tPortId}`;
            if (seenConnKeys.has(connKey)) return;
            seenConnKeys.add(connKey);

            const activeConn = this.activeConnections.find(
              ac =>
                ac.sourceInstanceId === sNodeId &&
                ac.targetInstanceId === tNodeId &&
                ac.sourcePortId === sPortId &&
                ac.targetPortId === tPortId
            );

            savedConnections.push({
              sourceNodeId: sNodeId,
              sourcePortId: sPortId,
              targetNodeId: tNodeId,
              targetPortId: tPortId,
              mapping: activeConn?.mapping || []
            });
          }
        }
      });

      // Delete all connections before removing endpoints to prevent orphans
      this.instance.deleteEveryConnection();

      this.instance.removeAllEndpoints(el);
      this.setupNode(node);

      // Reconnect deduplicated
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

  public getPortTopPosition(node: NodeModel, port: Port): string {
    const inputs = node.ports.filter(p => p.portType === 'INPUT');
    const outputs = node.ports.filter(p => p.portType === 'OUTPUT');
    const isInput = port.portType === 'INPUT';
    const typedPorts = isInput ? inputs : outputs;
    const index = typedPorts.findIndex(p => p.id === port.id);
    const yPosRatio = (index + 1) / (typedPorts.length + 1);
    return `${yPosRatio * 100}%`;
  }

  onDragStart(event: DragEvent, node: NodeModel) {
    if (this.isViewMode) {
      event.preventDefault();
      return;
    }
    this.draggedNode = node;
    event.dataTransfer?.setData('text/plain', node.nodeId);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();

    if (this.isViewMode) {
      this.message.warning('Please click Edit to enable editing before adding nodes.');
      return;
    }

    if (!this.activeFlow) {
      this.message.warning('Please create or select a flow first before dragging nodes onto the canvas!');
      return;
    }
    if (!this.draggedNode) return;
    const rect = this.container.nativeElement.getBoundingClientRect();

    const newNode: NodeModel = JSON.parse(JSON.stringify(this.draggedNode));

    newNode.instanceId = 'NDI-' + Date.now();
    newNode.uiLayout.canvasX = Math.round((event.clientX - rect.left) / this.zoomLevel);
    newNode.uiLayout.canvasY = Math.round((event.clientY - rect.top) / this.zoomLevel);
    this.activeFlow.nodes.push(newNode);

    this.cdr.detectChanges();
    this.refreshGuidance();

    setTimeout(() => {
      this.setupNode(newNode);
    }, 0);

    this.draggedNode = null;
  }

  openContextMenu(event: MouseEvent, node: NodeModel) {
    if (this.isViewMode) return;
    event.preventDefault();
    event.stopPropagation();
    this.contextMenuNode = node;
    this.contextMenuPosition = { x: event.clientX, y: event.clientY };
    this.isContextMenuVisible = true;
  }

  @HostListener('document:click')
  closeContextMenu() {
    this.isContextMenuVisible = false;
  }

  deleteNode() {
    if (this.isViewMode) return;
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
    this.refreshGuidance();

    setTimeout(() => {
      this.updateActiveConnections();
    }, 20);
  }

  selectNode(node: NodeModel, event: MouseEvent) {
    event.stopPropagation();
    if (this.isViewMode) return;
    this.selectedNode = node;
    this.currentConfigViewMode = 'NODE';
  }

  deselectNode(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('canvas')) {
      this.selectedNode = null;
      this.currentConfigViewMode = 'FLOW';
      this.closePopover();
    }
  }

  onBack() {
    this.closePopover();
    this.router.navigate([`/units/${this.unitId}/systems/${this.systemId}/models/MDL-660e8400-e29b-41d4-a716-446655440101/schema/block-editor/`]);
  }

  // Block level schema state
  get blockInputSchemas(): SchemaField[] {
    const currentBlock = model.blocks?.find(
      b => b.instanceId === this.selectedBlockId || b.blockId === this.selectedBlockId
    );
    if (!currentBlock) return [];

    const inputSchemas: SchemaField[] = [];
    currentBlock.ports.forEach(port => {
      if (port.portType === 'INPUT' && Array.isArray(port.schema)) {
        inputSchemas.push(...port.schema);
      }
    });
    return inputSchemas;
  }

  get blockOutputSchemas(): SchemaField[] {
    const currentBlock = model.blocks?.find(
      b => b.instanceId === this.selectedBlockId || b.blockId === this.selectedBlockId
    );
    if (!currentBlock) return [];

    const outputSchemas: SchemaField[] = [];
    currentBlock.ports.forEach(port => {
      if (port.portType === 'OUTPUT' && Array.isArray(port.schema)) {
        outputSchemas.push(...port.schema);
      }
    });
    return outputSchemas;
  }

  getFlowInputSchemas(flow: SavedFlow): SchemaField[] {
    const inputNode = flow.nodes.find(n => n.nodeType === 'INPUT');
    if (!inputNode) return [];
    return inputNode.ports.flatMap(p => p.schema || []);
  }

  getFlowOutputSchemas(flow: SavedFlow): SchemaField[] {
    const outputNode = flow.nodes.find(n => n.nodeType === 'OUTPUT');
    if (!outputNode) return [];
    return outputNode.ports.flatMap(p => p.schema || []);
  }

  isOutputFieldUsedByFlow(fieldId: string): boolean {
    const flowsForBlock = this.savedFlows.filter(f => f.blockId === this.selectedBlockId);

    for (const flow of flowsForBlock) {
      if (flow.connections) {
        const isMappedInConnection = flow.connections.some(conn =>
          conn.mapping?.some(m => m.sourceFieldId === fieldId || m.targetFieldId === fieldId)
        );
        if (isMappedInConnection) return true;
      }
      if (flow.nodes) {
        const isUsedInNode = flow.nodes.some(node =>
          node.ports.some(port =>
            port.schema?.some(f => f.id === fieldId)
          )
        );
        if (isUsedInNode) return true;
      }
    }

    return false;
  }
}