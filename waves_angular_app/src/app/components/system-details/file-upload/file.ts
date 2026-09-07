export const modelSchema = {
    "id": "SYS-550e8400-e29b-41d4-a716-446655440001",
    "name": "Manufacturing Unit ABC",
    "inputProperties": [
        {
            "id": 1,
            "name": "Temperature",
            "description": "Ambient temperature from sensor array",
            "dataType": "float",
            "propertyType": "input",
            "unit": "celsius",
            "allowNull": false,
            "defaultValue": null,
            "validation": {
                "min": -50,
                "max": 150
            }
        },
        {
            "id": 2,
            "name": "Vacuum",
            "description": "Exhaust vacuum pressure reading",
            "dataType": "float",
            "propertyType": "input",
            "unit": "cm Hg",
            "allowNull": false,
            "defaultValue": null,
            "validation": {
                "min": 0,
                "max": 100
            }
        },
        {
            "id": 3,
            "name": "Pressure",
            "description": "Ambient atmospheric pressure",
            "dataType": "float",
            "propertyType": "input",
            "unit": "millibar",
            "allowNull": true,
            "defaultValue": 1013.25,
            "validation": {
                "min": 900,
                "max": 1100
            }
        },
        {
            "id": 5,
            "name": "Humidity",
            "description": "Relative humidity percentage",
            "dataType": "float",
            "propertyType": "input",
            "unit": "percent",
            "allowNull": false,
            "defaultValue": null,
            "validation": {
                "min": 0,
                "max": 100
            }
        },
        {
            "id": 6,
            "name": "Energy",
            "description": "Static threshold trigger marker for critical pressure monitoring",
            "dataType": "float",
            "propertyType": "input",
            "unit": "millibar",
            "allowNull": false,
            "defaultValue": null,
            "validation": {
                "min": 0,
                "max": 100
            }
        }
    ],
    "outputProperties": [
        {
            "id": 4,
            "name": "Power Output",
            "description": "Net hourly electrical energy output",
            "dataType": "float",
            "propertyType": "output",
            "unit": "MW",
            "allowNull": false,
            "defaultValue": null,
            "validation": {
                "min": 420,
                "max": 500
            }
        },
        {
            "id": 12,
            "name": "Efficiency",
            "description": "Overall equipment efficiency percentage",
            "dataType": "float",
            "propertyType": "output",
            "unit": "percent",
            "allowNull": true,
            "defaultValue": null,
            "validation": {
                "min": 0,
                "max": 100
            }
        },
        {
            "id": 7,
            "name": "PredictedFailure",
            "description": "Binary flag indicating potential equipment failure",
            "dataType": "boolean",
            "propertyType": "output",
            "unit": null,
            "allowNull": true,
            "defaultValue": false
        },
        {
            "id": 8,
            "name": "AnomalyScore",
            "description": "Anomaly detection confidence score",
            "dataType": "float",
            "propertyType": "output",
            "unit": null,
            "allowNull": true,
            "defaultValue": null,
            "validation": {
                "min": 0,
                "max": 1
            }
        }
    ]
}


export const modelFileGroups = [{
    date: '20 July 2026',
    files: [
        { id: '92cdd610-1bbb-4a04-bda5-75c810fb10c0', name: 'thermal_power_plant.excel', size: '25MB', status: 'pending', type: "csv" },
        { id: '35b4acfb-688c-4cc9-b7b0-bce3cfbb8865', name: 'sugar_power_plant.excel', size: '7MB', status: 'completed', type: "excel" },
        { id: '5be3d9cd-6d7a-4137-b1fb-d4ab5d417c14', name: 'ciment_factory.excel', size: '18MB', status: 'completed', type: "csv", }
    ]
},
{
    date: '18 July 2026',
    files: [
        { id: '45cf05ea-505c-4708-8699-424f651a8405', name: 'manufacture_power_plantt.excel', size: '20MB', status: 'completed', type: "csv" },
        { id: '3afa1042-f7d7-410f-be73-58d9eca9f4fc', name: 'sugar_power_plant.excel', size: '7MB', status: 'completed', type: "excel" },
    ]
},
{
    date: '14 March 2026',
    files: [
        { id: '45cf05ea-126c-4708-8699-424f651a8405', name: 'manufacture_power_plantt.excel', size: '20MB', status: 'pending', type: "csv" },
        { id: '3afa1042-f7d7-410f-be73-58d9eca9c6fc', name: 'sugar_power_plant.excel', size: '7MB', status: 'completed', type: "excel" },
    ]
}
]


