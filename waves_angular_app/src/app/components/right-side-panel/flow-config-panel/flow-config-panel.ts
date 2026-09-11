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

import {
  Port, SchemaField, ConnectionRecord, BlockItem, validateBlockGuidance,
  BlockGuidanceState,
} from '../../../pages/block-editor/data';
import {
  NodeModel, SavedFlow, validateNodeGuidance,
  NodeGuidanceState
} from '../../../pages/code-safety/flow-data';

export interface ConsoleError {
  type: string;
  source: string;
  timestamp: string;
  messages: string[];
}

export interface SchemaPopoverState {
  visible: boolean;
  mode: 'ADD' | 'EDIT';
  portType: 'INPUT' | 'OUTPUT';
  fieldId: string | null;
  selectedBlockFieldId: string | null;
  name: string;
  type: string;
  description: string;
  targetKey: string | null;
}

export interface NodeMappedFieldDetail {
  sourceField: SchemaField | null;
  targetField: SchemaField | null;
}

export interface NodeConnectionMappingDetail {
  sourceNodeName: string;
  sourceInstanceId: string;
  targetNodeName: string;
  targetInstanceId: string;
  sourcePortType: 'OUTPUT' | 'INPUT';
  targetPortType: 'OUTPUT' | 'INPUT';
  mappings: NodeMappedFieldDetail[];
}

export interface FlowConnectionSummary {
  totalConnections: number;
  connectionDetails: NodeConnectionMappingDetail[];
}

