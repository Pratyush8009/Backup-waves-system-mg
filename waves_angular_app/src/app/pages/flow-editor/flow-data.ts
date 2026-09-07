import { ConnectionRecord, Port, UiLayout } from '../block-editor/data'
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


export const savedFlows: SavedFlow[] = [
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
            "schema": [],
            "isDefault": true
          }
        ],
        "uiLayout": {
          "canvasX": 121,
          "canvasY": 172,
          "canvasWidth": 150,
          "canvasHeight": 50,
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
            "schema": [],
            "isDefault": true
          }
        ],
        "uiLayout": {
          "canvasX": 905,
          "canvasY": 192,
          "canvasWidth": 150,
          "canvasHeight": 50,
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
                "id": "PORT-IN-LO-001",
                "name": "LO",
                "type": "decimal",
                "description": "Inlet Flow Rate"
              },
              {
                "id": "PORT-IN-GO-001",
                "name": "GO",
                "type": "decimal",
                "description": "Inlet Velocity"
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
                "name": "NO",
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
          "canvasWidth": 160,
          "canvasHeight": 60,
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
        'mapping':[]
      },
      {
        "sourceInstanceId": "NDI-1788513073500",
        "targetInstanceId": "NDI-1788513071875",
        "sourcePortId": "PORT-OUT-001",
        "targetPortId": "PORT-IN-001",
        'mapping':[]
      }
    ]
  }
];
