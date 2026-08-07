import {
  Component, ElementRef, ViewChild, AfterViewInit, OnInit,
  EventEmitter, Output, HostListener, ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { newInstance, BrowserJsPlumbInstance } from '@jsplumb/browser-ui';
import { ActivatedRoute } from '@angular/router';

// NG-ZORRO Imports
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzSplitterModule } from 'ng-zorro-antd/splitter';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzModalModule } from 'ng-zorro-antd/modal';

import { BlockConfigPannel } from '../../components/right-side-panel/block-config-pannel/block-config-pannel';

export interface SchemaField {
  name: string;
  type: string;
  description: string;
}

export interface Port {
  id: string;
  name: string;
  portType: 'INPUT' | 'OUTPUT';
  portOrder: number;
  schema: SchemaField[];
}

export interface UiLayout {
  canvasX: number;
  canvasY: number;
  canvasWidth: number;
  canvasHeight: number;
  color: string;
  icon: string;
}

export interface NodeModel {
  id?: string;
  blockId: string;
  instanceId?: string;
  name: string;
  description?: string;
  blockType: string;
  category: string;
  ports: Port[];
  uiLayout: UiLayout;
  flows: any[];
  hasError?: boolean;
  errors?: string[];
}

@Component({
  selector: 'app-configure-page',
  standalone: true,
  imports: [
    CommonModule, FormsModule, NzButtonModule, NzBreadCrumbModule,
    NzSplitterModule, NzIconModule, NzTooltipModule,
    NzDividerModule, NzModalModule, BlockConfigPannel
  ],
  templateUrl: './configure-page.html',
  styleUrl: './configure-page.css'
})
export class ConfigurePage implements AfterViewInit, OnInit {
  @Output() fullscreenChange = new EventEmitter<boolean>();
  @ViewChild('container') container!: ElementRef;

  instance!: BrowserJsPlumbInstance;
  selectedNode: NodeModel | null = null;

  systemId: string = 'SYS-101';
  unitId: string = 'UNIT-802';
  modelId: string = 'MODEL-v2.1';
  pipelineId: string = '958769348796';
  isFullscreen: boolean = false;
  showFlow: any;

  // Prevent event loops during programmatic updates
  private isProgrammaticConnecting = false;

  // Zoom management
  zoomLevel: number = 1.0;
  private readonly MIN_ZOOM: number = 0.3;
  private readonly MAX_ZOOM: number = 2.5;
  private readonly ZOOM_STEP: number = 0.1;

  isContextMenuVisible = false;
  contextMenuPosition = { x: 0, y: 0 };
  contextMenuNode: NodeModel | null = null;

  systemSchema = {
    INPUT: [
      { name: "AT", type: "decimal", description: "Ambient Temperature" },
      { name: "V", type: "number", description: "Exhaust Vacuum" },
      { name: "AP", type: "decimal", description: "Ambient Pressure" },
      { name: "RH", type: "decimal", description: "Relative Humidity" }
    ],
    OUTPUT: [
      { name: "PO", type: "decimal", description: "Power Output" },
      { name: "AP", type: "decimal", description: "Average Output" },
      { name: "EO", type: "decimal", description: "Energy Output" }
    ]
  };

  systemNodes: NodeModel[] = [
    {
      blockId: "BLK-input-001",
      name: "input",
      blockType: "INPUT",
      category: "system",
      ports: [
        {
          id: "PORT-OUT-001", name: "output_1", portType: "OUTPUT", portOrder: 1, schema: [
            { name: "AT", type: "decimal", description: "Ambient Temperature" },
            { name: "V", type: "number", description: "Exhaust Vacuum" }
          ]
        },
        {
          id: "PORT-OUT-002", name: "output_2", portType: "OUTPUT", portOrder: 2, schema: [
            { name: "AP", type: "decimal", description: "Ambient Pressure" },
            { name: "RH", type: "decimal", description: "Relative Humidity" }
          ]
        }
      ],
      uiLayout: { canvasX: 0, canvasY: 0, canvasWidth: 150, canvasHeight: 50, color: "#4a8bdc", icon: "arrow-right" },
      flows: []
    },
    {
      blockId: "BLK-output-001",
      name: "output",
      blockType: "OUTPUT",
      category: "system",
      ports: [
        {
          id: "PORT-IN-001", name: "input_1", portType: "INPUT", portOrder: 1, schema: [
            { name: "PO", type: "decimal", description: "Power Output" },
            { name: "AP", type: "decimal", description: "Average Output" }
          ]
        },
        {
          id: "PORT-IN-002", name: "input_2", portType: "INPUT", portOrder: 2, schema: [
            { name: "EO", type: "decimal", description: "Energy Output" }
          ]
        }
      ],
      uiLayout: { canvasX: 0, canvasY: 0, canvasWidth: 150, canvasHeight: 50, color: "#4f8b63", icon: "file" },
      flows: []
    }
  ];

