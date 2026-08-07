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
        "BKI-CCPP-MC-001",
        "BKI-CCPP-BL-001",
        "BKI-CCPP-OP-001",
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
                    "schema": [

                        { "name": "TL", "type": "decimal", "description": "Tank Length" },
                        { "name": "TW", "type": "decimal", "description": "Tank Width" },
                        { "name": "TD", "type": "decimal", "description": "Tank Depth" },
                        { "name": "ID", "type": "decimal", "description": "Inlet Diameter" },
                        { "name": "OD", "type": "decimal", "description": "Outlet Diameter" },

                        { "name": "FR", "type": "decimal", "description": "Inlet Flow Rate" },
                        { "name": "IV", "type": "decimal", "description": "Inlet Velocity" },
                        { "name": "DEN", "type": "decimal", "description": "Density" },
                        { "name": "VIS", "type": "decimal", "description": "Viscosity" },
                        { "name": "TI", "type": "decimal", "description": "Turbulence Intensity" },
                        { "name": "MS", "type": "number", "description": "Mixer Speed" },

                        { "name": "COD", "type": "decimal", "description": "Chemical Oxygen Demand" },
                        { "name": "BOD", "type": "decimal", "description": "Biochemical Oxygen Demand" },
                        { "name": "DO", "type": "decimal", "description": "Dissolved Oxygen" },
                        { "name": "HRT", "type": "decimal", "description": "Hydraulic Retention Time" },
                        { "name": "AR", "type": "decimal", "description": "Aeration Rate" },
                        { "name": "TEM", "type": "decimal", "description": "Temperature" },
                        { "name": "PH", "type": "decimal", "description": "potential of hydrogen" },
                        { "name": "SSC", "type": "decimal", "description": "Sludge Solids Concentration" },
                        { "name": "BS", "type": "decimal", "description": "Bubble Size" },


                    ]

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
            "flows": []
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
                    "schema": [

                        { "name": "TL", "type": "decimal", "description": "Tank Length" },
                        { "name": "TW", "type": "decimal", "description": "Tank Width" },
                        { "name": "TD", "type": "decimal", "description": "Tank Depth" },
                        { "name": "ID", "type": "decimal", "description": "Inlet Diameter" },
                        { "name": "OD", "type": "decimal", "description": "Outlet Diameter" },
                        { "name": "FR", "type": "decimal", "description": "Inlet Flow Rate" },
                        { "name": "IV", "type": "decimal", "description": "Inlet Velocity" },
                        { "name": "DEN", "type": "decimal", "description": "Density" },
                        { "name": "VIS", "type": "decimal", "description": "Viscosity" },
                        { "name": "TI", "type": "decimal", "description": "Turbulence Intensity" },
                        { "name": "MS", "type": "number", "description": "Mixer Speed" },
                        { "name": "AR", "type": "decimal", "description": "Aeration Rate" },
                    ]
                },
                {
                    "id": "PORT-CCPP-PREP-OUT-001",
                    "name": "prepared_data_output",
                    "portType": "OUTPUT",
                    "portOrder": 1,
                    "schema": [
                        { "name": "MV", "type": "decimal", "description": "Maximum Velocity" },
                        { "name": "AV", "type": "decimal", "description": "Average Velocity" },
                        { "name": "MP", "type": "decimal", "description": "Maximum Pressure" },
                        { "name": "AP", "type": "decimal", "description": "Average Pressure" },
                        { "name": "PD", "type": "decimal", "description": "Pressure Drop" },
                        { "name": "TKE", "type": "decimal", "description": "Turbulent Kinetic Energy" },
                        { "name": "VOR", "type": "decimal", "description": "Vorticity" },
                        { "name": "MI", "type": "decimal", "description": "Mixing Index" },

                    ]

                },
                {
                    "id": "PORT-CCPP-PREP-OUT-002",
                    "name": "prepared_data_output",
                    "portType": "OUTPUT",
                    "portOrder": 2,
                    "schema": [
                        { "name": "TKE", "type": "decimal", "description": "Turbulent Kinetic Energy" },

                    ]

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
            "flows": []
        },
        {
            "id": "BKI-CCPP-ML-001",
            "blockId": "BLK-processor-001",
            "name": "ML Model Training Block",
            "description": "Trains FFNN model",
            "blockType": "PROCESSOR",
            "category": "Mathematical processor",
            "ports": [
                {
                    "id": "PORT-CCPP-ML-IN-001",
                    "name": "training_data_input",
                    "portType": "INPUT",
                    "portOrder": 1,
                    "schema": [
                        { "name": "TKE", "type": "decimal", "description": "Turbulent Kinetic Energy" },
                    ]
                },
                {
                    "id": "PORT-CCPP-ML-OUT-001",
                    "name": "trained_model_output",
                    "portType": "OUTPUT",
                    "portOrder": 1,
                    "schema": [
                        { "name": "EDR", "type": "decimal", "description": "Eddy Dissipation Rate" }

                    ]
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
            "flows": []
        },
        {
            "id": "BKI-CCPP-MC-001",
            "blockId": "BLK-processor-001",
            "name": "ML Model Training Block",
            "description": "Trains FFNN model",
            "blockType": "PROCESSOR",
            "category": "Mathematical processor",
            "ports": [
                {
                    "id": "PORT-CCPP-MC-IN-001",
                    "name": "training_data_input",
                    "portType": "INPUT",
                    "portOrder": 1,
                    "schema": [
                        { "name": "AR", "type": "decimal", "description": "Aeration Rate" },
                        { "name": "BS", "type": "decimal", "description": "Bubble Size" },
                        { "name": "DO", "type": "decimal", "description": "Dissolved Oxygen" },
                        { "name": "TEM", "type": "decimal", "description": "Temperature" },
                        { "name": "FR", "type": "decimal", "description": "Inlet Flow Rate" },
                        { "name": "MS", "type": "number", "description": "Mixer Speed" },

                    ]
                },
                {
                    "id": "PORT-CCPP-MC-OUT-001",
                    "name": "trained_model_output",
                    "portType": "OUTPUT",
                    "portOrder": 1,
                    "schema": [
                        { "name": "OTE", "type": "decimal", "description": "Oxygen Transfer Efficiency" }
                    ]
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
            "flows": []
        },
        {
            "id": "BKI-CCPP-BL-001",
            "blockId": "BLK-processor-001",
            "name": "ML Model Training Block",
            "description": "Trains FFNN model",
            "blockType": "PROCESSOR",
            "category": "Mathematical processor",
            "ports": [
                {
                    "id": "PORT-CCPP-BL-IN-001",
                    "name": "training_data_input",
                    "portType": "INPUT",
                    "portOrder": 1,
                    "schema": [
                        { "name": "SSC", "type": "decimal", "description": "Sludge Solids Concentration" },
                        { "name": "FR", "type": "decimal", "description": "Inlet Flow Rate" },
                        { "name": "HRT", "type": "decimal", "description": "Hydraulic Retention Time" },
                        { "name": "TL", "type": "decimal", "description": "Tank Length" },
                        { "name": "TW", "type": "decimal", "description": "Tank Width" },
                        { "name": "TD", "type": "number", "description": "Tank Depth" },

                    ]
                },
                {
                    "id": "PORT-CCPP-BL-OUT-001",
                    "name": "trained_model_output",
                    "portType": "OUTPUT",
                    "portOrder": 1,
                    "schema": [
                        { "name": "SSE", "type": "decimal", "description": "Sludge Settling Efficiency" }
                    ]
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
            "flows": []
        },
        {
            "id": "BKI-CCPP-OP-001",
            "blockId": "BLK-processor-001",
            "name": "ML Model Training Block",
            "description": "Trains FFNN model",
            "blockType": "PROCESSOR",
            "category": "Mathematical processor",
            "ports": [
                {
                    "id": "PORT-CCPP-OP-IN-001",
                    "name": "training_data_input",
                    "portType": "INPUT",
                    "portOrder": 1,
                    "schema": [
                        { "name": "COD", "type": "decimal", "description": "Chemical Oxygen Demand" },
                        { "name": "BOD", "type": "decimal", "description": "Biochemical Oxygen Demand" },
                        { "name": "HRT", "type": "decimal", "description": "Hydraulic Retention Time" },
                        { "name": "DO", "type": "decimal", "description": "Dissolved Oxygen" },
                        { "name": "AR", "type": "decimal", "description": "Aeration Rate" },
                        { "name": "MS", "type": "number", "description": "Mixer Speed" },
                        { "name": "FR", "type": "decimal", "description": "Inlet Flow Rate" },
                        { "name": "TMP", "type": "decimal", "description": "Temperature" },
                        { "name": "PH", "type": "decimal", "description": "potential of hydrogen" }


                    ]
                },
                {
                    "id": "PORT-CCPP-OP-OUT-001",
                    "name": "trained_model_output",
                    "portType": "OUTPUT",
                    "portOrder": 1,
                    "schema": [
                        { "name": "PRE", "type": "decimal", "description": "Pollutant Removal Efficiency" }
                    ]
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
            "flows": []
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
                    "portOrder": 1,
                    "schema": [
                        { "name": "MV", "type": "decimal", "description": "Maximum Velocity" },
                        { "name": "AV", "type": "decimal", "description": "Average Velocity" },
                        { "name": "MP", "type": "decimal", "description": "Maximum Pressure" },
                        { "name": "AP", "type": "decimal", "description": "Average Pressure" },
                        { "name": "PD", "type": "decimal", "description": "Pressure Drop" },
                        { "name": "TKE", "type": "decimal", "description": "Turbulent Kinetic Energy" },
                        { "name": "EDR", "type": "decimal", "description": "Eddy Dissipation Rate" },
                        { "name": "MI", "type": "decimal", "description": "Mixing Index" },
                        { "name": "OTE", "type": "decimal", "description": "Oxygen Transfer Efficiency" },
                        { "name": "EC", "type": "decimal", "description": "Energy Consumption" },
                        { "name": "PRE", "type": "decimal", "description": "Pollutant Removal Efficiency" },
                        { "name": "VOR", "type": "decimal", "description": "Vorticity" },
                        { "name": "SSE", "type": "decimal", "description": "Sludge Settling Efficiency" },

                    ]
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
            "flows": []
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
            "sourcePortId": "PORT-CCPP-PREP-OUT-002",
            "targetPortId": "PORT-CCPP-ML-IN-001",
            "label": "Prepared Data"
        },
        {
            "id": "BLKCONN-CCPP-003",
            "sourceBlockInstanceId": "BKI-CCPP-PREP-001",
            "targetBlockInstanceId": "BKI-CCPP-OUTPUT-001",
            "sourcePortId": "PORT-CCPP-IN-OUT-001",
            "targetPortId": "PORT-CCPP-OUT-IN-001",
            "label": "Predictions"
        },
        {
            "id": "BLKCONN-CCPP-004",
            "sourceBlockInstanceId": "BKI-CCPP-ML-001",
            "targetBlockInstanceId": "BKI-CCPP-OUTPUT-001",
            "sourcePortId": "PORT-CCPP-ML-OUT-001",
            "targetPortId": "PORT-CCPP-OUT-IN-001",
            "label": "Predictions"
        },
        {
            "id": "BLKCONN-CCPP-005",
            "sourceBlockInstanceId": "BKI-CCPP-INPUT-001",
            "targetBlockInstanceId": "BKI-CCPP-MC-001",
            "sourcePortId": "PORT-CCPP-IN-OUT-001",
            "targetPortId": "PORT-CCPP-MC-IN-001",
            "label": "processing"
        },
        {
            "id": "BLKCONN-CCPP-006",
            "sourceBlockInstanceId": "BKI-CCPP-MC-001",
            "targetBlockInstanceId": "BKI-CCPP-OUTPUT-001",
            "sourcePortId": "PORT-CCPP-MC-OUT-001",
            "targetPortId": "PORT-CCPP-OUT-IN-001",
            "label": "processing"
        },
        {
            "id": "BLKCONN-CCPP-007",
            "sourceBlockInstanceId": "BKI-CCPP-INPUT-001",
            "targetBlockInstanceId": "BKI-CCPP-BL-001",
            "sourcePortId": "PORT-CCPP-IN-OUT-001",
            "targetPortId": "PORT-CCPP-BL-IN-001",
            "label": "processing"
        },
        {
            "id": "BLKCONN-CCPP-008",
            "sourceBlockInstanceId": "BKI-CCPP-BL-001",
            "targetBlockInstanceId": "BKI-CCPP-OUTPUT-001",
            "sourcePortId": "PORT-CCPP-BL-OUT-001",
            "targetPortId": "PORT-CCPP-OUT-IN-001",
            "label": "processing"
        },
        {
            "id": "BLKCONN-CCPP-009",
            "sourceBlockInstanceId": "BKI-CCPP-INPUT-001",
            "targetBlockInstanceId": "BKI-CCPP-OP-001",
            "sourcePortId": "PORT-CCPP-IN-OUT-001",
            "targetPortId": "PORT-CCPP-OP-IN-001",
            "label": "processing"
        },
        {
            "id": "BLKCONN-CCPP-010",
            "sourceBlockInstanceId": "BKI-CCPP-OP-001",
            "targetBlockInstanceId": "BKI-CCPP-OUTPUT-001",
            "sourcePortId": "PORT-CCPP-OP-OUT-001",
            "targetPortId": "PORT-CCPP-OUT-IN-001",
            "label": "processing"
        },
    ]
}

