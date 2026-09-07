import {
  Component, ElementRef, ViewChild, AfterViewInit, OnInit,
  EventEmitter, Output, HostListener, ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { newInstance, BrowserJsPlumbInstance, EVENT_CONNECTION_CLICK } from '@jsplumb/browser-ui';
import { ActivatedRoute, Router } from '@angular/router';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzSplitterModule } from 'ng-zorro-antd/splitter';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';

import { BlockConfigPannel } from '../../components/right-side-panel/block-config-pannel/block-config-pannel';
import {
  model, updateModel, getBlocks, getModelSchema,
  BlockModel, ConnectionRecord, SavedConnectionRecord, ConsoleError, systemNodes, blockNodes, validateFlowGuidance,
  GuidanceState, getBlocksConfigurationStatus, getMappedConnectionDetails, SchemaField, Port,
  addSchemaFieldToPort, addOrUpdateConnectionMapping, removeConnectionMapping, isInputSchemaMapped
} from './data';

interface FieldMappingPair {
  sourceField: SchemaField | null;
  targetField: SchemaField | null;
}

interface ExpandedPopoverState {
  activeMode: 'OUTPUT_ONLY' | 'INPUT_ONLY' | 'MAPPER_ACTIVE';
  sourceNode: BlockModel | null;
  sourcePort: Port | null;
  targetNode: BlockModel | null;
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
  targetNode: BlockModel | null;
  targetPort: Port | null;
}

@Component({
  selector: 'app-block-editor',
  standalone: true,
  imports: [
    CommonModule, FormsModule, NzButtonModule, NzBreadCrumbModule,
    NzSplitterModule, NzIconModule, NzTooltipModule,
    NzDividerModule, BlockConfigPannel, NzStepsModule, NzPopoverModule,
    NzInputModule, NzSelectModule
  ],
  templateUrl: './block-editor.html',
  styleUrl: './block-editor.css'
})
export class BlockEditor implements AfterViewInit, OnInit {
  @Output() fullscreenChange = new EventEmitter<boolean>();
  @ViewChild('container') container!: ElementRef;
  guidance: GuidanceState = validateFlowGuidance([], []);

  instance!: BrowserJsPlumbInstance;
  selectedNode: BlockModel | null = null;
  systemNodes = systemNodes;
  blockNodes = blockNodes;

  systemId: string = 'SYS-101';
  unitId: string = 'UNIT-802';
  modelId: string = 'MODEL-v2.1';
  pipelineId: string = '958769348796';
  isFullscreen: boolean = false;

  consoleErrors: ConsoleError[] = [];
  activeConnections: ConnectionRecord[] = [];

  private isProgrammaticConnecting = false;

  zoomLevel: number = 1.0;
  private readonly MIN_ZOOM: number = 0.3;
  private readonly MAX_ZOOM: number = 2.5;
  private readonly ZOOM_STEP: number = 0.1;

  isContextMenuVisible = false;
  contextMenuPosition = { x: 0, y: 0 };
  contextMenuNode: BlockModel | null = null;

  flowNodes: BlockModel[] = [];
  draggedNode: BlockModel | null = null;

  // Connector Mapping Popover State
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

  // Inline Field Add/Edit Popover Form State
  schemaPopoverState: SchemaPopoverState = {
    targetKey: null,
    mode: 'ADD',
    name: '',
    type: 'decimal',
    description: '',
    targetNode: null,
    targetPort: null
  };

  draggedSchemaField: { field: SchemaField; origin: 'SOURCE' | 'TARGET' } | null = null;

