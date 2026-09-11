import { ConnectionRecord, Port, UiLayout, SchemaField, PortFieldMapping, GuidanceStepStatus } from '../block-editor/data';

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

export interface SavedFlow {
  id: string;
  blockId: string;
  name: string;
  description?: string;
  nodes: NodeModel[];
  connections: ConnectionRecord[];
}

export interface Panel {
  name: string;
  active: boolean;
  nodes: NodeModel[];
}

export const panels: Panel[] = [
  {
    name: 'I/O Nodes',
    active: true,
    nodes: [
      {
        id: "LIB-IN-001",
        nodeId: "NLK-input-001",
        name: "Input",
        nodeType: "INPUT",
        description: "Block Input Schema Port Container",
        category: "I/O",
        ports: [{ id: "PORT-OUT-001", name: "output_1", portType: "OUTPUT", portOrder: 1, schema: [], isDefault: true }],
        uiLayout: { canvasX: 0, canvasY: 0, canvasWidth: 150, canvasHeight: 50, color: "#0855b4", icon: "arrow-right" }
      },
      {
        id: "LIB-OUT-001",
        nodeId: "NLK-output-001",
        name: "Output",
        nodeType: "OUTPUT",
        description: "Block Output Schema Port Container",
        category: "I/O",
        ports: [{ id: "PORT-IN-001", name: "input_1", portType: "INPUT", portOrder: 1, schema: [], isDefault: true }],
        uiLayout: { canvasX: 0, canvasY: 0, canvasWidth: 150, canvasHeight: 50, color: "#858585", icon: "file" }
      }
    ]
  },
  {
    name: 'Processing Nodes',
    active: true,
    nodes: [
      {
        id: "LIB-ML-001",
        nodeId: "NLK-ML-001",
        name: "ML",
        nodeType: "ML",
        description: "Node for calculating ML models",
        category: "MACHINE_LEARNING",
        ports: [
          {
            id: "PORT-IN-001", name: "in_1", portType: "INPUT", portOrder: 1, schema: [
              { id: "PORT-IN-LO-001", name: "LO", type: "decimal", description: "Inlet Flow Rate" },
              { id: "PORT-IN-GO-001", name: "GO", type: "decimal", description: "Inlet Velocity" },
            ], isDefault: true
          },
          {
            id: "PORT-OUT-001", name: "out_1", portType: "OUTPUT", portOrder: 1, schema: [
              { id: "PORT-IN-NO-001", name: "NO", type: "decimal", description: "Inlet Flow Rate" },
            ], isDefault: true,
          },
        ],
        config: {},
        uiLayout: { canvasX: 0, canvasY: 0, canvasWidth: 160, canvasHeight: 60, color: "#9c650b", icon: "api" }
      },
      {
        id: "LIB-PROC-001",
        nodeId: "NLK-proc-001",
        name: "Filter",
        nodeType: "FILTER",
        description: "Node for filtering data streams",
        category: "DATA_FILTERING",
        ports: [
          { id: "PORT-IN-001", name: "in_1", portType: "INPUT", portOrder: 1, schema: [], isDefault: true },
          { id: "PORT-OUT-001", name: "out_1", portType: "OUTPUT", portOrder: 1, schema: [], isDefault: true },
        ],
        config: {},
        uiLayout: { canvasX: 0, canvasY: 0, canvasWidth: 160, canvasHeight: 60, color: "#096a88", icon: "filter" }
      }
    ]
  },
  {
    name: 'Nodes',
    active: true,
    nodes: [
      {
        id: "VAL-IN-001",
        nodeId: "NLK-VAL-001",
        name: "Validator",
        nodeType: "VALIDATOR",
        description: "Block Input Schema Port Container",
        category: "validator",
        ports: [],
        config: {},
        uiLayout: { canvasX: 0, canvasY: 0, canvasWidth: 150, canvasHeight: 50, color: "#a30808", icon: "scan" }
      },
      {
        id: "DS-DB-001",
        nodeId: "NLK-DS-001",
        name: "DATA SOURCE",
        nodeType: "DATA_SOURCE",
        description: "Block Output Schema Port Container",
        category: "database",
        ports: [],
        config: {},
        uiLayout: { canvasX: 0, canvasY: 0, canvasWidth: 150, canvasHeight: 50, color: "#9c0e79", icon: "database" }
      },
      {
        id: "CON-CTJ-001",
        nodeId: "NLK-CTJ-001",
        name: "CSV to JSON",
        nodeType: "CSVTOJSON",
        description: "Convert CSV to JSON",
        category: "converter",
        ports: [
          { id: "PORT-OUT-001", name: "out_1", portType: "OUTPUT", portOrder: 1, schema: [], isDefault: true },
        ],
        config: {},
        uiLayout: { canvasX: 0, canvasY: 0, canvasWidth: 150, canvasHeight: 50, color: "#9c9a0e", icon: "column-width" }
      },
      {
        id: "CON-JTC-001",
        nodeId: "NLK-JTC-001",
        name: "JSON to CSV",
        nodeType: "JSONTOCSV",
        description: "Convert JSON to CSV",
        category: "converter",
        ports: [],
        config: {},
        uiLayout: { canvasX: 0, canvasY: 0, canvasWidth: 150, canvasHeight: 50, color: "#0c9785", icon: "column-width" }
      }
    ]
  }
];

