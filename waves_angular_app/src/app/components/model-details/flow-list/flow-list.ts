import {
  Component, ElementRef, ViewChild, Input, AfterViewInit, OnInit, ChangeDetectorRef, OnChanges, SimpleChanges, OnDestroy, Output, EventEmitter
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { newInstance, BrowserJsPlumbInstance, AnchorOrientationHint, ArrayAnchorSpec } from '@jsplumb/browser-ui';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzPopoverModule } from 'ng-zorro-antd/popover';

@Component({
  selector: 'app-flow-list',
  standalone: true,
  imports: [CommonModule, NzIconModule, NzButtonModule, NzPopoverModule],
  templateUrl: './flow-list.html',
  styleUrl: './flow-list.css',
})
export class FlowList implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @Input() flow: any | null = null;
  @Output() onView = new EventEmitter<string>();
  @ViewChild('container') container!: ElementRef;

  uniqueId = Math.random().toString(36).substring(2, 9);
  instance!: BrowserJsPlumbInstance;
  flowData: any = null;

  zoomLevel: number = 0.5; // Default zoom set to 50%
  private readonly MIN_ZOOM: number = 0.2;
  private readonly MAX_ZOOM: number = 2.0;
  private readonly ZOOM_STEP: number = 0.1;

  private isViewInitialized = false;

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.updateFlowData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['flow'] && !changes['flow'].isFirstChange()) {
      this.updateFlowData();
      if (this.isViewInitialized) {
        this.reRenderFlow();
      }
    }
  }

  ngAfterViewInit() {
    this.isViewInitialized = true;
    this.initJsPlumb();
    setTimeout(() => {
      this.renderFlow();
    }, 50);
  }

  ngOnDestroy() {
    if (this.instance) {
      this.instance.destroy();
    }
  }

  private updateFlowData() {
    if (this.flow) {
      this.flowData = JSON.parse(JSON.stringify(this.flow));
    }
  }

  getScopedId(instanceId: string): string {
    return `${instanceId}_${this.uniqueId}`;
  }

  private initJsPlumb() {
    this.instance = newInstance({
      container: this.container.nativeElement
    });

    this.instance.importDefaults({
      connector: { type: 'Flowchart', options: { cornerRadius: 8, stub: 20 } },
      paintStyle: { stroke: '#222222', strokeWidth: 2 },
      connectionsDetachable: false
    });

    this.instance.setZoom(this.zoomLevel);
  }

  private reRenderFlow() {
    if (this.instance) {
      this.instance.reset();
      this.initJsPlumb();
    }
    this.cdr.detectChanges();
    setTimeout(() => {
      this.renderFlow();
    }, 50);
  }

  private renderFlow() {
    if (!this.flowData || !this.flowData.nodes) return;

    // 1. Setup Nodes
    this.flowData.nodes.forEach((node: any) => {
      this.setupNode(node);
    });

    // 2. Establish Connections
    if (this.flowData.connections) {
      this.flowData.connections.forEach((conn: any) => {
        const sUuid = `${conn.sourceInstanceId}-${conn.sourcePortId}_${this.uniqueId}`;
        const tUuid = `${conn.targetInstanceId}-${conn.targetPortId}_${this.uniqueId}`;
        try {
          this.instance.connect({ uuids: [sUuid, tUuid] });
        } catch (e) {
          console.error('Failed to establish flow connection:', e);
        }
      });
    }

    this.cdr.detectChanges();
  }

  private setupNode(node: any) {
    const scopedDomId = this.getScopedId(node.instanceId);
    const el = document.getElementById(scopedDomId);
    if (!el) return;

    el.style.left = `${node.uiLayout?.canvasX || 0}px`;
    el.style.top = `${node.uiLayout?.canvasY || 0}px`;

    this.instance.manage(el);
    this.instance.setPosition(el, { x: node.uiLayout?.canvasX || 0, y: node.uiLayout?.canvasY || 0 });
    this.instance.setDraggable(el, false);

    const inputs = node.ports.filter((p: any) => p.portType === 'INPUT');
    const outputs = node.ports.filter((p: any) => p.portType === 'OUTPUT');

    node.ports.forEach((port: any) => {
      const isInput = port.portType === 'INPUT';
      const typedPorts = isInput ? inputs : outputs;
      const index = typedPorts.findIndex((p: any) => p.id === port.id);
      const yPos = (index + 1) / (typedPorts.length + 1);

      // Explicitly type orientation hints (-1, 0, 1) as AnchorOrientationHint
      const xOrient: AnchorOrientationHint = isInput ? -1 : 1;
      const yOrient: AnchorOrientationHint = 0;
      const anchorPos: ArrayAnchorSpec = [isInput ? 0 : 1, yPos, xOrient, yOrient];

      this.instance.addEndpoint(el, {
        endpoint: { type: 'Rectangle', options: { width: 10, height: 22 } },
        paintStyle: { fill: '#ffffff', stroke: '#555555', strokeWidth: 1 },
        cssClass: isInput ? 'custom-endpoint endpoint-input' : 'custom-endpoint endpoint-output',
        anchor: anchorPos,
        source: false,
        target: false,
        maxConnections: -1,
        uuid: `${node.instanceId}-${port.id}_${this.uniqueId}`
      });
    });
  }

  public zoomIn() {
    if (this.zoomLevel < this.MAX_ZOOM) this.setZoom(this.zoomLevel + this.ZOOM_STEP);
  }

  public zoomOut() {
    if (this.zoomLevel > this.MIN_ZOOM) this.setZoom(this.zoomLevel - this.ZOOM_STEP);
  }

  private setZoom(zoom: number) {
    this.zoomLevel = Math.min(Math.max(zoom, this.MIN_ZOOM), this.MAX_ZOOM);
    this.instance.setZoom(this.zoomLevel);
  }

  onEditClick() {
    const flowId = this.flowData?.id || this.flowData?.FlowId;
    if (flowId) {
      this.onView.emit(flowId);
    }
  }
}