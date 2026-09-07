export interface SchemaField {
  id: string;
  name: string;
  type: string;
  description: string;
}

export interface PortFieldMapping {
  sourceFieldId: string;
  targetFieldId: string;
}

export interface Port {
  id: string;
  name: string;
  portType: 'INPUT' | 'OUTPUT';
  portOrder: number;
  schema: SchemaField[];
  isDefault: boolean;
}

export interface UiLayout {
  canvasX: number;
  canvasY: number;
  canvasWidth: number;
  canvasHeight: number;
  color: string;
  icon: string;
}

export interface BlockModel {
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
}

export interface NodeModel {
  id?: string;
  nodeId: string;
  instanceId?: string;
  name: string;
  description?: string;
  nodeType: string;
  category: string;
  ports: Port[];
  uiLayout: UiLayout;
  config?: any;
  hasError?: boolean;
}

export interface BlockItem {
  value: string;
  label: string;
  schema: {
    INPUT: SchemaField[];
    OUTPUT: SchemaField[];
  };
}

export interface SavedFlow {
  id: string;
  blockId: string;
  name: string;
  description?: string;
  nodes: NodeModel[];
  connections: ConnectionRecord[];
}

export interface ConnectionRecord {
  sourceInstanceId: string;
  targetInstanceId: string;
  sourcePortId: string;
  targetPortId: string;
  mapping?: PortFieldMapping[];
}

export interface SavedConnectionRecord {
  sourceNodeId: string;
  sourcePortId: string;
  targetNodeId: string;
  targetPortId: string;
  mapping?: PortFieldMapping[];
}

export interface Model {
  modelId?: string;
  modelVersion?: string;
  systemId?: string;
  entityType?: 'MODEL' | 'ANALYSIS';
  name?: string;
  description?: string;
  isActive?: boolean;
  blocks?: BlockModel[];
  connections?: ConnectionRecord[];
}

export interface ModelSchemas {
  modelId?: string;
  modelVersion?: string;
  systemId?: string;
  entityType?: 'MODEL' | 'ANALYSIS';
  name?: string;
  description?: string;
  isActive?: boolean;
  schema: {
    inputSchema: SchemaField[];
    outputSchema: SchemaField[];
  };
}

export interface ConsoleError {
  type: string;
  source: string;
  timestamp: string;
  messages: string[];
}

export interface BlockConfigStatus {
  blockId: string;
  name: string;
  blockType: string;
  isConfigured: boolean;
  schema: {
    INPUT: SchemaField[];
    OUTPUT: SchemaField[];
  };
}

export interface MappedFieldDetail {
  sourceField: SchemaField | null;
  targetField: SchemaField | null;
}

export interface ConnectionMappingDetail {
  sourceBlockName: string;
  sourceInstanceId: string;
  targetBlockName: string;
  targetInstanceId: string;
  sourcePortType: 'OUTPUT' | 'INPUT';
  targetPortType: 'OUTPUT' | 'INPUT';
  mappings: MappedFieldDetail[];
}

export interface ModelConnectionSummary {
  totalConnections: number;
  connectionDetails: ConnectionMappingDetail[];
}

// Block left panel blocks

export const systemNodes: BlockModel[] = [
  {
    blockId: "BLK-input-001",
    name: "input",
    blockType: "INPUT",
    category: "system",
    ports: [
      {
        id: "PORT-OUT-001", name: "output_1", portType: "OUTPUT", portOrder: 1, schema: [], isDefault: true
      }
    ],
    uiLayout: { canvasX: 0, canvasY: 0, canvasWidth: 150, canvasHeight: 115, color: "#4a8bdc", icon: "arrow-right" },
    flows: []
  },
  {
    blockId: "BLK-output-001",
    name: "output",
    blockType: "OUTPUT",
    category: "system",
    ports: [
      {
        id: "PORT-IN-001", name: "input_1", portType: "INPUT", portOrder: 1, schema: [], isDefault: true
      }
    ],
    uiLayout: { canvasX: 0, canvasY: 0, canvasWidth: 150, canvasHeight: 115, color: "#4f8b63", icon: "file" },
    flows: []
  }
];

