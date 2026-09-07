import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';

import { Port, SchemaField, ConnectionRecord, BlockItem } from '../../../pages/block-editor/data';
import { NodeModel } from '../../../pages/flow-editor/flow-data'
export interface ConsoleError {
  type: string;
  source: string;
  timestamp: string;
  messages: string[];
}

@Component({
  selector: 'app-flow-config-panel',
  standalone: true,
  imports: [
    CommonModule, FormsModule, NzIconModule, NzTooltipModule,
    NzInputModule, NzTabsModule, NzTagModule, NzDividerModule,
    NzSelectModule, NzButtonModule, NzInputNumberModule
  ],
  templateUrl: './flow-config-panel.html',
  styleUrls: ['./flow-config-panel.css']
})
export class FlowConfigPanel implements OnChanges {
  @Input() nodeData: NodeModel | null = null;
  @Input() flowNodes: NodeModel[] = [];
  @Input() connections: ConnectionRecord[] = [];
  @Input() pipelineId: string = '';
  @Input() modelId: string = '';
  @Input() systemId: string = '';
  @Input() unitId: string = '';
  @Input() activeFlowId: string = '';
  @Input() selectedBlock!: BlockItem;
  @Input() consoleErrors: ConsoleError[] = [];

  @Output() nodeUpdated = new EventEmitter<NodeModel>();

  activeTab = 0;
  activeModelTab = 0;

  // New Port Form State
  newPortType: 'INPUT' | 'OUTPUT' = 'INPUT';
  newPortName: string = '';

  // Schema Creation Form State
  newSchemaName: string = '';
  newSchemaType: string = 'decimal';
  newSchemaDesc: string = '';
  selectedPortId: string = '';

  // Grouping I/O Schema State (Block schema -> Node Port)
  selectedGroupPortId: string = '';
  selectedBlockSchemaFieldId: string = '';

  clearErrors(): void {
    this.consoleErrors = [];
  }

  ngOnChanges(changes: SimpleChanges): void {


    if (changes['nodeData'] && this.nodeData) {
      this.activeTab = 0;
      this.selectedPortId = '';
      this.newPortName = '';
      this.selectedGroupPortId = '';
      this.selectedBlockSchemaFieldId = '';
      console.log("node data in config pnael is :", this.nodeData)
      if (this.nodeData.category === 'I/O') {
        this.newPortType = this.nodeData.nodeType === 'INPUT' ? 'OUTPUT' : 'INPUT';
      } else {
        this.newPortType = 'INPUT';
      }
    }
  }



  getAvailablePorts(): Port[] {
    if (!this.nodeData) return [];
    if (this.nodeData.category === 'I/O') {
      if (this.nodeData.nodeType === 'INPUT') {
        return this.nodeData.ports.filter(p => p.portType === 'OUTPUT');
      } else if (this.nodeData.nodeType === 'OUTPUT') {
        return this.nodeData.ports.filter(p => p.portType === 'INPUT');
      }
    }
    return this.nodeData.ports;
  }

  getAvailableBlockSchemas(): SchemaField[] {
    if (!this.nodeData || !this.selectedBlock) return [];
    if (this.nodeData.nodeType === 'INPUT') {
      return this.selectedBlock.schema.INPUT || [];
    } else if (this.nodeData.nodeType === 'OUTPUT') {
      return this.selectedBlock.schema.OUTPUT || [];
    }
    return [];
  }

  addGroupBlockSchema() {
    if (!this.nodeData || !this.selectedGroupPortId || !this.selectedBlockSchemaFieldId) return;

    const port = this.nodeData.ports.find(p => p.id === this.selectedGroupPortId);
    if (!port) return;

    const availableSchemas = this.getAvailableBlockSchemas();
    const sourceSchema = availableSchemas.find(s => s.id === this.selectedBlockSchemaFieldId);
    if (!sourceSchema) return;

    const exists = port.schema.some(s => s.id === sourceSchema.id || s.name === sourceSchema.name);
    if (!exists) {
      port.schema.push({ ...sourceSchema });
      this.nodeUpdated.emit(this.nodeData);
    }
    this.selectedBlockSchemaFieldId = '';
  }

