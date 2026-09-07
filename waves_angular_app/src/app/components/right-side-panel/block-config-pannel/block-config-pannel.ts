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
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { FlowList } from '../../model-details/flow-list/flow-list';
import {
  SchemaField,
  Port,
  BlockModel,
  ConnectionRecord,
  ConsoleError,
  validateBlockGuidance,
  BlockGuidanceState,
  getModelSchema,
  ModelSchemas,
  getBlocksConfigurationStatus,
  BlockConfigStatus,
  getMappedConnectionDetails,
  ModelConnectionSummary
} from '../../../pages/block-editor/data';

export interface SchemaPopoverState {
  visible: boolean;
  mode: 'ADD' | 'EDIT';
  portType: 'INPUT' | 'OUTPUT';
  fieldId: string | null;
  name: string;
  type: string;
  description: string;
  targetKey: string | null;
}

@Component({
  selector: 'app-block-config-pannel',
  standalone: true,
  imports: [
    CommonModule, FormsModule, NzIconModule, NzTooltipModule,
    NzInputModule, NzTabsModule, NzTagModule, NzDividerModule,
    NzSelectModule, NzButtonModule, NzInputNumberModule, NzPopoverModule, FlowList
  ],
  templateUrl: './block-config-pannel.html',
  styleUrls: ['./block-config-pannel.css']
})
export class BlockConfigPannel implements OnChanges {
  @Input() blockData: BlockModel | null = null;
  @Input() flowNodes: BlockModel[] = [];
  @Input() connections: ConnectionRecord[] = [];
  @Input() pipelineId: string = '';
  @Input() modelId: string = '';
  @Input() systemId: string = '';
  @Input() unitId: string = '';
  @Input() consoleErrors: ConsoleError[] = [];
  @Output() nodeUpdated = new EventEmitter<BlockModel>();

  activeTab = 0;
  activeModelTab = 0;

  // Model-level accumulated schemas
  modelSchemas: ModelSchemas = {
    schema: {
      inputSchema: [],
      outputSchema: []
    }
  };

  // Blocks status for Model Tab 2
  blocksConfigStatus: BlockConfigStatus[] = [];

  // Mapped Connection details for Model Tab 3
  modelConnections: ModelConnectionSummary = {
    totalConnections: 0,
    connectionDetails: []
  };

  // Single Shared Popover State for Block Schema editing
  popoverState: SchemaPopoverState = {
    visible: false,
    mode: 'ADD',
    portType: 'INPUT',
    fieldId: null,
    name: '',
    type: 'decimal',
    description: '',
    targetKey: null
  };

  // Block Validation State
  guidanceState: BlockGuidanceState = validateBlockGuidance(null, []);

  clearErrors(): void {
    this.consoleErrors = [];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['blockData'] && this.blockData) {
      this.activeTab = 0;
      this.resetPopoverState();
    }
    
    this.updateModelSchemas();
    this.updateGuidanceState();
    this.updateBlocksConfigStatus();
    this.updateModelConnections();
  }

  updateModelSchemas(): void {
    this.modelSchemas = getModelSchema({
      modelId: this.modelId,
      systemId: this.systemId,
      blocks: this.flowNodes
    });
  }

  updateBlocksConfigStatus(): void {
    this.blocksConfigStatus = getBlocksConfigurationStatus({
      blocks: this.flowNodes,
      connections: this.connections
    });
  }

  updateModelConnections(): void {
    this.modelConnections = getMappedConnectionDetails({
      blocks: this.flowNodes,
      connections: this.connections
    });
  }

  updateGuidanceState(): void {
    this.guidanceState = validateBlockGuidance(this.blockData, this.connections);
  }

  onInfoChange(): void {
    if (!this.blockData) return;
    this.updateGuidanceState();
    this.updateModelSchemas();
    this.updateBlocksConfigStatus();
    this.updateModelConnections();
    this.nodeUpdated.emit(this.blockData);
  }

  onStyleChange(): void {
    if (!this.blockData) return;
    this.nodeUpdated.emit(this.blockData);
  }

  // Schema Capability Checks
  get canHaveInputSchema(): boolean {
    if (!this.blockData) return false;
    return this.blockData.blockType !== 'INPUT';
  }

  get canHaveOutputSchema(): boolean {
    if (!this.blockData) return false;
    return this.blockData.blockType !== 'OUTPUT';
  }

  // Schema Getters for Selected Block
  get inputPort(): Port | undefined {
    return this.blockData?.ports?.find(p => p.portType === 'INPUT');
  }

  get outputPort(): Port | undefined {
    return this.blockData?.ports?.find(p => p.portType === 'OUTPUT');
  }

  get inputSchemas(): SchemaField[] {
    return this.inputPort?.schema || [];
  }

  get outputSchemas(): SchemaField[] {
    return this.outputPort?.schema || [];
  }

  resetPopoverState(): void {
    this.popoverState = {
      visible: false,
      mode: 'ADD',
      portType: 'INPUT',
      fieldId: null,
      name: '',
      type: 'decimal',
      description: '',
      targetKey: null
    };
  }

  openAddPopover(portType: 'INPUT' | 'OUTPUT'): void {
    this.popoverState = {
      visible: true,
      mode: 'ADD',
      portType,
      fieldId: null,
      name: '',
      type: 'decimal',
      description: '',
      targetKey: `ADD_${portType}`
    };
  }

  openEditPopover(field: SchemaField, portType: 'INPUT' | 'OUTPUT'): void {
    const fieldId = field.id || field.name;
    this.popoverState = {
      visible: true,
      mode: 'EDIT',
      portType,
      fieldId,
      name: field.name,
      type: field.type || 'decimal',
      description: field.description || '',
      targetKey: `EDIT_${fieldId}`
    };
  }

  saveSchema(): void {
    if (!this.blockData || !this.popoverState.name) return;

    const { mode, portType, fieldId, name, type, description } = this.popoverState;
    let targetPort = this.blockData.ports?.find(p => p.portType === portType);

    if (mode === 'ADD') {
      if (!targetPort) {
        targetPort = {
          id: `PORT-${portType}-${Date.now()}`,
          name: portType === 'INPUT' ? 'input_1' : 'output_1',
          portType: portType,
          portOrder: (this.blockData.ports?.length || 0) + 1,
          schema: [],
          isDefault: true
        };
        if (!this.blockData.ports) {
          this.blockData.ports = [];
        }
        this.blockData.ports.push(targetPort);
      }

      const newField: SchemaField = {
        id: `FLD-${Date.now()}`,
        name,
        type,
        description
      };
      targetPort.schema.push(newField);
    } else if (mode === 'EDIT' && targetPort && fieldId) {
      const targetField = targetPort.schema.find(s => (s.id || s.name) === fieldId);
      if (targetField) {
        targetField.name = name;
        targetField.type = type;
        targetField.description = description;
      }
    }

    this.resetPopoverState();
    this.updateGuidanceState();
    this.updateModelSchemas();
    this.updateBlocksConfigStatus();
    this.updateModelConnections();
    this.nodeUpdated.emit(this.blockData);
  }

  deleteSchema(portType: 'INPUT' | 'OUTPUT', fieldId: string): void {
    if (!this.blockData) return;
    const targetPort = this.blockData.ports?.find(p => p.portType === portType);
    if (!targetPort) return;

    targetPort.schema = targetPort.schema.filter(s => s.id !== fieldId && s.name !== fieldId);
    this.updateGuidanceState();
    this.updateModelSchemas();
    this.updateBlocksConfigStatus();
    this.updateModelConnections();
    this.nodeUpdated.emit(this.blockData);
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