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
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzSpinModule } from 'ng-zorro-antd/spin';

import { FlowConfigPanel } from '../../components/right-side-panel/flow-config-panel/flow-config-panel';
import { ModelPipelineService, PipelineFlow } from '../../services/model_pipeline.service';

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
  borderStyle?: string;
}

interface NodeModel {
  id: string;
  nodeId: string;
  instanceId?: string;
  name: string;
  nodeType: string;
  category: string;
  ports: Port[];
  uiLayout: UiLayout;
  config?: any;
}

interface Panel {
  name: string;
  active: boolean;
  nodes: NodeModel[];
}

@Component({
  selector: 'app-flow-editor',
  standalone: true,
  imports: [
    CommonModule, FormsModule, NzButtonModule, NzBreadCrumbModule,
    NzSplitterModule, NzIconModule, NzTooltipModule,
    FlowConfigPanel, NzDividerModule, NzModalModule, NzSelectModule,
    NzCollapseModule, NzInputModule, NzEmptyModule, NzSpinModule
  ],
  templateUrl: './flow-editor.html',
  styleUrl: './flow-editor.css'
})
export class FlowEditor implements AfterViewInit, OnInit {
  @Output() fullscreenChange = new EventEmitter<boolean>();
  @ViewChild('container') container!: ElementRef;

  instance!: BrowserJsPlumbInstance;
  selectedNode: NodeModel | null = null;

  systemId!: string;
  unitId!: string;
  modelId!: string;
  pipelineId!: string;

  isFullscreen: boolean = false;
  showFlow: any;
  isContextMenuVisible = false;
  contextMenuPosition = { x: 0, y: 0 };
  contextMenuNode: NodeModel | null = null;

  // Data State
  savedFlows: PipelineFlow[] = [];
  activeFlowId: string | null = null;
  isLoadingFlows = false;

  panels: Panel[] = [
    {
      name: 'I/O Nodes',
      active: true,
      nodes: [
        {
          id: "LIB-IN-001",
          nodeId: "NLK-input-001",
          name: "Input Node",
          nodeType: "INPUT",
          category: "ML input node",
          ports: [{ id: "PORT-OUT-001", name: "output_1", portType: "OUTPUT", portOrder: 1 }],
          uiLayout: { canvasX: 0, canvasY: 0, canvasWidth: 200, canvasHeight: 40, color: "#006bb3", icon: "file-excel" }
        }
      ]
    },
    {
      name: 'Processing Nodes',
      active: false,
      nodes: [
        {
          id: "LIB-PROC-001",
          nodeId: "NLK-proc-001",
          name: "Data Processor",
          nodeType: "PROCESSOR",
          category: "ML logic",
          ports: [
            { id: "PORT-IN-001", name: "in_1", portType: "INPUT", portOrder: 1 },
            { id: "PORT-OUT-001", name: "out_1", portType: "OUTPUT", portOrder: 1 },
          ],
          uiLayout: { canvasX: 0, canvasY: 0, canvasWidth: 220, canvasHeight: 40, color: "#4a8bdc", icon: "setting" }
        }
      ]
    }
  ];

  blocks = [
    { value: "BKI-CCPP-INPUT-001", label: 'Data Ingestion Block' },
    { value: "BKI-CCPP-PREP-001", label: 'Data Preparation Block' },
    { value: "BKI-CCPP-ML-001", label: 'ML Model Training Block' },
    { value: "BKI-CCPP-EVAL-001", label: 'Model Evaluation Block' }
  ];
  selectedBlockId = 'BKI-CCPP-INPUT-001';

  flowNodes: NodeModel[] = [];
  draggedNode: NodeModel | null = null;