  isMultiFieldPort(port: Port): boolean {
    return !!(port && port.schema && port.schema.length > 1);
  }

  getPortColor(port: Port | string): string {
    const type = typeof port === 'string' ? port : port.portType;
    if (typeof port !== 'string' && this.isMultiFieldPort(port)) {
      return '#F6FFED';
    }
    return type === 'INPUT' ? '#E6F7FF' : '#FFF7E6';
  }

  getPortTextColor(port: Port | string): string {
    const type = typeof port === 'string' ? port : port.portType;
    if (typeof port !== 'string' && this.isMultiFieldPort(port)) {
      return '#52C41A';
    }
    return type === 'INPUT' ? '#1890FF' : '#FA8C16';
  }

  getDataTypeColor(type: string): string {
    switch (type?.toLowerCase()) {
      case 'number': return '#D6E4FF';
      case 'decimal': return '#F6FFED';
      case 'string': return '#FFF0F6';
      default: return '#F5F5F5';
    }
  }

  getDataTypeTextColor(type: string): string {
    switch (type?.toLowerCase()) {
      case 'number': return '#0958D9';
      case 'decimal': return '#389E0D';
      case 'string': return '#C41D7F';
      default: return '#595959';
    }
  }



  deletePort(portId: string) {
    if (!this.nodeData) return;
    this.nodeData.ports = this.nodeData.ports.filter(p => p.id !== portId);
    if (this.selectedPortId === portId) {
      this.selectedPortId = '';
    }
    this.nodeUpdated.emit(this.nodeData);
  }

  addSchema() {
    if (!this.nodeData || !this.selectedPortId || !this.newSchemaName) return;

    const port = this.nodeData.ports.find(p => p.id === this.selectedPortId);
    if (!port) return;

    const newField: SchemaField = {
      id: `FLD-${Date.now()}`,
      name: this.newSchemaName,
      type: this.newSchemaType,
      description: this.newSchemaDesc
    };

    port.schema.push(newField);
    this.newSchemaName = '';
    this.newSchemaDesc = '';
    this.nodeUpdated.emit(this.nodeData);
  }

  deleteSchema(portId: string, fieldName: string) {
    if (!this.nodeData) return;
    const port = this.nodeData.ports.find(p => p.id === portId);
    if (!port) return;

    port.schema = port.schema.filter(s => s.name !== fieldName);
    this.nodeUpdated.emit(this.nodeData);
  }

  getInputPorts(): Port[] {
    if (!this.nodeData) return [];
    return this.nodeData.ports.filter(p => p.portType === 'INPUT');
  }

  getConnectedSourceFields(targetPortId: string): { id: string; name: string; type: string; blockName: string; portName: string }[] {
    if (!this.nodeData || !this.nodeData.instanceId) return [];

    const matchedConns = this.connections.filter(c =>
      c.targetInstanceId === this.nodeData?.instanceId && c.targetPortId === targetPortId
    );

    const sourceFields: { id: string; name: string; type: string; blockName: string; portName: string }[] = [];

    matchedConns.forEach(conn => {
      const sourceNode = this.flowNodes.find(n => n.instanceId === conn.sourceInstanceId);
      if (sourceNode) {
        const sourcePort = sourceNode.ports.find(p => p.id === conn.sourcePortId);
        if (sourcePort) {
          sourcePort.schema.forEach(field => {
            sourceFields.push({
              id: field.id,
              name: field.name,
              type: field.type,
              blockName: sourceNode.name,
              portName: sourcePort.name
            });
          });
        }
      }
    });

    return sourceFields;
  }



  onMlConfigChanged(updatedNode: NodeModel): void {
    this.nodeUpdated.emit(updatedNode);
  }
}