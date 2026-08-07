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
import { NodeModel, Port, SchemaField } from '../../../pages/configure-page/configure-page';

export interface SystemSchemaConfig {
  INPUT: SchemaField[];
  OUTPUT: SchemaField[];
}
export interface ConsoleError {
  type: string;
  source: string;
  timestamp: string;
  messages: string[];
}

@Component({
  selector: 'app-block-config-pannel',
  standalone: true,
  imports: [
    CommonModule, FormsModule, NzIconModule, NzTooltipModule,
    NzInputModule, NzTabsModule, NzTagModule, NzDividerModule,
    NzSelectModule, NzButtonModule
  ],
  templateUrl: './block-config-pannel.html',
  styleUrls: ['./block-config-pannel.css']
})
export class BlockConfigPannel implements OnChanges {
  @Input() blockData: NodeModel | null = null;
  @Input() pipelineId: string = '';
  @Input() modelId: string = '';
  @Input() systemId: string = '';
  @Input() unitId: string = '';
  @Input() systemSchema: SystemSchemaConfig = { INPUT: [], OUTPUT: [] };
  @Input() consoleErrors: ConsoleError[] = [];
  @Output() nodeUpdated = new EventEmitter<NodeModel>();
  activeTab = 0;
  activeModelTab = 0;

  // New Port Form State
  newPortType: 'INPUT' | 'OUTPUT' = 'INPUT';
  newPortName: string = '';

  // Custom Schema Form State
  newSchemaName: string = '';
  newSchemaType: string = 'decimal';
  newSchemaDesc: string = '';
  selectedPortId: string = '';

  // System Schema Group Form State
  selectedSystemSchemaName: string = '';
  selectedGroupPortId: string = '';

  clearErrors(): void {
    this.consoleErrors = [];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['blockData'] && this.blockData) {
      this.activeTab = 0;
      this.selectedPortId = '';
      this.selectedGroupPortId = '';
      this.selectedSystemSchemaName = '';
      this.newPortName = '';
      console.log("Block data changed:", this.blockData)
      if (this.blockData.category === 'system') {
        if (this.blockData.blockType === 'INPUT') {
          this.newPortType = 'OUTPUT';
        } else if (this.blockData.blockType === 'OUTPUT') {
          this.newPortType = 'INPUT';
        }
      } else {
        this.newPortType = 'INPUT';
      }
    }
  }

  // Get available ports suitable for adding schema based on node category and block type
  getAvailablePorts(): Port[] {
    if (!this.blockData) return [];
    if (this.blockData.category === 'system') {
      if (this.blockData.blockType === 'INPUT') {
        return this.blockData.ports.filter(p => p.portType === 'OUTPUT');
      } else if (this.blockData.blockType === 'OUTPUT') {
        return this.blockData.ports.filter(p => p.portType === 'INPUT');
      }
    }
    return this.blockData.ports;
  }

  // Get current relevant system schema list based on block type
  getAvailableSystemSchemas(): SchemaField[] {
    if (!this.blockData) return [];
    if (this.blockData.blockType === 'INPUT') {
      return this.systemSchema.INPUT || [];
    } else if (this.blockData.blockType === 'OUTPUT') {
      return this.systemSchema.OUTPUT || [];
    }
    return [];
  }

  getPortColor(type: string): string {
    return type === 'INPUT' ? '#E6F7FF' : '#FFF7E6';
  }

  getPortTextColor(type: string): string {
    return type === 'INPUT' ? '#1890FF' : '#FA8C16';
  }

  getDataTypeColor(type: string): string {
    const t = type?.toLowerCase();
    switch (t) {
      case 'number': return '#D6E4FF';
      case 'decimal': return '#F6FFED';
      case 'string': return '#FFF0F6';
      default: return '#F5F5F5';
    }
  }

  getDataTypeTextColor(type: string): string {
    const t = type?.toLowerCase();
    switch (t) {
      case 'number': return '#0958D9';
      case 'decimal': return '#389E0D';
      case 'string': return '#C41D7F';
      default: return '#595959';
    }
  }

  addPort() {
    if (!this.blockData || !this.newPortName) return;

    // Force system nodes to restrict port types
    if (this.blockData.category === 'system') {
      if (this.blockData.blockType === 'INPUT') {
        this.newPortType = 'OUTPUT';
      } else if (this.blockData.blockType === 'OUTPUT') {
        this.newPortType = 'INPUT';
      }
    }

    const existingTypedPorts = this.blockData.ports.filter(p => p.portType === this.newPortType);
    const portOrder = existingTypedPorts.length + 1;
    const portId = `PORT-${this.newPortType.substring(0, 3)}-${Date.now()}`;

    const newPort: Port = {
      id: portId,
      name: this.newPortName,
      portType: this.newPortType,
      portOrder: portOrder,
      schema: []
    };

    this.blockData.ports.push(newPort);
    this.newPortName = '';
    this.nodeUpdated.emit(this.blockData);
  }

  deletePort(portId: string) {
    if (!this.blockData) return;
    this.blockData.ports = this.blockData.ports.filter(p => p.id !== portId);
    if (this.selectedPortId === portId) {
      this.selectedPortId = '';
    }
    if (this.selectedGroupPortId === portId) {
      this.selectedGroupPortId = '';
    }
    this.nodeUpdated.emit(this.blockData);
  }

  addSchema() {
    if (!this.blockData || !this.selectedPortId || !this.newSchemaName) return;

    const port = this.blockData.ports.find(p => p.id === this.selectedPortId);
    if (!port) return;

    const newField: SchemaField = {
      name: this.newSchemaName,
      type: this.newSchemaType,
      description: this.newSchemaDesc
    };

    port.schema.push(newField);
    this.newSchemaName = '';
    this.newSchemaDesc = '';
    this.nodeUpdated.emit(this.blockData);
  }

  addGroupSystemSchema() {
    if (!this.blockData || !this.selectedGroupPortId || !this.selectedSystemSchemaName) return;

    const port = this.blockData.ports.find(p => p.id === this.selectedGroupPortId);
    if (!port) return;

    const schemas = this.getAvailableSystemSchemas();
    const systemField = schemas.find(s => s.name === this.selectedSystemSchemaName);
    if (!systemField) return;

    // Check if the schema field is already assigned to this port
    const exists = port.schema.some(s => s.name === systemField.name);
    if (!exists) {
      port.schema.push({ ...systemField });
      this.selectedSystemSchemaName = '';
      this.nodeUpdated.emit(this.blockData);
    }
  }

  deleteSchema(portId: string, fieldName: string) {
    if (!this.blockData) return;
    const port = this.blockData.ports.find(p => p.id === portId);
    if (!port) return;

    port.schema = port.schema.filter(s => s.name !== fieldName);
    this.nodeUpdated.emit(this.blockData);
  }
}