  constructor(
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private pipelineService: ModelPipelineService,
    private message: NzMessageService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.unitId = params.get('unitId') || '';
      this.systemId = params.get('systemId') || '';
      this.modelId = params.get('modelId') || 'MODEL-001';
      this.pipelineId = params.get('pipelineId') || '958769348796';

      this.loadBlockFlows();
    });
  }

  onBlockChange(blockId: string) {
    this.selectedBlockId = blockId;
    this.loadBlockFlows();
  }

  loadBlockFlows() {
    // 1. Clear current state before fetching
    this.clearCanvas();
    this.savedFlows = [];
    this.activeFlowId = null;
    this.isLoadingFlows = true;

    this.pipelineService.getBlockFlow(this.modelId, this.pipelineId, this.selectedBlockId)
      .subscribe({
        next: (res) => {
          this.savedFlows = res.data.flows || [];
          this.isLoadingFlows = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.isLoadingFlows = false;
          this.message.error('Failed to fetch flows for this block');
        }
      });
  }

  private clearCanvas() {
    if (this.instance) {
      this.flowNodes.forEach(n => {
        const el = document.getElementById(n.instanceId || n.id);
        if (el) this.instance.unmanage(el);
      });
      this.instance.deleteEveryConnection();
    }
    this.flowNodes = [];
    this.selectedNode = null;
  }

  ngAfterViewInit() {
    setTimeout(() => this.initJsPlumb());
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

  private setupNode(node: NodeModel) {
    const elId = node.instanceId || node.id;
    const el = document.getElementById(elId);
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
        uuid: `${elId}-${port.id}`
      });
    });
  }

  loadSavedFlow(flow: any) {
    this.activeFlowId = flow.id;
    this.clearCanvas();

    const nodesToLoad = JSON.parse(JSON.stringify(flow.nodes));
    nodesToLoad.forEach((n: any) => { n.instanceId = n.id; });

    this.flowNodes = nodesToLoad;
    this.cdr.detectChanges();

    this.flowNodes.forEach(node => this.setupNode(node));

    setTimeout(() => {
      flow.nodeConnections.forEach((conn: any) => {
        this.instance.connect({
          uuids: [
            `${conn.sourceNodeInstanceId}-${conn.sourcePortId}`,
            `${conn.targetNodeInstanceId}-${conn.targetPortId}`
          ]
        });
      });
    }, 100);
  }

  deleteFlow(event: MouseEvent, flowId: string) {
    event.stopPropagation();
    this.savedFlows = this.savedFlows.filter(f => f.id !== flowId);
    if (this.activeFlowId === flowId) {
      this.clearCanvas();
    }
  }

  onDragStart(event: DragEvent, node: NodeModel) {
    this.draggedNode = node;
    event.dataTransfer?.setData('text/plain', node.nodeId);
  }

  onDragOver(event: DragEvent) { event.preventDefault(); }

  onDrop(event: DragEvent) {
    event.preventDefault();
    if (!this.draggedNode) return;
    const rect = this.container.nativeElement.getBoundingClientRect();
    const newNode: NodeModel = JSON.parse(JSON.stringify(this.draggedNode));
    newNode.instanceId = 'NODE-' + Date.now();
    newNode.id = newNode.instanceId;
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
    const elId = this.contextMenuNode.instanceId || this.contextMenuNode.id;
    const el = document.getElementById(elId);
    if (el) {
      this.instance.removeAllEndpoints(el);
      this.instance.unmanage(el);
    }
    this.flowNodes = this.flowNodes.filter(n => (n.instanceId || n.id) !== elId);
  }

  saveCurrentFlow() {
    const raw = this.instance.getConnections();
    const connectionsArray = Array.isArray(raw) ? raw : Object.values(raw);
    this.showFlow = JSON.stringify({
      nodes: this.flowNodes,
      connections: connectionsArray.map((c: any) => ({
        uuids: [c.endpoints[0].getUuid(), c.endpoints[1].getUuid()]
      }))
    });
  }

  toggleFullscreen() {
    this.isFullscreen = !this.isFullscreen;
    this.fullscreenChange.emit(this.isFullscreen);
  }

  selectNode(node: NodeModel) { this.selectedNode = node; }
}