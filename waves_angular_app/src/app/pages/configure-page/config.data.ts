export const blockFlow = {
    "id": "PIP-MDL-ccpp-001",
    "systemId": "SYS-550e8400-e29b-41d4-a716-446655440001",
    "entityType": "MODEL",
    "entityId": "MDL-660e8400-e29b-41d4-a716-446655440101",
    "entityVersion": "2.1.0",
    "name": "CCPP Power Output Prediction Pipeline",
    "description": "Feed-forward neural network for Combined Cycle Power Plant power output prediction",
    "version": "1.0.0",
    "isActive": true,
    "createdAt": "2024-01-20T09:00:00Z",
    "updatedAt": "2024-03-22T11:00:00Z",
    "blockMembers": [
        "BKI-CCPP-INPUT-001",
        "BKI-CCPP-PREP-001",
        "BKI-CCPP-ML-001",
        "BKI-CCPP-EVAL-001",
        "BKI-CCPP-OUTPUT-001"
    ],
    "blocks": [
        {
            "id": "BKI-CCPP-INPUT-001",
            "blockId": "BLK-input-001",
            "name": "Data Ingestion Block",
            "description": "Loads CCPP dataset from Excel file",
            "blockType": "INPUT",
            "category": "I/O Blocks",
            "ports": [
                {
                    "id": "PORT-CCPP-IN-OUT-001",
                    "name": "dataset_output",
                    "portType": "OUTPUT",
                    "portOrder": 1,
                    "dataType": "DATAFRAME",
                    "schema": {
                        "type": "object",
                        "properties": {
                            "AT": {
                                "type": "number",
                                "description": "Ambient Temperature"
                            },
                            "V": {
                                "type": "number",
                                "description": "Exhaust Vacuum"
                            },
                            "AP": {
                                "type": "number",
                                "description": "Ambient Pressure"
                            },
                            "RH": {
                                "type": "number",
                                "description": "Relative Humidity"
                            },
                            "PE": {
                                "type": "number",
                                "description": "Power Output (target)"
                            }
                        }
                    },
                    "isRequired": true
                }
            ],
            "uiLayout": {
                "canvasX": 50,
                "canvasY": 100,
                "canvasWidth": 200,
                "canvasHeight": 40,
                "color": "#4CAF50",
                "icon": "database",
                "borderStyle": "solid"
            },
            "flows": [
                {
                    "id": "FLW-CCPP-IN-001",
                    "name": "Data Loading Flow",
                    "flowType": "SEQUENTIAL",
                    "priorityLevel": 1,
                    "status": "READY",
                    "nodes": [
                        {
                            "id": "NODI-CCPP-001",
                            "nodeTypeId": "data_loader",
                            "name": "Load CCPP Excel Data",
                            "order": 1,
                            "config": {
                                "fileType": "excel",
                                "filePath": "Folds5x2_pp.xlsx",
                                "useCols": "A:E"
                            },
                            "uiLayout": {
                                "canvasX": 100,
                                "canvasY": 30,
                                "canvasWidth": 200,
                                "canvasHeight": 40,
                                "color": "#2196F3",
                                "icon": "file-excel",
                                "label": "Load Excel"
                            }
                        }
                    ]
                }
            ]
        },
        {
            "id": "BKI-CCPP-PREP-001",
            "blockId": "BLK-processor-001",
            "name": "Data Preparation Block",
            "description": "Splits and scales the dataset",
            "blockType": "PROCESSOR",
            "category": "Without ML processor blocks",
            "ports": [
                {
                    "id": "PORT-CCPP-PREP-IN-001",
                    "name": "raw_data_input",
                    "portType": "INPUT",
                    "portOrder": 1,
                    "dataType": "DATAFRAME"
                },
                {
                    "id": "PORT-CCPP-PREP-OUT-001",
                    "name": "prepared_data_output",
                    "portType": "OUTPUT",
                    "portOrder": 1,
                    "dataType": "OBJECT"
                }
            ],
            "uiLayout": {
                "canvasX": 300,
                "canvasY": 200,
                "canvasWidth": 200,
                "canvasHeight": 40,
                "color": "#FF9800",
                "icon": "dashboard",
                "borderStyle": "solid"
            },
            "flows": [
                {
                    "id": "FLW-CCPP-PREP-001",
                    "name": "Train-Test Split Flow",
                    "flowType": "SEQUENTIAL",
                    "priorityLevel": 1,
                    "status": "READY",
                    "nodes": [
                        {
                            "id": "NODI-CCPP-002",
                            "nodeTypeId": "train_test_split",
                            "name": "Split Dataset",
                            "order": 1,
                            "config": {
                                "testSize": 0.2,
                                "randomState": 100,
                                "validationSplit": false
                            },
                            "uiLayout": {
                                "canvasX": 150,
                                "canvasY": 100,
                                "canvasWidth": 200,
                                "canvasHeight": 40,
                                "color": "#FF9800",
                                "icon": "file-excel",
                                "label": "Load Excel"
                            }
                        },
                        {
                            "id": "NODI-CCPP-003",
                            "nodeTypeId": "standard_scaler",
                            "name": "Scale Features",
                            "order": 2,
                            "config": {
                                "withMean": true,
                                "withStd": true,
                                "fitOnTrain": true
                            },
                            "uiLayout": {
                                "canvasX": 150,
                                "canvasY": 300,
                                "canvasWidth": 200,
                                "canvasHeight": 40,
                                "color": "#2a960a",
                                "icon": "file-excel",
                                "label": "Load Excel"
                            }
                        }
                    ],
                    "nodeConnections": [
                        {
                            "id": "NODCONN-CCPP-001",
                            "sourceNodeId": "NODI-CCPP-002",
                            "targetNodeId": "NODI-CCPP-003"
                        }
                    ]
                }
            ]
        },
        {
            "id": "BKI-CCPP-ML-001",
            "blockId": "BLK-processor-002",
            "name": "ML Model Training Block",
            "description": "Trains FFNN model",
            "blockType": "PROCESSOR",
            "category": "Mathematical processor",
            "ports": [
                {
                    "id": "PORT-CCPP-ML-IN-001",
                    "name": "training_data_input",
                    "portType": "INPUT",
                    "portOrder": 1
                },
                {
                    "id": "PORT-CCPP-ML-OUT-001",
                    "name": "trained_model_output",
                    "portType": "OUTPUT",
                    "portOrder": 1
                }
            ],
            "uiLayout": {
                "canvasX": 590,
                "canvasY": 200,
                "canvasWidth": 200,
                "canvasHeight": 40,
                "color": "#9C27B0",
                "icon": "file-sync",
                "borderStyle": "solid"
            },
            "flows": [
                {
                    "id": "FLW-CCPP-ML-001",
                    "name": "FFNN Training Flow",
                    "flowType": "SEQUENTIAL",
                    "priorityLevel": 1,
                    "status": "READY",
                    "nodes": [
                        {
                            "id": "NODI-CCPP-004",
                            "nodeTypeId": "ffnn_model",
                            "name": "Train FFNN",
                            "order": 1,
                            "config": {
                                "layers": [
                                    {
                                        "neurons": 8,
                                        "activation": "relu"
                                    },
                                    {
                                        "neurons": 5,
                                        "activation": "relu"
                                    }
                                ],
                                "inputDim": 4,
                                "outputDim": 1,
                                "kernelInitializer": "he_normal",
                                "optimizer": "Adam",
                                "loss": "mse",
                                "epochs": 25,
                                "batchSize": 50,
                                "earlyStopping": {
                                    "enabled": false
                                }
                            },
                            "uiLayout": {
                                "canvasX": 250,
                                "canvasY": 350,
                                "canvasWidth": 200,
                                "canvasHeight": 40,
                                "color": "#9C27B0",
                                "icon": "file-excel",
                                "label": "Load Excel"
                            }
                        },
                        {
                            "id": "NODI-CCPP-005",
                            "nodeTypeId": "model_predictor",
                            "name": "Make Predictions",
                            "order": 2,
                            "config": {
                                "inverseTransform": true,
                                "batchSize": 32
                            },
                            "uiLayout": {
                                "canvasX": 300,
                                "canvasY": 300,
                                "canvasWidth": 200,
                                "canvasHeight": 40,
                                "color": "#9C27B0",
                                "icon": "file-excel",
                                "label": "Load Excel"
                            }
                        }
                    ],
                    "nodeConnections": [
                        {
                            "id": "NODCONN-CCPP-002",
                            "sourceNodeId": "NODI-CCPP-004",
                            "targetNodeId": "NODI-CCPP-005"
                        }
                    ]
                }
            ]
        },
        {
            "id": "BKI-CCPP-EVAL-001",
            "blockId": "BLK-processor-001",
            "name": "Model Evaluation Block",
            "description": "Evaluates model performance",
            "blockType": "PROCESSOR",
            "category": "Without ML processor blocks",
            "ports": [
                {
                    "id": "PORT-CCPP-EVAL-IN-001",
                    "name": "predictions_input",
                    "portType": "INPUT",
                    "portOrder": 1
                },
                {
                    "id": "PORT-CCPP-EVAL-OUT-001",
                    "name": "evaluation_output",
                    "portType": "OUTPUT",
                    "portOrder": 1
                }
            ],
            "uiLayout": {
                "canvasX": 860,
                "canvasY": 200,
                "canvasWidth": 200,
                "canvasHeight": 40,
                "color": "#00BCD4",
                "icon": "rocket",
                "borderStyle": "solid"
            },
            "flows": [
                {
                    "id": "FLW-CCPP-EVAL-001",
                    "name": "Metrics Flow",
                    "flowType": "PARALLEL",
                    "priorityLevel": 1,
                    "status": "READY",
                    "nodes": [
                        {
                            "id": "NODI-CCPP-006",
                            "nodeTypeId": "metrics_calculator",
                            "name": "Calculate R2",
                            "order": 1,
                            "config": {
                                "metrics": [
                                    "r2_score",
                                    "mse",
                                    "mae"
                                ]
                            },
                            "uiLayout": {
                                "canvasX": 350,
                                "canvasY": 400,
                                "canvasWidth": 200,
                                "canvasHeight": 40,
                                "color": "#00BCD4",
                                "icon": "file-excel",
                                "label": "Load Excel"
                            }
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
                            "id": "NODI-CCPP-007",
                            "nodeTypeId": "model_visualizer",
                            "name": "Generate Plots",
                            "order": 1,
                            "config": {
                                "plotTypes": [
                                    "prediction_scatter"
                                ],
                                "saveToFile": true,
                                "fileFormat": "png"
                            },
                            "uiLayout": {
                                "canvasX": 400,
                                "canvasY": 450,
                                "canvasWidth": 200,
                                "canvasHeight": 40,
                                "color": "#E91E63",
                                "icon": "file-excel",
                                "label": "Load Excel"
                            }
                        }
                    ]
                }
            ]
        },
        {
            "id": "BKI-CCPP-OUTPUT-001",
            "blockId": "BLK-output-001",
            "name": "Results Output Block",
            "description": "Outputs model and results",
            "blockType": "OUTPUT",
            "category": "I/O Blocks",
            "ports": [
                {
                    "id": "PORT-CCPP-OUT-IN-001",
                    "name": "results_input",
                    "portType": "INPUT",
                    "portOrder": 1
                }
            ],
            "uiLayout": {
                "canvasX": 1130,
                "canvasY": 200,
                "canvasWidth": 200,
                "canvasHeight": 40,
                "color": "#4CAF50",
                "icon": "save",
                "borderStyle": "solid"
            },
            "flows": [
                {
                    "id": "FLW-CCPP-OUT-001",
                    "name": "Save Results Flow",
                    "flowType": "SEQUENTIAL",
                    "priorityLevel": 1,
                    "status": "READY",
                    "nodes": [
                        {
                            "id": "NODI-CCPP-008",
                            "nodeTypeId": "NTYPE-write-001",
                            "name": "Save Model & Metrics",
                            "order": 1,
                            "config": {
                                "destination": "DATABASE",
                                "format": "KERAS_H5"
                            },
                            "uiLayout": {
                                "canvasX": 450,
                                "canvasY": 350,
                                "canvasWidth": 200,
                                "canvasHeight": 40,
                                "color": "#00BCD4",
                                "icon": "file-excel",
                                "label": "Load Excel"
                            }
                        }
                    ]
                }
            ]
        }
    ],
    "blockConnections": [
        {
            "id": "BLKCONN-CCPP-001",
            "sourceBlockInstanceId": "BKI-CCPP-INPUT-001",
            "targetBlockInstanceId": "BKI-CCPP-PREP-001",
            "sourcePortId": "PORT-CCPP-IN-OUT-001",
            "targetPortId": "PORT-CCPP-PREP-IN-001",
            "label": "Raw Dataset"
        },
        {
            "id": "BLKCONN-CCPP-002",
            "sourceBlockInstanceId": "BKI-CCPP-PREP-001",
            "targetBlockInstanceId": "BKI-CCPP-ML-001",
            "sourcePortId": "PORT-CCPP-PREP-OUT-001",
            "targetPortId": "PORT-CCPP-ML-IN-001",
            "label": "Prepared Data"
        },
        {
            "id": "BLKCONN-CCPP-003",
            "sourceBlockInstanceId": "BKI-CCPP-ML-001",
            "targetBlockInstanceId": "BKI-CCPP-EVAL-001",
            "sourcePortId": "PORT-CCPP-ML-OUT-001",
            "targetPortId": "PORT-CCPP-EVAL-IN-001",
            "label": "Predictions"
        },
        {
            "id": "BLKCONN-CCPP-004",
            "sourceBlockInstanceId": "BKI-CCPP-EVAL-001",
            "targetBlockInstanceId": "BKI-CCPP-OUTPUT-001",
            "sourcePortId": "PORT-CCPP-EVAL-OUT-001",
            "targetPortId": "PORT-CCPP-OUT-IN-001",
            "label": "Results"
        }
    ]
}