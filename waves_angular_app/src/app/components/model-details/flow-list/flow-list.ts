import {
  Component, ElementRef, ViewChild, AfterViewInit, OnInit, ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { newInstance, BrowserJsPlumbInstance } from '@jsplumb/browser-ui';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { flowsData } from './data';
@Component({
  selector: 'app-flow-list',
  standalone: true,
  imports: [CommonModule, NzIconModule, NzButtonModule, NzPopoverModule],
  templateUrl: './flow-list.html',
  styleUrl: './flow-list.css',
})
export class FlowList implements OnInit, AfterViewInit {
  @ViewChild('container') container!: ElementRef;

  // Unique suffix for this specific instance to prevent ID conflicts
  uniqueId = Math.random().toString(36).substring(2, 9);

  instance!: BrowserJsPlumbInstance;
  flowData: any = null;

  zoomLevel: number = 1.0;
  private readonly MIN_ZOOM: number = 0.3;
  private readonly MAX_ZOOM: number = 2.5;
  private readonly ZOOM_STEP: number = 0.1;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    // Deep clone the data to avoid shared mutations across instances
    this.flowData = JSON.parse(JSON.stringify(flowsData[0]));
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initJsPlumb();
      this.renderFlow();
    });
  }

  // Helper to construct uniquely scoped DOM element IDs
  getScopedId(instanceId: string): string {
    return `${instanceId}_${this.uniqueId}`;
  }

  private initJsPlumb() {
    this.instance = newInstance({
      container: this.container.nativeElement
    });

    this.instance.importDefaults({
      connector: { type: 'Flowchart', options: { cornerRadius: 8, stub: 15 } },
      paintStyle: { stroke: '#333333', strokeWidth: 2.5 },
      endpoint: { type: 'Rectangle', options: { width: 5, height: 12 } },
      endpointStyle: { fill: '#000000' }
    });
  }

  private renderFlow() {
    if (!this.flowData || !this.flowData.nodes) return;

    // 1. Setup Nodes
    this.flowData.nodes.forEach((node: any) => {
      this.setupNode(node);
    });

    // 2. Setup Connections with Scoped UUIDs
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

    el.style.left = `${node.uiLayout.canvasX}px`;
    el.style.top = `${node.uiLayout.canvasY}px`;

    this.instance.manage(el);
    this.instance.setPosition(el, { x: node.uiLayout.canvasX, y: node.uiLayout.canvasY });

    const inputs = node.ports.filter((p: any) => p.portType === 'INPUT');
    const outputs = node.ports.filter((p: any) => p.portType === 'OUTPUT');

    node.ports.forEach((port: any) => {
      const isInput = port.portType === 'INPUT';
      const typedPorts = isInput ? inputs : outputs;
      const index = typedPorts.findIndex((p: any) => p.id === port.id);
      const yPos = (index + 1) / (typedPorts.length + 1);

      this.instance.addEndpoint(el, {
        endpoint: { type: 'Rectangle', options: { width: 5, height: 12 } },
        paintStyle: { fill: '#000000' },
        anchor: isInput ? [0, yPos, -1, 0] : [1, yPos, 1, 0],
        source: !isInput,
        target: isInput,
        maxConnections: -1,
        uuid: `${node.instanceId}-${port.id}_${this.uniqueId}`
      });
    });
  }

  public getPortTopPosition(node: any, port: any): string {
    const inputs = node.ports.filter((p: any) => p.portType === 'INPUT');
    const outputs = node.ports.filter((p: any) => p.portType === 'OUTPUT');
    const isInput = port.portType === 'INPUT';
    const typedPorts = isInput ? inputs : outputs;
    const index = typedPorts.findIndex((p: any) => p.id === port.id);
    const yPosRatio = (index + 1) / (typedPorts.length + 1);
    return `${yPosRatio * 100}%`;
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
    console.log('Edit clicked for Flow ID:', this.flowData?.FlowId);
  }
}