export let savedFlows: SavedFlow[] = [
  {
    "id": "FLOW-1788513066735",
    "blockId": "BKI-1788238837987",
    "name": "Flow-1",
    "description": "",
    "nodes": [
      {
        "id": "LIB-IN-001",
        "nodeId": "NLK-input-001",
        "name": "Input",
        "nodeType": "INPUT",
        "description": "Block Input Schema Port Container",
        "category": "I/O",
        "ports": [
          {
            "id": "PORT-OUT-001",
            "name": "output_1",
            "portType": "OUTPUT",
            "portOrder": 1,
            "schema": [
              {
                "id": "FLD-1788238893743",
                "name": "EBI1",
                "type": "decimal",
                "description": ""
              }
            ],
            "isDefault": true
          }
        ],
        "uiLayout": {
          "canvasX": 121,
          "canvasY": 172,
          "canvasWidth": 170,
          "canvasHeight": 70,
          "color": "#0855b4",
          "icon": "arrow-right"
        },
        "instanceId": "NDI-1788513069461"
      },
      {
        "id": "LIB-OUT-001",
        "nodeId": "NLK-output-001",
        "name": "Output",
        "nodeType": "OUTPUT",
        "description": "Block Output Schema Port Container",
        "category": "I/O",
        "ports": [
          {
            "id": "PORT-IN-001",
            "name": "input_1",
            "portType": "INPUT",
            "portOrder": 1,
            "schema": [
              {
                "id": "FLD-1788238923503",
                "name": "EBO1",
                "type": "integer",
                "description": ""
              }
            ],
            "isDefault": true
          }
        ],
        "uiLayout": {
          "canvasX": 905,
          "canvasY": 192,
          "canvasWidth": 170,
          "canvasHeight": 70,
          "color": "#858585",
          "icon": "file"
        },
        "instanceId": "NDI-1788513071875"
      },
      {
        "id": "LIB-ML-001",
        "nodeId": "NLK-ML-001",
        "name": "ML",
        "nodeType": "ML",
        "description": "Node for calculating ML models",
        "category": "MACHINE_LEARNING",
        "ports": [
          {
            "id": "PORT-IN-001",
            "name": "in_1",
            "portType": "INPUT",
            "portOrder": 1,
            "schema": [
              {
                "id": "FLD-1788238893743",
                "name": "MNI1",
                "type": "decimal",
                "description": ""
              }
            ],
            "isDefault": true
          },
          {
            "id": "PORT-OUT-001",
            "name": "out_1",
            "portType": "OUTPUT",
            "portOrder": 1,
            "schema": [
              {
                "id": "PORT-IN-NO-001",
                "name": "MNO1",
                "type": "decimal",
                "description": "Inlet Flow Rate"
              }
            ],
            "isDefault": true
          }
        ],
        "config": {},
        "uiLayout": {
          "canvasX": 540,
          "canvasY": 232,
          "canvasWidth": 170,
          "canvasHeight": 70,
          "color": "#9c650b",
          "icon": "api"
        },
        "instanceId": "NDI-1788513073500"
      }
    ],
    "connections": [
      {
        "sourceInstanceId": "NDI-1788513069461",
        "targetInstanceId": "NDI-1788513073500",
        "sourcePortId": "PORT-OUT-001",
        "targetPortId": "PORT-IN-001",
        "mapping": [
          { "sourceFieldId": "FLD-1788238893743", "targetFieldId": "FLD-1788238893743" }
        ]
      },
      {
        "sourceInstanceId": "NDI-1788513073500",
        "targetInstanceId": "NDI-1788513071875",
        "sourcePortId": "PORT-OUT-001",
        "targetPortId": "PORT-IN-001",
        "mapping": [
          { "sourceFieldId": "PORT-IN-NO-001", "targetFieldId": "FLD-1788238923503" }
        ]
      }
    ]
  },
  {
    "id": "FLOW-1788777614068",
    "blockId": "BKI-1788238837987",
    "name": "Flow-2",
    "description": "",
    "nodes": [
      {
        "id": "LIB-IN-001",
        "nodeId": "NLK-input-001",
        "name": "Input",
        "nodeType": "INPUT",
        "description": "Block Input Schema Port Container",
        "category": "I/O",
        "ports": [
          {
            "id": "PORT-OUT-001",
            "name": "output_1",
            "portType": "OUTPUT",
            "portOrder": 1,
            "schema": [
              { "id": "FLD-1788238893743", "name": "EBI1", "type": "decimal", "description": "" },
              { "id": "FLD-1788238902496", "name": "EBI2", "type": "integer", "description": "" }
            ],
            "isDefault": true
          }
        ],
        "uiLayout": {
          "canvasX": 293,
          "canvasY": 194,
          "canvasWidth": 170,
          "canvasHeight": 70,
          "color": "#0855b4",
          "icon": "arrow-right"
        },
        "instanceId": "NDI-1788777647249"
      },
      {
        "id": "LIB-OUT-001",
        "nodeId": "NLK-output-001",
        "name": "Output",
        "nodeType": "OUTPUT",
        "description": "Block Output Schema Port Container",
        "category": "I/O",
        "ports": [
          {
            "id": "PORT-IN-001",
            "name": "input_1",
            "portType": "INPUT",
            "portOrder": 1,
            "schema": [
              { "id": "FLD-1788238931967", "name": "EBO2", "type": "integer", "description": "" }
            ],
            "isDefault": true
          }
        ],
        "uiLayout": {
          "canvasX": 640,
          "canvasY": 217,
          "canvasWidth": 170,
          "canvasHeight": 70,
          "color": "#858585",
          "icon": "file"
        },
        "instanceId": "NDI-1788777651327"
      }
    ],
    "connections": [
      {
        "sourceInstanceId": "NDI-1788777647249",
        "targetInstanceId": "NDI-1788777651327",
        "sourcePortId": "PORT-OUT-001",
        "targetPortId": "PORT-IN-001",
        "mapping": []
      }
    ]
  }
];