export const blockNodes: BlockModel[] = [
  {
    blockId: "BLK-processor-001",
    name: "Empty Block",
    blockType: "PROCESSOR",
    category: "custom",
    ports: [
      {
        id: "PORT-IN-001", name: "input_1", portType: "INPUT", portOrder: 1, schema: [
          
        ], isDefault: true
      },
      {
        id: "PORT-OUT-001", name: "output_1", portType: "OUTPUT", portOrder: 1, schema: [], isDefault: true
      }
    ],
    uiLayout: { canvasX: 0, canvasY: 0, canvasWidth: 160, canvasHeight: 115, color: "#b38338", icon: "setting" },
    flows: []
  },
  {
    blockId: "BLK-processor-002",
    name: "Boiler Block",
    blockType: "PROCESSOR",
    category: "custom",
    ports: [
      { id: "PORT-IN-001", name: "input_1", portType: "INPUT", portOrder: 1, schema: [], isDefault: true },
      { id: "PORT-OUT-001", name: "output_1", portType: "OUTPUT", portOrder: 1, schema: [], isDefault: true }
    ],
    uiLayout: { canvasX: 0, canvasY: 0, canvasWidth: 160, canvasHeight: 115, color: "#139db6", icon: "setting" },
    flows: []
  }
];

// Initialized empty object safely typed
export const model: Model = {
  "modelId": "958769348796",
  "systemId": "b8fb0ff1-f1fb-4e68-9938-046d73f1631",
  "modelVersion": "MDL-660e8400-e29b-41d4-a716-446655440101",
  "entityType": "MODEL",
  "name": "Tata Power Plant Model",
  "description": "Description of tata power plant model",
  "blocks": [
    {
      "blockId": "BLK-input-001",
      "name": "input",
      "blockType": "INPUT",
      "category": "system",
      "ports": [
        {
          "id": "PORT-OUT-001",
          "name": "output_1",
          "portType": "OUTPUT",
          "portOrder": 1,
          "schema": [
            {
              "id": "FLD-1788238868071",
              "name": "IBI1",
              "type": "decimal",
              "description": ""
            },
            {
              "id": "FLD-1788238874887",
              "name": "IBI2",
              "type": "decimal",
              "description": ""
            },
            {
              "id": "FLD-1788238881919",
              "name": "IBI3",
              "type": "decimal",
              "description": ""
            }
          ],
          "isDefault": true
        }
      ],
      "uiLayout": {
        "canvasX": 232,
        "canvasY": 321,
        "canvasWidth": 150,
        "canvasHeight": 115,
        "color": "#4a8bdc",
        "icon": "arrow-right"
      },
      "flows": [],
      "instanceId": "BKI-1788238454129"
    },
    {
      "blockId": "BLK-processor-001",
      "name": "Empty",
      "blockType": "PROCESSOR",
      "category": "custom",
      "ports": [
        {
          "id": "PORT-IN-001",
          "name": "input_1",
          "portType": "INPUT",
          "portOrder": 1,
          "schema": [
            {
              "id": "FLD-1788238893743",
              "name": "EBI1",
              "type": "decimal",
              "description": ""
            },
            {
              "id": "FLD-1788238902496",
              "name": "EBI2",
              "type": "integer",
              "description": ""
            }
          ],
          "isDefault": true
        },
        {
          "id": "PORT-OUT-001",
          "name": "output_1",
          "portType": "OUTPUT",
          "portOrder": 1,
          "schema": [
            {
              "id": "FLD-1788238923503",
              "name": "EBO1",
              "type": "integer",
              "description": ""
            },
            {
              "id": "FLD-1788238931967",
              "name": "EBO2",
              "type": "integer",
              "description": ""
            }
          ],
          "isDefault": true
        }
      ],
      "uiLayout": {
        "canvasX": 517,
        "canvasY": 180,
        "canvasWidth": 160,
        "canvasHeight": 115,
        "color": "#ff751a",
        "icon": "setting"
      },
      "flows": [],
      "instanceId": "BKI-1788238837987"
    },
    {
      "blockId": "BLK-output-001",
      "name": "output",
      "blockType": "OUTPUT",
      "category": "system",
      "ports": [
        {
          "id": "PORT-IN-001",
          "name": "input_1",
          "portType": "INPUT",
          "portOrder": 1,
          "schema": [
            {
              "id": "FLD-1788238973965",
              "name": "OBI1",
              "type": "integer",
              "description": ""
            },
            {
              "id": "FLD-1788238986944",
              "name": "OBI2",
              "type": "decimal",
              "description": ""
            }
          ],
          "isDefault": true
        }
      ],
      "uiLayout": {
        "canvasX": 801,
        "canvasY": 350,
        "canvasWidth": 150,
        "canvasHeight": 115,
        "color": "#4f8b63",
        "icon": "file"
      },
      "flows": [],
      "instanceId": "BKI-1788238936295"
    }
  ],
  "connections": [
    {
      "sourceInstanceId": "BKI-1788238454129",
      "targetInstanceId": "BKI-1788238837987",
      "sourcePortId": "PORT-OUT-001",
      "targetPortId": "PORT-IN-001",
      "mapping": [
        { "sourceFieldId": "FLD-1788238868071", "targetFieldId": "FLD-1788238893743" }
      ]
    },
    {
      "sourceInstanceId": "BKI-1788238837987",
      "targetInstanceId": "BKI-1788238936295",
      "sourcePortId": "PORT-OUT-001",
      "targetPortId": "PORT-IN-001",
      "mapping": [
        { "sourceFieldId": "FLD-1788238923503", "targetFieldId": "FLD-1788238973965" },
        { "sourceFieldId": "FLD-1788238931967", "targetFieldId": "FLD-1788238986944" }

      ]
    }
  ]
};