  blockNodes: NodeModel[] = [
    {
      blockId: "BLK-processor-001",
      name: "Custom Block",
      blockType: "PROCESSOR",
      category: "custom",
      ports: [
        {
          id: "PORT-IN-001", name: "input_1", portType: "INPUT", portOrder: 1, schema: [
            { name: "AT", type: "decimal", description: "Ambient Temperature" },
            { name: "V", type: "number", description: "Exhaust Vacuum" }
          ]
        },
        {
          id: "PORT-OUT-001", name: "output_1", portType: "OUTPUT", portOrder: 1, schema: [
            { name: "PO", type: "decimal", description: "Power Output" },
            { name: "AP", type: "decimal", description: "Average Output" }
          ]
        }
      ],
      uiLayout: { canvasX: 0, canvasY: 0, canvasWidth: 160, canvasHeight: 60, color: "#b38338", icon: "setting" },
      flows: []
    }
  ];

  flowNodes: NodeModel[] = [];
  draggedNode: NodeModel | null = null;

  constructor(private route: ActivatedRoute, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.unitId = params.get('unitId') || this.unitId;
      this.systemId = params.get('systemId') || this.systemId;
      this.modelId = params.get('modelId') || this.modelId;
      this.pipelineId = params.get('pipelineId') || this.pipelineId;
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initJsPlumb();
      this.loadFlowData();
    });
  }

  private initJsPlumb() {
    this.instance = newInstance({ container: this.container.nativeElement });
    this.instance.importDefaults({
      connector: { type: 'Flowchart', options: { cornerRadius: 5, stub: 10 } },
      paintStyle: { stroke: '#4a4a4a', strokeWidth: 2 },
      endpoint: { type: 'Dot', options: { radius: 5 } },
      endpointStyle: { fill: '#4a4a4a' }
    });

    // Handle connection events
    this.instance.bind('connection', (info: any) => {
      if (this.isProgrammaticConnecting) return;

      // Prevent duplicate connection on drop
      if (this.isDuplicateConnection(info.connection)) {
        this.instance.deleteConnection(info.connection);
        return;
      }

      this.validateConnection(info);
    });

    this.instance.bind('connection:detach', () => {
      if (this.isProgrammaticConnecting) return;
      this.validateAllConnections();
    });
  }

  private loadFlowData() { }

  private getPortIdFromEndpoint(ep: any): string | null {
    if (!ep) return null;
    return ep.data?.portId || ep.userAttribute?.portId || ep.payload?.portId || null;
  }

  private getPortUuid(ep: any): string | null {
    if (!ep) return null;
    const nodeId = ep.data?.nodeId || ep.element?.id;
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

  // --- Connection & Schema Validation ---
  // Replace your existing validateConnection method with this one:
  private validateConnection(info: any) {
    const conn = info.connection;
    if (!conn) return;

    const sourcePortId = this.getPortIdFromEndpoint(info.sourceEndpoint) || this.getPortIdFromEndpoint(conn.endpoints?.[0]);
    const targetPortId = this.getPortIdFromEndpoint(info.targetEndpoint) || this.getPortIdFromEndpoint(conn.endpoints?.[1]);

    const sourceInstId = info.source?.id || conn.sourceId;
    const targetInstId = info.target?.id || conn.targetId;

    const sourceNode = this.flowNodes.find(n => n.instanceId === sourceInstId);
    const targetNode = this.flowNodes.find(n => n.instanceId === targetInstId);

    if (!sourceNode || !targetNode) return;

    const sourcePort = sourceNode.ports.find(p => p.id === sourcePortId);
    const targetPort = targetNode.ports.find(p => p.id === targetPortId);

    if (!sourcePort || !targetPort) return;

    let isValid = true;
    const errorMessages: string[] = [];

    // Check 1: Port schema field count
    if (sourcePort.schema.length !== targetPort.schema.length) {
      isValid = false;
      errorMessages.push(`Field count mismatch: Source '${sourceNode.name}' (${sourcePort.name}) has ${sourcePort.schema.length} fields, target '${targetNode.name}' (${targetPort.name}) has ${targetPort.schema.length} fields.`);
    }

    // Check 2: Schema field existence and data type match
    targetPort.schema.forEach(targetField => {
      const matchingSourceField = sourcePort.schema.find(s => s.name === targetField.name);

      if (!matchingSourceField) {
        isValid = false;
        errorMessages.push(`Missing Field: Field '${targetField.name}' is missing in source '${sourceNode.name}' (${sourcePort.name}).`);
      } else if (matchingSourceField.type.toLowerCase() !== targetField.type.toLowerCase()) {
        isValid = false;
        errorMessages.push(`Type Mismatch: Field '${targetField.name}' expected '${targetField.type}', but received '${matchingSourceField.type}' from '${sourceNode.name}'.`);
      }
    });

    // --- FIX HERE: Update target node error state ---
    if (!isValid) {
      targetNode.hasError = true;
      if (!targetNode.errors) targetNode.errors = [];
      targetNode.errors.push(...errorMessages);
    }

    // Highlight connector line red or clear error style
    this.markConnectorStyle(conn, isValid);

    // Re-run validateAllConnections to recalculate error states across all nodes cleanly
    this.validateAllConnections();
  }

  private markConnectorStyle(conn: any, isValid: boolean) {
    setTimeout(() => {
      const svgConnector = conn.canvas || conn.connector?.canvas;
      if (svgConnector) {
        if (!isValid) {
          svgConnector.classList.add('error-connector');
        } else {
          svgConnector.classList.remove('error-connector');
        }
      }
    }, 10);
  }

  public validateAllConnections() {
    // Step 1: Reset errors on all nodes first
    this.flowNodes.forEach(n => {
      n.hasError = false;
      n.errors = [];
    });

    const raw = this.instance.getConnections();
    const connectionsArray = Array.isArray(raw) ? raw : Object.values(raw);

    connectionsArray.forEach((conn: any) => {
      if (!conn) return;

      const sourceInstId = conn.sourceId;
      const targetInstId = conn.targetId;

      const sourcePortId = this.getPortIdFromEndpoint(conn.endpoints?.[0]);
      const targetPortId = this.getPortIdFromEndpoint(conn.endpoints?.[1]);

      const sourceNode = this.flowNodes.find(n => n.instanceId === sourceInstId);
      const targetNode = this.flowNodes.find(n => n.instanceId === targetInstId);

      if (!sourceNode || !targetNode) return;

      const sourcePort = sourceNode.ports.find(p => p.id === sourcePortId);
      const targetPort = targetNode.ports.find(p => p.id === targetPortId);

      if (!sourcePort || !targetPort) return;

      let connError = false;

      if (sourcePort.schema.length !== targetPort.schema.length) {
        connError = true;
      }

      targetPort.schema.forEach(targetField => {
        const matchingSourceField = sourcePort.schema.find(s => s.name === targetField.name);

        if (!matchingSourceField) {
          connError = true;
          const err = `Field '${targetField.name}' is missing in connection from ${sourceNode.name} (${sourcePort.name})`;
          targetNode.hasError = true;
          if (!targetNode.errors) targetNode.errors = [];
          targetNode.errors.push(err);
        } else if (matchingSourceField.type.toLowerCase() !== targetField.type.toLowerCase()) {
          connError = true;
          const err = `Type mismatch for field '${targetField.name}': required '${targetField.type}', but received '${matchingSourceField.type}' from ${sourceNode.name}`;
          targetNode.hasError = true;
          if (!targetNode.errors) targetNode.errors = [];
          targetNode.errors.push(err);
        }
      });

      if (connError) {
        targetNode.hasError = true; // --- Mark the Block Red ---
      }

      this.markConnectorStyle(conn, !connError); // --- Mark the Connector Red ---
    });

    this.cdr.detectChanges();
  }

  // --- Zoom Logic & Mouse Wheel Support ---
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

  public setupNode(node: NodeModel) {
    const el = document.getElementById(node.instanceId!);
    if (!el) return;

    this.instance.manage(el);

    const inputs = node.ports.filter(p => p.portType === 'INPUT');
    const outputs = node.ports.filter(p => p.portType === 'OUTPUT');

    node.ports.forEach(port => {
      const isInput = port.portType === 'INPUT';
      const typedPorts = isInput ? inputs : outputs;
      const index = typedPorts.findIndex(p => p.id === port.id);
      const yPos = (index + 1) / (typedPorts.length + 1);

      const endpointUuid = `${node.instanceId}-${port.id}`;

      const epOptions: any = {
        endpoint: { type: 'Dot', options: { radius: 6 } },
        paintStyle: { fill: '#4a4a4a' },
        anchor: isInput ? [0, yPos, -1, 0] : [1, yPos, 1, 0],
        source: !isInput,
        target: isInput,
        maxConnections: -1,
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
    const el = document.getElementById(node.instanceId!);
    if (!el) return;

    this.isProgrammaticConnecting = true;

    try {
      const rawConns = this.instance.getConnections();
      const connectionsArray = Array.isArray(rawConns) ? rawConns : Object.values(rawConns);

      // Collect unique connection pairs
      const uniqueConnectionKeys = new Set<string>();

      connectionsArray.forEach((conn: any) => {
        if (conn.endpoints && conn.endpoints.length === 2) {
          const sUuid = this.getPortUuid(conn.endpoints[0]);
          const tUuid = this.getPortUuid(conn.endpoints[1]);

          if (sUuid && tUuid) {
            uniqueConnectionKeys.add(`${sUuid}==>${tUuid}`);
          }
        }
      });

      this.instance.removeAllEndpoints(el);
      this.setupNode(node);

      // Re-connect using strict deduplication
      uniqueConnectionKeys.forEach(key => {
        const [sourceUuid, targetUuid] = key.split('==>');
        try {
          this.instance.connect({ uuids: [sourceUuid, targetUuid] });
        } catch (e) {
          // Ignore invalid connection attempts during port rebuild
        }
      });

    } finally {
      this.isProgrammaticConnecting = false;
    }

    this.validateAllConnections();
  }

  // Drag and Drop
  onDragStart(event: DragEvent, node: NodeModel) {
    this.draggedNode = node;
    event.dataTransfer?.setData('text/plain', node.blockId);
  }

  onDragOver(event: DragEvent) { event.preventDefault(); }

  onDrop(event: DragEvent) {
    event.preventDefault();
    if (!this.draggedNode) return;

    const rect = this.container.nativeElement.getBoundingClientRect();
    const newNode: NodeModel = JSON.parse(JSON.stringify(this.draggedNode));

    newNode.instanceId = 'BKI-' + Date.now();

    newNode.uiLayout.canvasX = (event.clientX - rect.left) / this.zoomLevel;
    newNode.uiLayout.canvasY = (event.clientY - rect.top) / this.zoomLevel;
    newNode.hasError = false;
    newNode.errors = [];

    this.flowNodes.push(newNode);
    this.cdr.detectChanges();
    this.setupNode(newNode);
    this.draggedNode = null;
  }

  // Context Menu & Node Management
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
    this.validateAllConnections();
  }

  saveCurrentFlow() {
    const raw = this.instance.getConnections();
    const connectionsArray = Array.isArray(raw) ? raw : Object.values(raw);

    const seen = new Set<string>();
    const uniqueConnections: any[] = [];

    connectionsArray.forEach((c: any) => {
      const sourceInstId = c.sourceId;
      const targetInstId = c.targetId;
      const sourcePortId = this.getPortIdFromEndpoint(c.endpoints?.[0]);
      const targetPortId = this.getPortIdFromEndpoint(c.endpoints?.[1]);

      if (sourceInstId && targetInstId && sourcePortId && targetPortId) {
        const connectionKey = `${sourceInstId}:${sourcePortId}->${targetInstId}:${targetPortId}`;

        if (!seen.has(connectionKey)) {
          seen.add(connectionKey);
          uniqueConnections.push({
            sourceInstanceId: sourceInstId,
            targetInstanceId: targetInstId,
            sourcePortId: sourcePortId,
            targetPortId: targetPortId
          });
        }
      }
    });

    this.showFlow = JSON.stringify({
      nodes: this.flowNodes,
      connections: uniqueConnections
    });
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
}