export const analysisFileGroups = {
    MonthlyProductionAnalysis: [{
        date: '20 July 2026',
        files: [
            { id: '92cdd610-1aab-4a04-bda5-75c810fb10c0', name: 'thermal_power_plant.excel', size: '25MB', status: 'pending', type: "csv" },
            { id: '35b4acfb-677c-4cc9-b7b0-bce3cfbb8865', name: 'sugar_power_plant.excel', size: '7MB', status: 'completed', type: "excel" },
            { id: '5be3d9cd-6d5b-4137-b1fb-d4ab5d417c14', name: 'ciment_factory.excel', size: '18MB', status: 'completed', type: "csv", }
        ]
    },
    {
        date: '18 July 2026',
        files: [
            { id: '45cf05ea-303c-4708-8699-424f651a8405', name: 'manufacture_power_plantt.excel', size: '20MB', status: 'pending', type: "csv" },
            { id: '3afa1042-f7d7-410f-be73-58d9eca9f4fc', name: 'sugar_power_plant.excel', size: '7MB', status: 'completed', type: "excel" },
        ]
    }
    ],
    WeeklyProductionAnalysis: [{
        date: '19 July 2026',
        files: [
            { id: '92cdd610-1aab-4a04-bda5-75c810fb11c0', name: 'petrol_pump.excel', size: '10MB', status: 'pending', type: "csv" },
            { id: '3a89ce8a-c128-4178-8bdd-a646dd390c70', name: 'Oil_gas.excel', size: '7MB', status: 'completed', type: "excel" },
            { id: '8f90f809-2e77-4ee2-947e-dd7102574425', name: 'ciment_factory.excel', size: '18MB', status: 'completed', type: "csv", }
        ]
    },
    {
        date: '18 July 2026',
        files: [
            { id: '9cc9c832-5977-4cc6-b27b-14628af88405', name: 'manufacture_power_plantt.excel', size: '20MB', status: 'pending', type: "csv" },
            { id: '9cc9c832-5977-4cc6-b27b-14628af88405', name: 'sugar_power_plant.excel', size: '7MB', status: 'completed', type: "excel" },
        ]
    }
    ]
}

export const fileData = [
    {
        "fileId": "92cdd610-1bbb-4a04-bda5-75c810fb10c0",
        "fileName": "thermal_power_plant.csv",
        "type": "csv",
        "totalRows": 5,
        "columns": ["index", "temperature", "vacuum", "pressure", "humidity", "energy"],
        "tableData": [
            { "index": 1, "temperature": 100.33, "vacuum": 200.11, "pressure": 30.44, "humidity": 40.6, "energy": 44.6 },
            { "index": 2, "temperature": 101.33, "vacuum": 23.11, "pressure": 18.44, "humidity": 22.6, "energy": 81.6 },
            { "index": 3, "temperature": 200.33, "vacuum": 19.11, "pressure": 30.44, "humidity": 16.6, "energy": 44.6 },
            { "index": 4, "temperature": 200.33, "vacuum": 19.11, "pressure": 30.44, "humidity": 16.6, "energy": 44.6 },
            { "index": 5, "temperature": 200.33, "vacuum": 19.11, "pressure": 30.44, "humidity": 16.6, "energy": 44.6 }
        ]
    },
    {
        "fileId": "35b4acfb-688c-4cc9-b7b0-bce3cfbb8865",
        "fileName": "sugar_power_plant.excel",
        "type": "excel",
        "totalRows": 5,
        "columns": ["index", "temperature", "vacuum", "pressure", "humidity", "energy"],
        "tableData": [
            { "index": 1, "temperature": 100.33, "vacuum": 200.11, "pressure": 30.44, "humidity": 40.6, "energy": 44.6 },
            { "index": 2, "temperature": 101.33, "vacuum": 23.11, "pressure": 18.44, "humidity": 22.6, "energy": 81.6 },
            { "index": 3, "temperature": 200.33, "vacuum": 19.11, "pressure": 30.44, "humidity": 16.6, "energy": 44.6 },
            { "index": 4, "temperature": 200.33, "vacuum": 19.11, "pressure": 30.44, "humidity": 16.6, "energy": 44.6 },
            { "index": 5, "temperature": 200.33, "vacuum": 19.11, "pressure": 30.44, "humidity": 16.6, "energy": 44.6 }
        ]
    }
]