@Component({
  selector: 'app-flow-config-panel',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzIconModule,
    NzTooltipModule,
    NzInputModule,
    NzTabsModule,
    NzTagModule,
    NzDividerModule,
    NzSelectModule,
    NzButtonModule,
    NzInputNumberModule,
    NzPopoverModule
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
  @Input() allSavedFlows: SavedFlow[] = [];
  @Input() configViewMode: 'NODE' | 'FLOW' | 'BLOCK' = 'FLOW';
  @Input() flow: SavedFlow | null = null;

  @Output() nodeUpdated = new EventEmitter<NodeModel>();
  @Output() viewModeChanged = new EventEmitter<'NODE' | 'FLOW' | 'BLOCK'>();

  activeTab = 0;
  activeModelTab = 0;
  activeBlockTab = 0;
  guidanceState: NodeGuidanceState = validateNodeGuidance(null, []);

  popoverState: SchemaPopoverState = {
    visible: false,
    mode: 'ADD',
    portType: 'INPUT',
    fieldId: null,
    selectedBlockFieldId: null,
    name: '',
    type: 'decimal',
    description: '',
    targetKey: null
  };

  flowConnections: FlowConnectionSummary = {
    totalConnections: 0,
    connectionDetails: []
  };

  clearErrors(): void {
    this.consoleErrors = [];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['nodeData']) {
      if (this.nodeData) {
        this.configViewMode = 'NODE';
        this.activeTab = 0;
        this.resetPopoverState();
      } else if (this.configViewMode === 'NODE') {
        this.configViewMode = 'FLOW';
      }
    }

    if (changes['configViewMode']) {
      if (this.configViewMode === 'FLOW') {
        this.activeModelTab = 0;
      } else if (this.configViewMode === 'BLOCK') {
        this.activeBlockTab = 0;
      }
    }

    this.updateFlowConnections();
    this.updateGuidanceState();
  }
  updateGuidanceState(): void {
    this.guidanceState = validateNodeGuidance(this.nodeData, this.connections);
  }

  setMode(mode: 'NODE' | 'FLOW' | 'BLOCK'): void {
    this.configViewMode = mode;
    this.viewModeChanged.emit(mode);
  }

  updateFlowConnections(): void {
    const nodeMap = new Map<string, NodeModel>(
      this.flowNodes.map((n) => [n.instanceId || n.nodeId, n])
    );

    const connectionDetails: NodeConnectionMappingDetail[] = (this.connections || []).map((conn) => {
      const sourceNode = nodeMap.get(conn.sourceInstanceId);
      const targetNode = nodeMap.get(conn.targetInstanceId);

      const sourcePort = sourceNode?.ports.find((p) => p.id === conn.sourcePortId);
      const targetPort = targetNode?.ports.find((p) => p.id === conn.targetPortId);

      const mappings: NodeMappedFieldDetail[] = (conn.mapping || []).map((m) => {
        const sourceField = sourcePort?.schema.find((f) => f.id === m.sourceFieldId) || null;
        const targetField = targetPort?.schema.find((f) => f.id === m.targetFieldId) || null;
        return { sourceField, targetField };
      });

      return {
        sourceNodeName: sourceNode?.name || 'Unknown Node',
        sourceInstanceId: conn.sourceInstanceId,
        targetNodeName: targetNode?.name || 'Unknown Node',
        targetInstanceId: conn.targetInstanceId,
        sourcePortType: sourcePort?.portType || 'OUTPUT',
        targetPortType: targetPort?.portType || 'INPUT',
        mappings
      };
    });

    this.flowConnections = {
      totalConnections: this.connections.length,
      connectionDetails
    };
  }

  onInfoChange(): void {
    if (!this.nodeData) return;
    this.updateFlowConnections();
    this.updateGuidanceState();
    this.nodeUpdated.emit(this.nodeData);
  }

  onStyleChange(): void {
    if (!this.nodeData) return;
    this.nodeUpdated.emit(this.nodeData);
  }

  get isIoNode(): boolean {
    if (!this.nodeData) return false;
    return this.nodeData.nodeType === 'INPUT' || this.nodeData.nodeType === 'OUTPUT';
  }

  get canHaveInputSchema(): boolean {
    if (!this.nodeData) return false;
    return this.nodeData.nodeType !== 'INPUT';
  }

  get canHaveOutputSchema(): boolean {
    if (!this.nodeData) return false;
    return this.nodeData.nodeType !== 'OUTPUT';
  }

  get inputPort(): Port | undefined {
    return this.nodeData?.ports?.find((p) => p.portType === 'INPUT');
  }

  get outputPort(): Port | undefined {
    return this.nodeData?.ports?.find((p) => p.portType === 'OUTPUT');
  }

  get inputSchemas(): SchemaField[] {
    return this.inputPort?.schema || [];
  }

  get outputSchemas(): SchemaField[] {
    return this.outputPort?.schema || [];
  }


  get currentFlow(): SavedFlow | null {
    if (this.flow) return this.flow;
    return this.allSavedFlows.find(f => f.id === this.activeFlowId) || null;
  }
  get usedFlowInputSchemas(): SchemaField[] {
    const fields: SchemaField[] = [];
    (this.flowNodes || []).forEach((node) => {
      if (node.nodeType === 'INPUT') {
        node.ports.forEach((p) => {
          if (p.portType === 'OUTPUT') {
            fields.push(...p.schema);
          }
        });
      }
    });
    return fields;
  }

  get usedFlowOutputSchemas(): SchemaField[] {
    const fields: SchemaField[] = [];
    (this.flowNodes || []).forEach((node) => {
      if (node.nodeType === 'OUTPUT') {
        node.ports.forEach((p) => {
          if (p.portType === 'INPUT') {
            fields.push(...p.schema);
          }
        });
      }
    });
    return fields;
  }

  get blockInputSchemas(): SchemaField[] {
    return this.selectedBlock?.schema?.INPUT || [];
  }

  get blockOutputSchemas(): SchemaField[] {
    return this.selectedBlock?.schema?.OUTPUT || [];
  }

  get currentBlockSavedFlows(): SavedFlow[] {
    if (!this.selectedBlock) return [];
    return (this.allSavedFlows || []).filter((f) => f.blockId === this.selectedBlock.value);
  }

  getBlockAvailableSchemas(portType: 'INPUT' | 'OUTPUT'): { field: SchemaField; disabled: boolean }[] {
    if (!this.selectedBlock || !this.selectedBlock.schema) return [];

    const blockSchemaList = portType === 'INPUT'
      ? this.selectedBlock.schema.INPUT || []
      : this.selectedBlock.schema.OUTPUT || [];

    if (portType === 'INPUT') {
      return blockSchemaList.map((field) => ({
        field,
        disabled: false
      }));
    }

    const usedOutputFieldIds = new Set<string>();

    const blockId = this.selectedBlock.value;
    (this.allSavedFlows || [])
      .filter((flow) => flow.blockId === blockId && flow.id !== this.activeFlowId)
      .forEach((flow) => {
        (flow.nodes || []).forEach((node) => {
          if (node.nodeType === 'OUTPUT') {
            node.ports.forEach((p) => {
              if (p.portType === 'INPUT') {
                p.schema.forEach((f) => {
                  if (f.id) usedOutputFieldIds.add(f.id);
                });
              }
            });
          }
        });
      });

    const currentNodeInstId = this.nodeData?.instanceId || this.nodeData?.nodeId;
    (this.flowNodes || [])
      .filter((node) => (node.instanceId || node.nodeId) !== currentNodeInstId)
      .forEach((node) => {
        if (node.nodeType === 'OUTPUT') {
          node.ports.forEach((p) => {
            if (p.portType === 'INPUT') {
              p.schema.forEach((f) => {
                if (f.id) usedOutputFieldIds.add(f.id);
              });
            }
          });
        }
      });

    return blockSchemaList.map((field) => {
      const isAlreadyUsed = usedOutputFieldIds.has(field.id);
      return {
        field,
        disabled: isAlreadyUsed
      };
    });
  }

  onBlockFieldSelected(fieldId: string, portType: 'INPUT' | 'OUTPUT'): void {
    const available = this.getBlockAvailableSchemas(portType);
    const target = available.find((a) => a.field.id === fieldId);
    if (target && !target.disabled) {
      this.popoverState.selectedBlockFieldId = target.field.id;
      this.popoverState.name = target.field.name;
      this.popoverState.type = target.field.type || 'decimal';
      this.popoverState.description = target.field.description || '';
    }
  }

  resetPopoverState(): void {
    this.popoverState = {
      visible: false,
      mode: 'ADD',
      portType: 'INPUT',
      fieldId: null,
      selectedBlockFieldId: null,
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
      selectedBlockFieldId: null,
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
      selectedBlockFieldId: field.id || null,
      name: field.name,
      type: field.type || 'decimal',
      description: field.description || '',
      targetKey: `EDIT_${fieldId}`
    };
  }

  saveSchema(): void {
    if (!this.nodeData) return;

    const { mode, portType, fieldId, selectedBlockFieldId, name, type, description } = this.popoverState;
    const isIo = this.isIoNode;

    let targetPortType: 'INPUT' | 'OUTPUT' = portType;

    if (this.nodeData.nodeType === 'INPUT') {
      targetPortType = 'OUTPUT';
    } else if (this.nodeData.nodeType === 'OUTPUT') {
      targetPortType = 'INPUT';
    }

    let targetPort = this.nodeData.ports?.find((p) => p.portType === targetPortType);

    if (mode === 'ADD') {
      if (!targetPort) {
        targetPort = {
          id: `PORT-${targetPortType}-${Date.now()}`,
          name: targetPortType === 'INPUT' ? 'input_1' : 'output_1',
          portType: targetPortType,
          portOrder: (this.nodeData.ports?.length || 0) + 1,
          schema: [],
          isDefault: true
        };
        if (!this.nodeData.ports) {
          this.nodeData.ports = [];
        }
        this.nodeData.ports.push(targetPort);
      }

      if (isIo && selectedBlockFieldId) {
        const available = this.getBlockAvailableSchemas(this.nodeData.nodeType as 'INPUT' | 'OUTPUT');
        const selectedObj = available.find((a) => a.field.id === selectedBlockFieldId);
        if (selectedObj && !selectedObj.disabled) {
          const exists = targetPort.schema.some((s) => s.id === selectedObj.field.id);
          if (!exists) {
            targetPort.schema.push({ ...selectedObj.field });
          }
        }
      } else if (!isIo && name) {
        const newField: SchemaField = {
          id: `FLD-${Date.now()}`,
          name,
          type,
          description
        };
        targetPort.schema.push(newField);
      }
    } else if (mode === 'EDIT' && targetPort && fieldId) {
      const targetField = targetPort.schema.find((s) => (s.id || s.name) === fieldId);
      if (targetField) {
        targetField.name = name;
        targetField.type = type;
        targetField.description = description;
      }
    }

    this.resetPopoverState();
    this.updateFlowConnections();
    this.updateGuidanceState();
    this.nodeUpdated.emit(this.nodeData);
  }

  deleteSchema(portType: 'INPUT' | 'OUTPUT', fieldId: string): void {
    if (!this.nodeData) return;

    let targetPortType: 'INPUT' | 'OUTPUT' = portType;
    if (this.nodeData.nodeType === 'INPUT') {
      targetPortType = 'OUTPUT';
    } else if (this.nodeData.nodeType === 'OUTPUT') {
      targetPortType = 'INPUT';
    }

    const targetPort = this.nodeData.ports?.find((p) => p.portType === targetPortType);
    if (!targetPort) return;

    targetPort.schema = targetPort.schema.filter((s) => s.id !== fieldId && s.name !== fieldId);
    this.updateFlowConnections();
    this.updateGuidanceState();
    this.nodeUpdated.emit(this.nodeData);
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
// FIXED VERSION-1