  constructor(
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.unitId = params.get('unitId') || this.unitId;
      this.systemId = params.get('systemId') || this.systemId;
      this.modelId = params.get('modelId') || this.modelId;
      this.pipelineId = params.get('pipelineId') || this.pipelineId;
    });

    this.loadModelFromData();
    this.updateGuidance();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initJsPlumb();
      this.renderLoadedModel();
    });
  }

  updateGuidance() {
    this.guidance = validateFlowGuidance(this.flowNodes, this.activeConnections);
    this.cdr.detectChanges();
  }

  private loadModelFromData() {
    if (model) {
      this.pipelineId = model.modelId || this.pipelineId;
      this.modelId = model.modelVersion || this.modelId;

      const loadedBlocks: BlockModel[] = JSON.parse(JSON.stringify(model.blocks || []));

      this.flowNodes = loadedBlocks.map((block: any) => {
        const x = block.uiLayout?.canvasX ?? block.uiLayout?.x ?? 0;
        const y = block.uiLayout?.canvasY ?? block.uiLayout?.y ?? 0;

        if (!block.uiLayout) {
          block.uiLayout = {
            canvasX: Number(x),
            canvasY: Number(y),
            canvasWidth: 160,
            canvasHeight: 60,
            color: '#4a8bdc',
            icon: 'setting'
          };
        } else {
          block.uiLayout.canvasX = Number(x);
          block.uiLayout.canvasY = Number(y);
        }
        return block;
      });

      this.activeConnections = JSON.parse(JSON.stringify(model.connections || []));
    }
  }

  private renderLoadedModel() {
    this.cdr.detectChanges();

    this.isProgrammaticConnecting = true;
    try {
      this.flowNodes.forEach(node => {
        this.setupNode(node);
      });

      this.activeConnections.forEach(conn => {
        const sUuid = `${conn.sourceInstanceId}-${conn.sourcePortId}`;
        const tUuid = `${conn.targetInstanceId}-${conn.targetPortId}`;
        try {
          this.instance.connect({ uuids: [sUuid, tUuid] });
        } catch (e) {
          console.error('Failed to establish initial connection:', e);
        }
      });
    } finally {
      this.isProgrammaticConnecting = false;
    }
    this.updateActiveConnections();
  }

  private initJsPlumb() {
    this.instance = newInstance({
      container: this.container.nativeElement,
      dragOptions: {
        stop: (params: any) => {
          const el = params.el as HTMLElement;
          if (el) {
            const instanceId = el.getAttribute('id');
            const targetNode = this.flowNodes.find(n => n.instanceId === instanceId);
            if (targetNode) {
              targetNode.uiLayout.canvasX = Math.round(el.offsetLeft);
              targetNode.uiLayout.canvasY = Math.round(el.offsetTop);
              this.syncToDataModel();
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
    });

    this.instance.bind(EVENT_CONNECTION_CLICK, (conn: any, originalEvent: MouseEvent) => {
      if (originalEvent) {
        originalEvent.stopPropagation();
        originalEvent.preventDefault();
      }

      const sourceId = conn.sourceId || conn.source?.id;
      const targetId = conn.targetId || conn.target?.id;

      const sourceNode = this.flowNodes.find(n => n.instanceId === sourceId);
      const targetNode = this.flowNodes.find(n => n.instanceId === targetId);

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

  onPortClick(event: MouseEvent, node: BlockModel, port: Port) {
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

    if (!targetNode || !targetPort) return false;
    const targetInstId = targetNode.instanceId || targetNode.blockId;
    return isInputSchemaMapped(targetInstId, targetPort.id, field.id);
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
    if (!this.draggedSchemaField || !this.popoverState.connection) return;

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
      addOrUpdateConnectionMapping(
        connection.sourceInstanceId,
        connection.targetInstanceId,
        connection.sourcePortId,
        connection.targetPortId,
        currentPair.sourceField.id,
        currentPair.targetField.id
      );
      this.syncToDataModel();
    }

    this.draggedSchemaField = null;
    this.cdr.detectChanges();
  }

  removeMappingRow(index: number) {
    const pair = this.popoverState.mappings[index];
    const { connection } = this.popoverState;

    if (pair && pair.sourceField && pair.targetField && connection) {
      removeConnectionMapping(
        connection.sourceInstanceId,
        connection.targetInstanceId,
        connection.sourcePortId,
        connection.targetPortId,
        pair.sourceField.id,
        pair.targetField.id
      );
      this.syncToDataModel();
    }

    this.popoverState.mappings.splice(index, 1);
    this.cdr.detectChanges();
  }

  // Schema Popover Handlers
  openAddPopover(type: 'OUTPUT' | 'INPUT') {
    const isOutput = type === 'OUTPUT';
    this.schemaPopoverState = {
      targetKey: isOutput ? 'ADD_OUTPUT' : 'ADD_INPUT',
      mode: 'ADD',
      name: '',
      type: 'decimal',
      description: '',
      targetNode: isOutput ? this.popoverState.sourceNode : this.popoverState.targetNode,
      targetPort: isOutput ? this.popoverState.sourcePort : this.popoverState.targetPort
    };

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
      targetPort: null
    };
    this.cdr.detectChanges();
  }

  saveSchema() {
    const { targetNode, targetPort, name, type, description } = this.schemaPopoverState;
    if (!targetNode || !targetPort || !name.trim()) return;

    const createdField = addSchemaFieldToPort(targetNode.instanceId || targetNode.blockId, targetPort.id, {
      name: name.trim(),
      type: type,
      description: description.trim()
    });

    if (createdField) {
      this.syncToDataModel();
      this.cdr.detectChanges();
    }

    this.resetPopoverState();
  }

  deselectAll(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.classList.contains('canvas') || target.classList.contains('canvas-viewport')) {
      this.selectedNode = null;
      this.isPopoverVisible = false;
    }
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
    const raw = this.instance.getConnections();
    const connectionsArray = Array.isArray(raw) ? raw : Object.values(raw);

    const seen = new Set<string>();
    const list: ConnectionRecord[] = [];

    connectionsArray.forEach((c: any) => {
      const sourceInstId = c.sourceId || c.source?.id;
      const targetInstId = c.targetId || c.target?.id;
      const sourcePortId = this.getPortIdFromEndpoint(c.endpoints?.[0]);
      const targetPortId = this.getPortIdFromEndpoint(c.endpoints?.[1]);

      if (sourceInstId && targetInstId && sourcePortId && targetPortId) {
        const connectionKey = `${sourceInstId}:${sourcePortId}->${targetInstId}:${targetPortId}`;
        if (!seen.has(connectionKey)) {
          seen.add(connectionKey);

          const existingConn = this.activeConnections.find(
            ac =>
              ac.sourceInstanceId === sourceInstId &&
              ac.targetInstanceId === targetInstId &&
              ac.sourcePortId === sourcePortId &&
              ac.targetPortId === targetPortId
          );

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
    this.syncPositionsToModel();
    this.syncToDataModel();
    this.updateGuidance();
  }

  private syncPositionsToModel() {
    this.flowNodes.forEach(node => {
      const el = document.getElementById(node.instanceId!);
      if (el) {
        node.uiLayout.canvasX = Math.round(el.offsetLeft);
        node.uiLayout.canvasY = Math.round(el.offsetTop);
      }
    });
  }

  public syncToDataModel() {
    this.syncPositionsToModel();

    const updatedModel = updateModel({
      modelId: this.pipelineId,
      systemId: this.systemId,
      modelVersion: this.modelId,
      entityType: 'MODEL',
      name: 'Tata Power Plant Model',
      description: 'Description of tata power plant model',
      blocks: this.flowNodes,
      connections: this.activeConnections
    });

    getBlocks();
    getModelSchema(updatedModel);
    getBlocksConfigurationStatus(updatedModel);
    getMappedConnectionDetails(updatedModel);

    console.log("[Auto-Saved] Canvas & Model State Updated.", JSON.stringify(updatedModel, null, 2));
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

  public getPortTopPosition(node: BlockModel, port: Port): string {
    const inputs = node.ports.filter(p => p.portType === 'INPUT');
    const outputs = node.ports.filter(p => p.portType === 'OUTPUT');
    const isInput = port.portType === 'INPUT';
    const typedPorts = isInput ? inputs : outputs;
    const index = typedPorts.findIndex(p => p.id === port.id);
    const yPosRatio = (index + 1) / (typedPorts.length + 1);
    return `${yPosRatio * 100}%`;
  }

  public setupNode(node: BlockModel) {
    const el = document.getElementById(node.instanceId!);
    if (!el) return;

    el.style.left = `${node.uiLayout.canvasX}px`;
    el.style.top = `${node.uiLayout.canvasY}px`;

    this.instance.manage(el);
    this.instance.setPosition(el, { x: node.uiLayout.canvasX, y: node.uiLayout.canvasY });

    const inputs = node.ports.filter(p => p.portType === 'INPUT');
    const outputs = node.ports.filter(p => p.portType === 'OUTPUT');

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

  public refreshNodeEndpoints(node: BlockModel) {
    const el = document.getElementById(node.instanceId!);
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

      this.instance.removeAllEndpoints(el);
      this.setupNode(node);

      savedConnections.forEach(record => {
        const sUuid = `${record.sourceNodeId}-${record.sourcePortId}`;
        const tUuid = `${record.targetNodeId}-${record.targetPortId}`;

        try {
          this.instance.connect({ uuids: [sUuid, tUuid] });
        } catch (e) {
          console.error('Failed to reconnect endpoint:', e);
        }
      });

    } finally {
      this.isProgrammaticConnecting = false;
    }

    this.updateActiveConnections();
  }

  onDragStart(event: DragEvent, node: BlockModel) {
    this.draggedNode = node;
    event.dataTransfer?.setData('text/plain', node.blockId);
  }

  onDragOver(event: DragEvent) { event.preventDefault(); }

  onDrop(event: DragEvent) {
    event.preventDefault();
    if (!this.draggedNode) return;

    const rect = this.container.nativeElement.getBoundingClientRect();
    const newNode: BlockModel = JSON.parse(JSON.stringify(this.draggedNode));

    newNode.instanceId = 'BKI-' + Date.now();

    newNode.uiLayout.canvasX = Math.round((event.clientX - rect.left) / this.zoomLevel);
    newNode.uiLayout.canvasY = Math.round((event.clientY - rect.top) / this.zoomLevel);

    this.flowNodes.push(newNode);
    this.cdr.detectChanges();
    this.setupNode(newNode);
    this.draggedNode = null;

    this.syncToDataModel();
    this.updateGuidance();
  }

  openContextMenu(event: MouseEvent, node: BlockModel) {
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
    if (!this.contextMenuNode) return;
    const el = document.getElementById(this.contextMenuNode.instanceId!);
    if (el) {
      this.instance.removeAllEndpoints(el);
      this.instance.unmanage(el);
    }
    this.flowNodes = this.flowNodes.filter(n => n.instanceId !== this.contextMenuNode!.instanceId);
    if (this.selectedNode?.instanceId === this.contextMenuNode.instanceId) {
      this.selectedNode = null;
    }

    setTimeout(() => {
      this.updateActiveConnections();
    }, 20);
  }

  toggleFullscreen() {
    this.isFullscreen = !this.isFullscreen;
    this.fullscreenChange.emit(this.isFullscreen);
  }

  selectNode(node: BlockModel, event: MouseEvent) {
    event.stopPropagation();
    this.selectedNode = node;
  }

  onBack() {
    this.router.navigate([`/units/${this.unitId}/systems/${this.systemId}/models/MDL-660e8400-e29b-41d4-a716-446655440101/schema/`]);
  }

  goToFlowEditor(targetNode?: BlockModel | null) {
    const nodeToUse = targetNode || this.contextMenuNode || this.selectedNode;

    if (!nodeToUse?.instanceId) {
      console.warn('No valid node instance ID available for navigation.');
      return;
    }

    this.router.navigate([
      `/units/${this.unitId}/systems/${this.systemId}/models/MDL-660e8400-e29b-41d4-a716-446655440101/schema/flow-editor/${nodeToUse.instanceId}`
    ]);
  }

  getDataTypeColor(type: string): string {
    const t = type?.toLowerCase();
    switch (t) {
      case 'number':
      case 'integer':
        return '#e6f7ff';
      case 'decimal':
        return '#fff0f6';
      case 'string':
        return '#f6ffed';
      default:
        return '#f5f5f5';
    }
  }

  getDataTypeTextColor(type: string): string {
    const t = type?.toLowerCase();
    switch (t) {
      case 'number':
      case 'integer':
        return '#1890ff';
      case 'decimal':
        return '#eb2f96';
      case 'string':
        return '#52c41a';
      default:
        return '#595959';
    }
  }
}