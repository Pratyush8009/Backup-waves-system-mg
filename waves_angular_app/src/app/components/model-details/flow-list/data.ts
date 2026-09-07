export const flowsData = [
    {
        FlowId: 'Flow-958769348796',
        BlockId: 'BLK-43785874385',
        entityType: 'Flow',
        name: 'Boiler Flow',
        description: 'Description of tata power plant Flow',
        nodes: [
            {
                nodeId: 'NLK-input-001',
                instanceId: 'NLK-1787831711017',
                name: 'Input',
                nodeType: 'INPUT',
                category: 'system',
                ports: [
                    { id: 'PORT-OUT-001', name: 'output_1', portType: 'OUTPUT', portOrder: 1, schema: [], isDefault: true }
                ],
                uiLayout: { canvasX: 30, canvasY: 100, canvasWidth: 110, canvasHeight: 45, color: '#1890ff', icon: 'arrow-right' },
            },
            {
                nodeId: 'NLK-processor-001',
                instanceId: 'NLK-1787831921251',
                name: 'ML',
                nodeType: 'PROCESSOR',
                category: 'custom',
                ports: [
                    { id: 'PORT-IN-001', name: 'input_1', portType: 'INPUT', portOrder: 1, schema: [], mapping: [], isDefault: true },
                    { id: 'PORT-OUT-001', name: 'output_1', portType: 'OUTPUT', portOrder: 1, schema: [], isDefault: true }
                ],
                uiLayout: { canvasX: 190, canvasY: 30, canvasWidth: 110, canvasHeight: 45, color: '#a08000', icon: 'setting' },
            },
            {
                nodeId: 'NLK-output-001',
                name: 'Output',
                blockType: 'OUTPUT',
                category: 'system',
                ports: [
                    { id: 'PORT-IN-001', name: 'input_1', portType: 'INPUT', portOrder: 1, schema: [], mapping: [], isDefault: true }
                ],
                uiLayout: { canvasX: 340, canvasY: 110, canvasWidth: 110, canvasHeight: 45, color: '#1890ff', icon: 'file' },
                instanceId: 'NLK-1787831926518'
            }
        ],
        connections: [
            {
                sourceInstanceId: 'NLK-1787831711017',
                targetInstanceId: 'NLK-1787831921251',
                sourcePortId: 'PORT-OUT-001',
                targetPortId: 'PORT-IN-001'
            },
            {
                sourceInstanceId: 'NLK-1787831921251',
                targetInstanceId: 'NLK-1787831926518',
                sourcePortId: 'PORT-OUT-001',
                targetPortId: 'PORT-IN-001'
            }
        ]
    }
];