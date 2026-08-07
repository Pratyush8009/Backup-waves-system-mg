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
import { AnalysisBlockRightPanel } from '../analysis-block-right-panel/analysis-block-right-panel';
import { blockFlow } from './config.data'; // Import your data

interface Port {
  id: string;
  name: string;
  portType: 'INPUT' | 'OUTPUT';
  portOrder: number;
}

interface UiLayout {
  canvasX: number;
  canvasY: number;
  canvasWidth: number;
  canvasHeight: number;
  color: string;
  icon: string;
}

interface NodeModel {
  id?: string;        // The instance ID from JSON
  blockId: string;    // The template ID
  instanceId?: string; // Internal mapping
  name: string;
  description?: string;
  blockType: string;
  category: string;
  ports: Port[];
  uiLayout: UiLayout;
  flows: any[];
}

@Component({
  selector: 'app-analysis-block-editor',
  standalone: true,
  imports: [
    CommonModule, FormsModule, NzButtonModule, NzBreadCrumbModule,
    NzSplitterModule, NzIconModule, NzTooltipModule,
    NzDividerModule, NzModalModule, AnalysisBlockRightPanel
  ],
  templateUrl: './analysis-block-editor.html',
  styleUrl: './analysis-block-editor.css'
})
export class AnalysisBlockEditor implements AfterViewInit, OnInit {
  @Output() fullscreenChange = new EventEmitter<boolean>();
  @ViewChild('container') container!: ElementRef;

  instance!: BrowserJsPlumbInstance;
  selectedNode: NodeModel | null = null;
  systemId!: string;
  unitId!: string;
  analysisId!: string;
  pipelineId!: string;
  isFullscreen: boolean = false;
  showFlow: any;

  isContextMenuVisible = false;
  contextMenuPosition = { x: 0, y: 0 };
  contextMenuNode: NodeModel | null = null;

  // Library Nodes (Templates)
  systemNodes: NodeModel[] = [
    {
      blockId: "BLK-input-001",
      name: "input",
      blockType: "INPUT",
      category: "system",
      ports: [{ id: "PORT-OUT-001", name: "output_1", portType: "OUTPUT", portOrder: 1 }],
      uiLayout: { canvasX: 0, canvasY: 0, canvasWidth: 130, canvasHeight: 40, color: "#4a8bdc", icon: "arrow-right" },
      flows: []
    },
    {
      blockId: "BLK-output-001",
      name: "output",
      blockType: "OUTPUT",
      category: "system",
      ports: [{ id: "PORT-IN-001", name: "input_1", portType: "INPUT", portOrder: 1 }],
      uiLayout: { canvasX: 0, canvasY: 0, canvasWidth: 130, canvasHeight: 40, color: "#4f8b63", icon: "file" },
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
        { id: "PORT-IN-001", name: "input_1", portType: "INPUT", portOrder: 1 },
        { id: "PORT-OUT-001", name: "output_1", portType: "OUTPUT", portOrder: 1 },
        { id: "PORT-OUT-002", name: "output_2", portType: "OUTPUT", portOrder: 2 }
      ],
      uiLayout: { canvasX: 0, canvasY: 0, canvasWidth: 140, canvasHeight: 40, color: "#b38338", icon: "setting" },
      flows: []
    }
  ];

  flowNodes: NodeModel[] = [];
  draggedNode: NodeModel | null = null;

  constructor(private route: ActivatedRoute, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.unitId = params.get('unitId') || '';
      this.systemId = params.get('systemId') || '';
      this.analysisId = params.get('analysisId') || '';

      this.pipelineId = params.get('pipelineId') || '958769348796';

      console.log("Unit Id:", this.unitId);
      console.log("System Id:", this.systemId);
      console.log("Pipeline Id:", this.pipelineId);
    })
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initJsPlumb();
      this.loadFlowData(); // Load the data from config.data.ts
    });
  }

  private initJsPlumb() {
    this.instance = newInstance({ container: this.container.nativeElement });
    this.instance.importDefaults({
      connector: { type: 'Bezier', options: { curviness: 50 } },
      paintStyle: { stroke: '#4a4a4a', strokeWidth: 2 },
      endpoint: { type: 'Dot', options: { radius: 5 } },
      endpointStyle: { fill: '#4a4a4a' }
    });
  }

  private loadFlowData() {
    // 1. Load Nodes
    const nodes = blockFlow.blocks.map((b: any) => ({
      ...b,
      instanceId: b.id // Use the 'id' from JSON as the instanceId
    }));
    this.flowNodes = nodes;

    // Trigger Change Detection so DOM elements exist before setup
    this.cdr.detectChanges();

    // 2. Setup Endpoints for each node
    this.flowNodes.forEach(node => this.setupNode(node));

    // 3. Establish Connections
    blockFlow.blockConnections.forEach(conn => {
      this.instance.connect({
        uuids: [
          `${conn.sourceBlockInstanceId}-${conn.sourcePortId}`,
          `${conn.targetBlockInstanceId}-${conn.targetPortId}`
        ]
      });
    });
  }

  private setupNode(node: NodeModel) {
    const el = document.getElementById(node.instanceId!);
    if (!el) return;

    this.instance.manage(el);

    const inputs = node.ports.filter(p => p.portType === 'INPUT');
    const outputs = node.ports.filter(p => p.portType === 'OUTPUT');

    node.ports.forEach(port => {
      const isInput = port.portType === 'INPUT';
      const count = isInput ? inputs.length : outputs.length;
      const yPos = port.portOrder / (count + 1);

      this.instance.addEndpoint(el, {
        endpoint: { type: 'Dot', options: { radius: 5 } },
        paintStyle: { fill: '#4a4a4a' },
        anchor: isInput ? [0, yPos, -1, 0] : [1, yPos, 1, 0],
        source: !isInput,
        target: isInput,
        maxConnections: -1,
        uuid: `${node.instanceId}-${port.id}` // Crucial: matches connection logic
      });
    });
  }

  // --- UI Handlers ---
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

    newNode.instanceId = 'BKI-' + Date.now(); // Generate new instance ID
    newNode.uiLayout.canvasX = event.clientX - rect.left;
    newNode.uiLayout.canvasY = event.clientY - rect.top;

    this.flowNodes.push(newNode);
    this.cdr.detectChanges();
    this.setupNode(newNode);
    this.draggedNode = null;
  }

  openContextMenu(event: MouseEvent, node: NodeModel) {
    event.preventDefault();
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
  }

  saveCurrentFlow() {
    const raw = this.instance.getConnections();
    const connectionsArray = Array.isArray(raw) ? raw : Object.values(raw);

    this.showFlow = JSON.stringify({
      nodes: this.flowNodes,
      connections: connectionsArray.map((c: any) => ({
        sourceInstanceId: c.sourceId,
        targetInstanceId: c.targetId,
        uuids: [c.endpoints[0].getUuid(), c.endpoints[1].getUuid()]
      }))
    });
  }

  toggleFullscreen() {
    this.isFullscreen = !this.isFullscreen;
    this.fullscreenChange.emit(this.isFullscreen);
  }
  selectNode(node: NodeModel) {
    this.selectedNode = node;
  }
}