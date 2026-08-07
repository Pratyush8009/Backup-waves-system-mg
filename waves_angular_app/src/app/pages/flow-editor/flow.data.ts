export const block = {
    "id": "BKI-CCPP-PREP-001",
    "blockId": "BLK-processor-001",
    "name": "Data Preparation Block",
    "description": "Splits and scales the dataset",
    "blockType": "PROCESSOR",
    "category": "Without ML processor blocks",
    "flows": [
        {
            "id": "FLW-CCPP-PREP-001",
            "name": "Train-Test Split Flow",
            "flowType": "SEQUENTIAL",
            "priorityLevel": 1,
            "status": "READY",
            "nodes": [
                {
                    "id": "NODE-INPUT-001",
                    "nodeId": "NLK-input-001",
                    "name": "Load CCPP Input",
                    "nodeType": "INPUT",
                    "category": "ML input node",
                    "order": 1,
                    "ports": [
                        {
                            "id": "PORT-CCPP-PREP-OUT-001",
                            "name": "prepared_data_output",
                            "portType": "OUTPUT",
                            "portOrder": 1
                        }
                    ],
                    "config": {
                        "fileType": "excel",
                        "filePath": "Folds5x2_pp.xlsx",
                        "useCols": "A:E"
                    },
                    "uiLayout": {
                        "canvasX": 300,
                        "canvasY": 200,
                        "canvasWidth": 200,
                        "canvasHeight": 40,
                        "color": "#004dc0",
                        "icon": "file-excel",
                        "borderStyle": "solid"
                    }
                },
                {
                    "id": "NODE-PROCESSOR-001",
                    "nodeId": "NLK-processor-001",
                    "name": "Load CCPP Excel Data",
                    "nodeType": "PROCESSOR",
                    "category": "ML process node",
                    "order": 1,
                    "ports": [
                        {
                            "id": "PORT-CCPP-PREP-IN-001",
                            "name": "raw_data_input",
                            "portType": "INPUT",
                            "portOrder": 1
                        },
                        {
                            "id": "PORT-CCPP-PREP-OUT-001",
                            "name": "prepared_data_output",
                            "portType": "OUTPUT",
                            "portOrder": 1
                        }
                    ],
                    "config": {
                        "fileType": "excel",
                        "filePath": "Folds5x2_pp.xlsx",
                        "useCols": "A:E"
                    },
                    "uiLayout": {
                        "canvasX": 350,
                        "canvasY": 300,
                        "canvasWidth": 220,
                        "canvasHeight": 40,
                        "color": "#FF9800",
                        "icon": "pie-chart",
                        "borderStyle": "solid"
                    }
                }
            ],
            "nodeConnections": [
                {
                    "id": "NLKCONN-CCPP-002",
                    "sourceNodeInstanceId": "NODE-INPUT-001",
                    "targetNodeInstanceId": "NODE-PROCESSOR-001",
                    "sourcePortId": "PORT-CCPP-PREP-OUT-001",
                    "targetPortId": "PORT-CCPP-PREP-IN-001"
                }
            ]
        },
        {
            "id": "FLW-CCPP-EVAL-002",
            "name": "Visualization Flow",
            "flowType": "PARALLEL",
            "priorityLevel": 1,
            "status": "READY",
            "nodes": [
                {
                    "id": "NODE-INPUT-001",
                    "nodeId": "NLK-input-001",
                    "name": "Generate Plots",
                    "nodeType": "INPUT",
                    "category": "RRB input node",
                    "order": 1,
                    "ports": [
                        {
                            "id": "PORT-RRB-PREP-OUT-001",
                            "name": "prepared_data_output",
                            "portType": "OUTPUT",
                            "portOrder": 1
                        }
                    ],
                    "config": {
                        "plotTypes": [
                            "prediction_scatter"
                        ],
                        "saveToFile": true,
                        "fileFormat": "png"
                    },
                    "uiLayout": {
                        "canvasX": 300,
                        "canvasY": 200,
                        "canvasWidth": 200,
                        "canvasHeight": 40,
                        "color": "#1456b8",
                        "icon": "file-excel",
                        "borderStyle": "solid"
                    }
                },
                {
                    "id": "NODE-PROCESSOR-001",
                    "nodeId": "NLK-processor-001",
                    "name": "Metrics Flow",
                    "nodeType": "PROCESSOR",
                    "category": "ML process node",
                    "order": 1,
                    "ports": [
                        {
                            "id": "PORT-MP-IN-001",
                            "name": "raw_data_input",
                            "portType": "INPUT",
                            "portOrder": 1
                        },
                        {
                            "id": "PORT-MP-OUT-001",
                            "name": "prepared_data_output",
                            "portType": "OUTPUT",
                            "portOrder": 1
                        },
                        {
                            "id": "PORT-MP-OUT-002",
                            "name": "prepared_data_output",
                            "portType": "OUTPUT",
                            "portOrder": 2
                        }
                    ],
                    "config": {
                        "metrics": [
                            "r2_score",
                            "mse",
                            "mae"
                        ]
                    },
                    "uiLayout": {
                        "canvasX": 350,
                        "canvasY": 300,
                        "canvasWidth": 200,
                        "canvasHeight": 40,
                        "color": "#FF9800",
                        "icon": "codepen",
                        "borderStyle": "solid"
                    }
                },
                {
                    "id": "NODE-OUTPUT-001",
                    "nodeId": "NLK-output-001",
                    "name": "Save Results Flow",
                    "nodeType": "OUTPUT",
                    "category": "ML output node",
                    "order": 1,
                    "ports": [
                        {
                            "id": "PORT-SF-IN-001",
                            "name": "raw_data_input",
                            "portType": "INPUT",
                            "portOrder": 1
                        }
                    ],
                    "config": {
                        "destination": "DATABASE",
                        "format": "KERAS_H5"
                    },
                    "uiLayout": {
                        "canvasX": 350,
                        "canvasY": 400,
                        "canvasWidth": 200,
                        "canvasHeight": 40,
                        "color": "#068b32",
                        "icon": "save",
                        "borderStyle": "solid"
                    }
                }
            ],
            "nodeConnections": [
                {
                    "id": "NLKCONN-CCPP-001",
                    "sourceNodeInstanceId": "NODE-INPUT-001",
                    "targetNodeInstanceId": "NODE-PROCESSOR-001",
                    "sourcePortId": "PORT-RRB-PREP-OUT-001",
                    "targetPortId": "PORT-MP-IN-001"
                },
                {
                    "id": "NLKCONN-CCPP-002",
                    "sourceNodeInstanceId": "NODE-PROCESSOR-001",
                    "targetNodeInstanceId": "NODE-OUTPUT-001",
                    "sourcePortId": "PORT-MP-OUT-001",
                    "targetPortId": "PORT-SF-IN-001"
                }
            ]
        }
    ]
}