export function updateModel(newData: Partial<Model>): Model {
  Object.assign(model, newData);
  return model;
}

export function extractBlockItems(modelData: Partial<Model>): BlockItem[] {
  if (!modelData || !Array.isArray(modelData.blocks)) {
    return [];
  }

  return modelData.blocks.map((block) => {
    const inputSchema: SchemaField[] = [];
    const outputSchema: SchemaField[] = [];

    block.ports?.forEach((port) => {
      if (port.portType === 'INPUT') {
        inputSchema.push(...(port.schema || []));
      } else if (port.portType === 'OUTPUT') {
        outputSchema.push(...(port.schema || []));
      }
    });

    return {
      value: block.instanceId || block.blockId || '',
      label: block.name || 'Unnamed Block',
      schema: {
        INPUT: inputSchema,
        OUTPUT: outputSchema,
      },
    };
  });
}

export function getBlocks(): BlockItem[] {
  return extractBlockItems(model);
}

export const savedFlows: SavedFlow[] = [];

export function getModelSchema(modelData: Partial<Model>): ModelSchemas {
  const inputSchema: SchemaField[] = [];
  const outputSchema: SchemaField[] = [];

  if (modelData && Array.isArray(modelData.blocks)) {
    modelData.blocks.forEach((block) => {
      if (block.blockType === 'INPUT') {
        block.ports?.forEach((port) => {
          if (Array.isArray(port.schema)) {
            inputSchema.push(...port.schema);
          }
        });
      } else if (block.blockType === 'OUTPUT') {
        block.ports?.forEach((port) => {
          if (Array.isArray(port.schema)) {
            outputSchema.push(...port.schema);
          }
        });
      }
    });
  }

  return {
    modelId: modelData?.modelId || '',
    modelVersion: modelData?.modelVersion || '',
    systemId: modelData?.systemId || '',
    entityType: modelData?.entityType || 'MODEL',
    name: modelData?.name || '',
    description: modelData?.description || '',
    isActive: modelData?.isActive ?? true,
    schema: {
      inputSchema,
      outputSchema,
    },
  };
}

export function getBlocksConfigurationStatus(modelData: Partial<Model> = model): BlockConfigStatus[] {
  if (!modelData || !Array.isArray(modelData.blocks)) {
    return [];
  }

  const connections = modelData.connections || [];

  return modelData.blocks.map((block) => {
    const inputSchema: SchemaField[] = [];
    const outputSchema: SchemaField[] = [];

    block.ports?.forEach((port) => {
      if (port.portType === 'INPUT' && Array.isArray(port.schema)) {
        inputSchema.push(...port.schema);
      } else if (port.portType === 'OUTPUT' && Array.isArray(port.schema)) {
        outputSchema.push(...port.schema);
      }
    });

    const hasConnection = connections.some(
      (conn) =>
        conn.sourceInstanceId === block.instanceId ||
        conn.targetInstanceId === block.instanceId
    );

    return {
      blockId: block.blockId,
      name: block.name,
      blockType: block.blockType,
      isConfigured: hasConnection,
      schema: {
        INPUT: inputSchema,
        OUTPUT: outputSchema,
      },
    };
  });
}