export function getDataTypeColor(type: string): string {
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

export function getDataTypeTextColor(type: string): string {
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

export function addSchemaFieldToPortInFlow(
  flow: SavedFlow,
  nodeInstanceId: string,
  portId: string,
  field: Omit<SchemaField, 'id'>
): SchemaField | null {
  const targetNode = flow.nodes.find(n => n.instanceId === nodeInstanceId);
  if (!targetNode) return null;

  const targetPort = targetNode.ports.find(p => p.id === portId);
  if (!targetPort) return null;

  const newField: SchemaField = {
    id: 'FLD-' + Date.now(),
    ...field
  };
  targetPort.schema.push(newField);
  return newField;
}


export function isInputSchemaMappedInFlow(
  flow: SavedFlow,
  targetInstId: string,
  targetPortId: string,
  targetFieldId: string
): boolean {
  if (!flow.connections) return false;
  return flow.connections.some(conn =>
    conn.targetInstanceId === targetInstId &&
    conn.targetPortId === targetPortId &&
    conn.mapping?.some(m => m.targetFieldId === targetFieldId)
  );
}

export function addOrUpdateConnectionMappingInFlow(
  flow: SavedFlow,
  sourceInstId: string,
  targetInstId: string,
  sourcePortId: string,
  targetPortId: string,
  sourceFieldId: string,
  targetFieldId: string
): ConnectionRecord | null {
  const conn = flow.connections?.find(
    c => c.sourceInstanceId === sourceInstId &&
      c.targetInstanceId === targetInstId &&
      c.sourcePortId === sourcePortId &&
      c.targetPortId === targetPortId
  );

  if (!conn) return null;

  if (isInputSchemaMappedInFlow(flow, targetInstId, targetPortId, targetFieldId)) {
    const existingInCurrent = conn.mapping?.find(m => m.targetFieldId === targetFieldId);
    if (!existingInCurrent || existingInCurrent.sourceFieldId !== sourceFieldId) {
      console.warn(`Input field ${targetFieldId} is already mapped and single-use.`);
      return null;
    }
  }

  if (!conn.mapping) conn.mapping = [];

  const existingIndex = conn.mapping.findIndex(
    m => m.sourceFieldId === sourceFieldId && m.targetFieldId === targetFieldId
  );

  if (existingIndex > -1) {
    return conn;
  }

  const sourceExists = conn.mapping.some(m => m.sourceFieldId === sourceFieldId);
  const targetExists = conn.mapping.some(m => m.targetFieldId === targetFieldId);

  if (sourceExists) {
    const index = conn.mapping.findIndex(m => m.sourceFieldId === sourceFieldId);
    conn.mapping[index] = { sourceFieldId, targetFieldId };
  } else if (targetExists) {
    const index = conn.mapping.findIndex(m => m.targetFieldId === targetFieldId);
    conn.mapping[index] = { sourceFieldId, targetFieldId };
  } else {
    conn.mapping.push({ sourceFieldId, targetFieldId });
  }

  return conn;
}


export function removeConnectionMappingFromFlow(
  flow: SavedFlow,
  sourceInstId: string,
  targetInstId: string,
  sourcePortId: string,
  targetPortId: string,
  sourceFieldId: string,
  targetFieldId: string
) {
  const conn = flow.connections?.find(
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


export function removeAllMappingsForConnectionInFlow(
  flow: SavedFlow,
  sourceInstId: string,
  targetInstId: string,
  sourcePortId: string,
  targetPortId: string
) {
  const conn = flow.connections?.find(
    c => c.sourceInstanceId === sourceInstId &&
      c.targetInstanceId === targetInstId &&
      c.sourcePortId === sourcePortId &&
      c.targetPortId === targetPortId
  );

  if (conn) {
    conn.mapping = [];
  }
}

export function getMappingPairsForConnection(
  flow: SavedFlow,
  sourceInstId: string,
  targetInstId: string,
  sourcePortId: string,
  targetPortId: string
): { sourceField: SchemaField | null; targetField: SchemaField | null }[] {
  const conn = flow.connections?.find(
    c => c.sourceInstanceId === sourceInstId &&
      c.targetInstanceId === targetInstId &&
      c.sourcePortId === sourcePortId &&
      c.targetPortId === targetPortId
  );

  if (!conn || !conn.mapping) return [];

  const sourceNode = flow.nodes.find(n => n.instanceId === sourceInstId);
  const targetNode = flow.nodes.find(n => n.instanceId === targetInstId);
  const sourcePort = sourceNode?.ports.find(p => p.id === sourcePortId);
  const targetPort = targetNode?.ports.find(p => p.id === targetPortId);

  return conn.mapping.map(m => {
    const sourceField = sourcePort?.schema.find(f => f.id === m.sourceFieldId) || null;
    const targetField = targetPort?.schema.find(f => f.id === m.targetFieldId) || null;
    return { sourceField, targetField };
  });
}



// Save functions - these maintain the reference to the array
export function saveFlow(flow: SavedFlow): void {
  console.log('=== saveFlow called ===');
  console.log('Flow to save:', flow.id);

  const index = savedFlows.findIndex(f => f.id === flow.id);
  console.log('Found at index:', index);

  if (index > -1) {
    // Update existing flow - keep the same object reference but update properties
    const existingFlow = savedFlows[index];
    // Only update the data, don't replace the object
    existingFlow.blockId = flow.blockId;
    existingFlow.name = flow.name;
    existingFlow.description = flow.description;
    existingFlow.nodes = flow.nodes;
    existingFlow.connections = flow.connections;
    console.log('Updated existing flow at index:', index);
  } else {
    // Add new flow
    savedFlows.push(flow);
    console.log('Added new flow, new length:', savedFlows.length);
  }

  console.log('Current savedFlows length after save:', savedFlows.length);
  console.log('All flow IDs:', savedFlows.map(f => f.id));
  console.log('=== saveFlow completed ===');
}

export function deleteFlow(flowId: string): void {
  const index = savedFlows.findIndex(f => f.id === flowId);
  if (index !== -1) {
    savedFlows.splice(index, 1);
  }
}

export function getSavedFlows(): SavedFlow[] {
  return savedFlows;
}


/* ================= FLOW EDITOR GUIDANCE & VALIDATION ================= */

export interface FlowGuidanceState {
  step1: GuidanceStepStatus; 
  step2: GuidanceStepStatus; 
  step3: GuidanceStepStatus; 
  step4: GuidanceStepStatus; 
  bannerMessage: string;
}

export function validateFlowEditorGuidance(flow: SavedFlow | null): FlowGuidanceState {
  if (!flow || !Array.isArray(flow.nodes)) {
    return {
      step1: { state: 'red', desc: 'Add I/O nodes to start flow' },
      step2: { state: 'red', desc: 'Add at least one Processing node' },
      step3: { state: 'red', desc: 'Connect Input → Processor → Output' },
      step4: { state: 'red', desc: 'Map schema fields across connections' },
      bannerMessage: 'Start by adding Input and Output container nodes to your canvas.'
    };
  }

  const nodes = flow.nodes || [];
  const connections = flow.connections || [];

  const ioInputNodes = nodes.filter(n => n.nodeType === 'INPUT');
  const ioOutputNodes = nodes.filter(n => n.nodeType === 'OUTPUT');
  const processingNodes = nodes.filter(n => n.nodeType !== 'INPUT' && n.nodeType !== 'OUTPUT');

  const hasSchema = (node: NodeModel) =>
    Boolean(node.ports && node.ports.some(p => Array.isArray(p.schema) && p.schema.length > 0));

  const processorHasBothSchemas = (node: NodeModel) => {
    const hasInputSchema = node.ports?.some(p => p.portType === 'INPUT' && Array.isArray(p.schema) && p.schema.length > 0);
    const hasOutputSchema = node.ports?.some(p => p.portType === 'OUTPUT' && Array.isArray(p.schema) && p.schema.length > 0);
    return Boolean(hasInputSchema && hasOutputSchema);
  };

  let step1: GuidanceStepStatus = { state: 'red', desc: 'Add both Input & Output container nodes' };
  if (ioInputNodes.length > 0 && ioOutputNodes.length > 0) {
    const inputValid = ioInputNodes.every(hasSchema);
    const outputValid = ioOutputNodes.every(hasSchema);

    if (inputValid && outputValid) {
      step1 = { state: 'green', desc: 'Input & Output nodes configured' };
    } else {
      step1 = { state: 'yellow', desc: 'Ensure I/O nodes have port schemas defined' };
    }
  } else if (ioInputNodes.length > 0 || ioOutputNodes.length > 0) {
    step1 = { state: 'yellow', desc: 'Missing either Input or Output container node' };
  }

  let step2: GuidanceStepStatus = { state: 'red', desc: 'Add processing node (e.g. ML, Filter)' };
  if (processingNodes.length > 0) {
    step2 = processingNodes.every(processorHasBothSchemas)
      ? { state: 'green', desc: 'Processing nodes & schemas configured' }
      : { state: 'yellow', desc: 'Define input & output port schemas on processing nodes' };
  }

  let step3: GuidanceStepStatus = { state: 'red', desc: 'Connect nodes sequentially' };
  const hasConnections = connections.length > 0;

  if (hasConnections) {
    const connectedNodeIds = new Set<string>();
    connections.forEach(c => {
      connectedNodeIds.add(c.sourceInstanceId);
      connectedNodeIds.add(c.targetInstanceId);
    });

    const allNodesConnected = nodes.every(n => connectedNodeIds.has(n.instanceId || ''));

    if (allNodesConnected) {
      step3 = { state: 'green', desc: 'All nodes connected' };
    } else {
      step3 = { state: 'yellow', desc: 'Unconnected nodes remaining on canvas' };
    }
  }

  let step4: GuidanceStepStatus = { state: 'red', desc: 'Map schema fields between ports' };
  if (hasConnections) {
    const mappedConnections = connections.filter(c => Array.isArray(c.mapping) && c.mapping.length > 0);

    if (mappedConnections.length === connections.length && connections.length > 0) {
      step4 = { state: 'green', desc: 'All connection schemas mapped' };
    } else if (mappedConnections.length > 0) {
      step4 = { state: 'yellow', desc: 'Some connection mappings incomplete' };
    } else {
      step4 = { state: 'yellow', desc: 'Map fields for created connections' };
    }
  }

  let bannerMessage = 'Add I/O nodes, processing nodes, establish connections, and map schema fields to complete the flow.';
  if (step1.state === 'green' && step2.state === 'green' && step3.state === 'green' && step4.state === 'green') {
    bannerMessage = 'Flow validation complete! All nodes connected and schemas properly mapped.';
  } else if (step1.state === 'green' && step2.state === 'green') {
    bannerMessage = 'Nodes configured. Now connect the nodes and map the field schemas.';
  }

  return { step1, step2, step3, step4, bannerMessage };
}


/* ================= Node GUIDANCE & VALIDATION ================= */

export interface NodeGuidanceState {
  step1: GuidanceStepStatus; 
  step2: GuidanceStepStatus; 
  step3: GuidanceStepStatus; 
  step4: GuidanceStepStatus; 
}


export function validateNodeGuidance(
  node: NodeModel | null,
  connections: ConnectionRecord[] = []
): NodeGuidanceState {
  if (!node) {
    return {
      step1: { state: 'red', desc: 'Define schema in node' },
      step2: { state: 'red', desc: 'Connect node ports' },
      step3: { state: 'red', desc: 'Map schema fields' },
      step4: { state: 'red', desc: 'Configure node properties' }
    };
  }

  const ports = node.ports || [];
  const safeConnections = Array.isArray(connections) ? connections : [];

  const hasPorts = ports.length > 0;
  const allPortsHaveSchema = hasPorts && ports.every(p => Array.isArray(p.schema) && p.schema.length > 0);
  const step1State: 'red' | 'green' = allPortsHaveSchema ? 'green' : 'red';
  const step1Desc = allPortsHaveSchema ? 'Node schemas defined' : 'Define schema for node ports';

  let isConnected = false;
  if (node.nodeType === 'INPUT') {
    isConnected = safeConnections.some(c => c.sourceInstanceId === node.instanceId);
  } else if (node.nodeType === 'OUTPUT') {
    isConnected = safeConnections.some(c => c.targetInstanceId === node.instanceId);
  } else {
    const inputPortIds = new Set(ports.filter(p => p.portType === 'INPUT').map(p => p.id));
    const outputPortIds = new Set(ports.filter(p => p.portType === 'OUTPUT').map(p => p.id));

    const hasInputConn = safeConnections.some(
      c => c.targetInstanceId === node.instanceId && inputPortIds.has(c.targetPortId)
    );
    const hasOutputConn = safeConnections.some(
      c => c.sourceInstanceId === node.instanceId && outputPortIds.has(c.sourcePortId)
    );

    isConnected = hasInputConn && hasOutputConn;
  }

  const step2State: 'red' | 'green' = isConnected ? 'green' : 'red';
  const step2Desc = isConnected
    ? 'Node connections established'
    : 'Connect node to flow network';

  let isMapped = false;

  if (node.nodeType === 'INPUT') {
    const outgoingConns = safeConnections.filter(c => c.sourceInstanceId === node.instanceId);
    isMapped = outgoingConns.length > 0 && outgoingConns.every(c => Array.isArray(c.mapping) && c.mapping.length > 0);
  } else {
    const incomingConns = safeConnections.filter(c => c.targetInstanceId === node.instanceId);
    isMapped = incomingConns.length > 0 && incomingConns.every(c => Array.isArray(c.mapping) && c.mapping.length > 0);
  }

  const step3State: 'red' | 'green' = isMapped ? 'green' : 'red';
  const step3Desc = isMapped ? 'Schema fields mapped' : 'Map schema fields across connections';

  const isIoNode = node.nodeType === 'INPUT' || node.nodeType === 'OUTPUT';
  const hasConfig = isIoNode || Boolean(node.config && Object.keys(node.config).length > 0);
  const step4State: 'red' | 'green' = hasConfig ? 'green' : 'red';
  const step4Desc = hasConfig ? 'Node configured' : 'Set node configuration parameters';

  return {
    step1: { state: step1State, desc: step1Desc },
    step2: { state: step2State, desc: step2Desc },
    step3: { state: step3State, desc: step3Desc },
    step4: { state: step4State, desc: step4Desc }
  };
}