export function getMappedConnectionDetails(modelData: Partial<Model> = model): ModelConnectionSummary {
  const connections = modelData.connections || [];
  const blocks = modelData.blocks || [];

  // Helper map for fast instance lookup
  const blockMap = new Map<string, BlockModel>(
    blocks.map(b => [b.instanceId || b.blockId, b])
  );

  const connectionDetails: ConnectionMappingDetail[] = connections.map((conn) => {
    const sourceBlock = blockMap.get(conn.sourceInstanceId);
    const targetBlock = blockMap.get(conn.targetInstanceId);

    const sourcePort = sourceBlock?.ports.find(p => p.id === conn.sourcePortId);
    const targetPort = targetBlock?.ports.find(p => p.id === conn.targetPortId);

    // Map source and target field schemas matching the connection mapping IDs
    const mappings: MappedFieldDetail[] = (conn.mapping || []).map(m => {
      const sourceField = sourcePort?.schema.find(f => f.id === m.sourceFieldId) || null;
      const targetField = targetPort?.schema.find(f => f.id === m.targetFieldId) || null;

      return { sourceField, targetField };
    });

    return {
      sourceBlockName: sourceBlock?.name || 'Unknown Block',
      sourceInstanceId: conn.sourceInstanceId,
      targetBlockName: targetBlock?.name || 'Unknown Block',
      targetInstanceId: conn.targetInstanceId,
      sourcePortType: sourcePort?.portType || 'OUTPUT',
      targetPortType: targetPort?.portType || 'INPUT',
      mappings,
    };
  });

  return {
    totalConnections: connections.length,
    connectionDetails,
  };
}

export function addSchemaFieldToPort(blockInstanceId: string, portId: string, field: Omit<SchemaField, 'id'>): SchemaField | null {
  const targetBlock = model.blocks?.find(b => b.instanceId === blockInstanceId || b.blockId === blockInstanceId);
  if (!targetBlock) return null;

  const targetPort = targetBlock.ports.find(p => p.id === portId);
  if (!targetPort) return null;

  const newField: SchemaField = {
    id: 'FLD-' + Date.now(),
    ...field
  };
  targetPort.schema.push(newField);
  return newField;
}

export function isInputSchemaMapped(targetInstId: string, targetPortId: string, targetFieldId: string): boolean {
  if (!model.connections) return false;
  return model.connections.some(conn =>
    conn.targetInstanceId === targetInstId &&
    conn.targetPortId === targetPortId &&
    conn.mapping?.some(m => m.targetFieldId === targetFieldId)
  );
}

export function addOrUpdateConnectionMapping(
  sourceInstId: string,
  targetInstId: string,
  sourcePortId: string,
  targetPortId: string,
  sourceFieldId: string,
  targetFieldId: string
): ConnectionRecord | null {
  const conn = model.connections?.find(
    c => c.sourceInstanceId === sourceInstId &&
      c.targetInstanceId === targetInstId &&
      c.sourcePortId === sourcePortId &&
      c.targetPortId === targetPortId
  );

  if (!conn) return null;

  if (isInputSchemaMapped(targetInstId, targetPortId, targetFieldId)) {
    const existingInCurrent = conn.mapping?.find(m => m.targetFieldId === targetFieldId);
    if (!existingInCurrent || existingInCurrent.sourceFieldId !== sourceFieldId) {
      console.warn(`Input field ${targetFieldId} is already mapped and single-use.`);
      return null;
    }
  }

  if (!conn.mapping) conn.mapping = [];

  const existingIndex = conn.mapping.findIndex(
    m => m.sourceFieldId === sourceFieldId || m.targetFieldId === targetFieldId
  );

  if (existingIndex > -1) {
    conn.mapping[existingIndex] = { sourceFieldId, targetFieldId };
  } else {
    conn.mapping.push({ sourceFieldId, targetFieldId });
  }

  return conn;
}

export function removeConnectionMapping(
  sourceInstId: string,
  targetInstId: string,
  sourcePortId: string,
  targetPortId: string,
  sourceFieldId: string,
  targetFieldId: string
) {
  const conn = model.connections?.find(
    c => c.sourceInstanceId === sourceInstId &&
      c.targetInstanceId === targetInstId &&
      c.sourcePortId === sourcePortId &&
      c.targetPortId === targetPortId
  );

  if (conn && conn.mapping) {
    conn.mapping = conn.mapping.filter(
      m => !(m.sourceFieldId === sourceFieldId && m.targetFieldId === targetFieldId)
    );
  }
}

export function removeAllMappingsForConnection() {
  return;
}
/* ================= GUIDANCE VALIDATION LOGIC FOR BLOCK FLOW ================= */

export interface GuidanceStepStatus {
  state: 'red' | 'yellow' | 'green';
  desc: string;
}

export interface GuidanceState {
  step1: GuidanceStepStatus;
  step2: GuidanceStepStatus;
  step3: GuidanceStepStatus;
  step4: GuidanceStepStatus;
  bannerMessage: string;
}

export function validateFlowGuidance(flowNodes: BlockModel[], connections: ConnectionRecord[]): GuidanceState {
  const safeNodes = Array.isArray(flowNodes) ? flowNodes : [];
  const safeConnections = Array.isArray(connections) ? connections : [];

  const inputBlocks = safeNodes.filter(n => n.blockType === 'INPUT');
  const customBlocks = safeNodes.filter(n => n.blockType === 'PROCESSOR');
  const outputBlocks = safeNodes.filter(n => n.blockType === 'OUTPUT');

  const hasAnySchema = (node: BlockModel) =>
    Boolean(node.ports && node.ports.some(p => Array.isArray(p.schema) && p.schema.length > 0));

  const customHasBothSchemas = (node: BlockModel) => {
    const inputPortHasSchema = node.ports?.some(p => p.portType === 'INPUT' && Array.isArray(p.schema) && p.schema.length > 0);
    const outputPortHasSchema = node.ports?.some(p => p.portType === 'OUTPUT' && Array.isArray(p.schema) && p.schema.length > 0);
    return Boolean(inputPortHasSchema && outputPortHasSchema);
  };

  // Step 1: Input Block Status
  let step1: GuidanceStepStatus = { state: 'red', desc: 'Add Input block to start flow' };
  if (inputBlocks.length > 0) {
    step1 = inputBlocks.every(hasAnySchema)
      ? { state: 'green', desc: 'Input block & schema defined' }
      : { state: 'yellow', desc: 'Define schema inside Input block' };
  }

  // Step 2: Custom Block Status
  let step2: GuidanceStepStatus = { state: 'red', desc: 'Add at least one Custom block' };
  if (customBlocks.length > 0) {
    step2 = customBlocks.every(customHasBothSchemas)
      ? { state: 'green', desc: 'Custom block & both schemas defined' }
      : { state: 'yellow', desc: 'Define input & output schemas in Custom block' };
  }

  // Step 3: Output Block Status
  let step3: GuidanceStepStatus = { state: 'red', desc: 'Add Output block to complete flow' };
  if (outputBlocks.length > 0) {
    step3 = outputBlocks.every(hasAnySchema)
      ? { state: 'green', desc: 'Output block & schema defined' }
      : { state: 'yellow', desc: 'Define schema inside Output block' };
  }

  // Step 4: Connection & Mapping Status
  let step4: GuidanceStepStatus = { state: 'red', desc: 'Connect Input → Custom → Output' };
  const hasConnections = safeConnections.length > 0;

  if (hasConnections) {
    step4 = { state: 'yellow', desc: 'Schema mapping required (Custom & Output)' };

    const connectionsWithMapping = safeConnections.filter(c => Array.isArray(c.mapping) && c.mapping.length > 0);
    const customInstanceIds = new Set(customBlocks.map(b => b.instanceId));
    const outputInstanceIds = new Set(outputBlocks.map(b => b.instanceId));

    const customMapped = customBlocks.length > 0 && customBlocks.every(b =>
      connectionsWithMapping.some(c => c.targetInstanceId === b.instanceId)
    );
    const outputMapped = outputBlocks.length > 0 && outputBlocks.every(b =>
      connectionsWithMapping.some(c => c.targetInstanceId === b.instanceId)
    );

    if (customMapped && outputMapped) {
      step4 = { state: 'green', desc: 'Flow connected & schema mapped' };
    }
  }

  // Banner Message Calculation
  let bannerMessage = 'You must add at least one Input Block, one Custom Block, and one Output Block, define input/output schemas, and connect them with complete mapping.';
  if (step1.state === 'green' && step2.state === 'green' && step3.state === 'green' && step4.state === 'green') {
    bannerMessage = 'Great job! Your flow is complete, fully connected, and all schemas are mapped correctly.';
  } else if (hasConnections || step1.state !== 'red' || step2.state !== 'red' || step3.state !== 'red') {
    bannerMessage = 'Flow construction in progress. Ensure schemas and mappings for Custom and Output blocks are complete.';
  }

  return { step1, step2, step3, step4, bannerMessage };
}

/* ================= GUIDANCE VALIDATION LOGIC FOR BLOCK ================= */

export interface BlockGuidanceState {
  step1: GuidanceStepStatus; // Schema
  step2: GuidanceStepStatus; // Connection
  step3: GuidanceStepStatus; // Mapping
  step4: GuidanceStepStatus; // Flow
}

export function validateBlockGuidance(
  blockData: BlockModel | null,
  connections: ConnectionRecord[] = []
): BlockGuidanceState {
  if (!blockData) {
    return {
      step1: { state: 'red', desc: 'Define schema in block' },
      step2: { state: 'red', desc: 'Connection is Established' },
      step3: { state: 'red', desc: 'Schema is Mapped' },
      step4: { state: 'red', desc: 'Flow is Created' }
    };
  }

  const ports = blockData.ports || [];
  const safeConnections = Array.isArray(connections) ? connections : [];

  // 1. Schema Validation
  const hasPorts = ports.length > 0;
  const allPortsHaveSchema = hasPorts && ports.every(p => Array.isArray(p.schema) && p.schema.length > 0);
  const step1State: 'red' | 'green' = allPortsHaveSchema ? 'green' : 'red';
  const step1Desc = allPortsHaveSchema ? 'Schema defined for all ports' : 'Define schema in block';

  // 2. Connection Validation Logic
  let isConnected = false;

  if (blockData.category === 'custom') {
    const inputPortIds = new Set(ports.filter(p => p.portType === 'INPUT').map(p => p.id));
    const outputPortIds = new Set(ports.filter(p => p.portType === 'OUTPUT').map(p => p.id));

    const hasInputConn = safeConnections.some(
      c => c.targetInstanceId === blockData.instanceId && inputPortIds.has(c.targetPortId)
    );
    const hasOutputConn = safeConnections.some(
      c => c.sourceInstanceId === blockData.instanceId && outputPortIds.has(c.sourcePortId)
    );

    isConnected = hasInputConn && hasOutputConn;
  } else {
    isConnected = safeConnections.some(
      c => c.sourceInstanceId === blockData.instanceId || c.targetInstanceId === blockData.instanceId
    );
  }

  const step2State: 'red' | 'green' = isConnected ? 'green' : 'red';
  const step2Desc = isConnected
    ? 'Connection established'
    : blockData.category === 'custom'
      ? 'Connect both Input & Output ports'
      : 'Connection is Established';

  // 3. Mapping Validation: Required for connections where target is this block
  const incomingConnections = safeConnections.filter(c => c.targetInstanceId === blockData.instanceId);
  const isMapped = incomingConnections.length > 0 && incomingConnections.every(c => Array.isArray(c.mapping) && c.mapping.length > 0);

  const step3State: 'red' | 'green' = isMapped ? 'green' : 'red';
  const step3Desc = isMapped ? 'Schema is mapped' : 'Schema is Mapped';

  // 4. Flow Validation
  const hasFlows = Array.isArray(blockData.flows) && blockData.flows.length > 0;
  const step4State: 'red' | 'green' = hasFlows ? 'green' : 'red';
  const step4Desc = hasFlows ? 'Flow created' : 'Flow is Created';

  return {
    step1: { state: step1State, desc: step1Desc },
    step2: { state: step2State, desc: step2Desc },
    step3: { state: step3State, desc: step3Desc },
    step4: { state: step4State, desc: step4Desc }
  };
}


// fix code