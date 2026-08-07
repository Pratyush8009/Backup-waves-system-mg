

export const AVAILABLE_TEMPLATES = [
    {
        templateId: 'tmp-syd-1',
        templateCategory: 'SYSTEM',
        name: 'Manufacturing System Template',
        description:
            'Template for manufacturing systems with real-time monitoring and analysis capabilities',
        type: 'MANUFACTURING',
        createdAt: '2024-01-10T09:00:00Z',
        updatedAt: '2024-02-15T11:30:00Z',
        sectionList: [
            {
                sectionId: 'tmp-syd-sec-001',
                title: 'Analysis Instances Highlights',
                description: 'General Analysis instances KPIs',
                parentPlaceholderTemplate: 'system-grid-full',
                validation: [
                    {
                        allowCharts: true,
                        allowPlotComponentId: ['kpi-single-001', 'kpi-multi-001'],
                    },
                    { allowTables: false, allowPlotComponentId: [] },
                ],
            },
            {
                sectionId: 'tmp-syd-sec-002',
                title: 'Model Results Monitoring',
                description:
                    'For system models, monitoring the model results and performance metrics',
                parentPlaceholderTemplate: 'system-grid-01',
                validation: [
                    {
                        allowCharts: true,
                        allowPlotComponentId: [
                            'single-line-001',
                            'multi-line-ts-001',
                            'multi-line-idx-001',
                            'scatter-001',
                            'scatter-multi-001',
                            'gauge-001',
                            'donut-001',
                            'bar-single-001',
                            'bar-grouped-001',
                            'parallel-001',
                            'heatmap-001',
                            'heatmap-corr-001',
                            'kpi-single-001',
                            'kpi-multi-001',
                            'radar-001',
                            'pie-001',
                        ],
                    },
                    {
                        allowTables: true,
                        allowPlotComponentId: ['Table-001', 'Table-002'],
                    },
                ],
            },
        ],
    },
    {
        templateId: 'tmp-syd-2',
        templateCategory: 'SYSTEM',
        name: 'System Template 2',
        description: 'Another system template for different use cases',
        type: 'SYSTEM',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-02-20T11:00:00Z',
        sectionList: [
            {
                sectionId: 'tmp-syd-sec-t2-002',
                title: 'System Performance Metrics',
                description: 'Key performance indicators for system monitoring',
                parentPlaceholderTemplate: 'system-grid-01',
                validation: [
                    {
                        allowCharts: true,
                        allowPlotComponentId: [
                            'kpi-single-001',
                            'kpi-multi-001',
                            'single-line-001',
                        ],
                    },
                    { allowTables: false, allowPlotComponentId: [] },
                ],
            },
        ],
    }
];


export const system = {
    id: 'SYS-550e8400-e29b-41d4-a716-446655440001',
    name: 'Sugar Power Plant',
    templates: [
        {
            templateId: 'tmp-syd-1',
            status: 'active',
            plots: [
                {
                    plotId: 'single-line-001-instance-001',
                    plotComponentId: 'single-line-001',
                    title: 'Energy Output Trend',
                    category: "category-1",
                    chartType: 'single-line',
                    parentPlaceholderTemplate: 'system-grid-02',
                    belongSection: 'tmp-syd-sec-002',
                    mappedField: 'Table-2-yearly2-table',
                    metadata: {
                        label: 'Energy Output Over Time',
                        xAxis: 'ts',
                        yAxis: 'PowerOutput',
                        xAxisLabel: 'Time',
                        yAxisLabel: 'Power',
                        series: ['Efficiency', 'PredictedFailure', 'AnomalyScore'],
                        unit: 'MW',
                        yMin: 400,
                        yMax: 500,
                        normalize: false,
                        thresholds: { warning: 440, critical: 430 },
                    },
                },
                // {
                //     plotId: 'multi-line-ts-001-instance-001',
                //     plotComponentId: 'multi-line-ts-001',
                //     title: 'Temperature & Pressure Trends',
                //     category: "category-1",
                //     chartType: 'multi-line-ts',
                //     parentPlaceholderTemplate: 'system-grid-02',
                //     belongSection: 'tmp-syd-sec-002',
                //     mappedField: 'Table-2-yearly2-table',
                //     metadata: {
                //         label: 'Environmental Parameters Over Time',
                //         xAxis: 'ts',
                //         series: ['Efficiency', 'PredictedFailure', 'AnomalyScore'],
                //         unit: 'Mixed',
                //         yMin: 0,
                //         yMax: null,
                //         thresholds: { warning: 0, critical: 0 },
                //     },
                // },
                // {
                //     plotId: 'multi-line-idx-001-instance-001',
                //     plotComponentId: 'multi-line-idx-001',
                //     title: 'Environmental Factors Trend',
                //     category: "category-1",
                //     chartType: 'multi-line-index',
                //     parentPlaceholderTemplate: 'system-grid-02',
                //     belongSection: 'tmp-syd-sec-002',
                //     mappedField: 'Table-1-yearly-1-table',
                //     metadata: {
                //         label: 'AT, AP, and RH Stability',
                //         xAxis: 'index',
                //         series: ['Efficiency', 'PredictedFailure', 'AnomalyScore'],
                //         unit: 'Mixed',
                //         normalize: true,
                //     },
                // },
                // // 4. Single Scatter
                // {
                //     plotId: 'scatter-001-instance-001',
                //     plotComponentId: 'scatter-001',
                //     title: 'Temperature vs Energy Output',
                //     category: "category-1",
                //     chartType: 'scatter',
                //     parentPlaceholderTemplate: 'system-grid-02',
                //     belongSection: 'tmp-syd-sec-002',
                //     mappedField: 'Table-1-yearly-1-table',
                //     metadata: {
                //         label: 'Ambient Temperature Impact on Power Generation',
                //         xAxis: 'Temperature',
                //         yAxis: 'PowerOutput',
                //         xAxisLabel: 'Ambient Temperature (°C)',
                //         yAxisLabel: 'Power Output (MW)',
                //         colorBy: null,
                //         colorByLabel: null,
                //     },
                // },
                // // 6. Gauge
                // {
                //     plotId: 'gauge-001-instance-001',
                //     plotComponentId: 'gauge-001',
                //     title: 'Current Power Output',
                //     category: "category-1",
                //     chartType: 'gauge',
                //     parentPlaceholderTemplate: 'system-grid-02',
                //     belongSection: 'tmp-syd-sec-002',
                //     mappedField: 'Table-1-yearly-1-table',
                //     metadata: {
                //         label: 'Real-time Power Generation',
                //         valueField: 'PowerOutput',
                //         unit: 'MW',
                //         min: 400,
                //         max: 500,
                //         thresholds: {
                //             warning: 440,
                //             critical: 430,
                //         },
                //     },
                // },


                // // 7. Donut
                // {
                //     plotId: 'donut-001-instance-001',
                //     plotComponentId: 'donut-001',
                //     title: 'Resource Allocation',
                //     category: "category-1",
                //     chartType: 'donut',
                //     parentPlaceholderTemplate: 'system-grid-02',
                //     belongSection: 'tmp-syd-sec-002',
                //     mappedField: 'Table-1-yearly-1-table',
                //     metadata: {
                //         label: 'Operating Parameter Distribution',
                //         labelField: 'index',
                //         valueField: 'Efficiency',
                //     },
                // },
                // // Pie
                // {
                //     plotId: 'pie-001-instance-001',
                //     plotComponentId: 'pie-001',
                //     title: 'Energy Distribution',
                //     category: "category-1",
                //     chartType: 'pie',
                //     parentPlaceholderTemplate: 'system-grid-01',
                //     belongSection: "tmp-syd-sec-002",
                //     mappedField: 'Table-1-yearly-1-table',
                //     metadata: {
                //         label: 'Power Output Distribution',
                //         labelField: 'index',
                //         valueField: 'PowerOutput',
                //         showPercentage: true,
                //         showLegend: true,
                //     },
                // },
                // //bar single
                // {
                //     plotId: 'bar-single-001-instance-001',
                //     plotComponentId: 'bar-single-001',
                //     title: 'Energy Output by Period',
                //     category: "category-1",
                //     chartType: 'bar-single',
                //     parentPlaceholderTemplate: 'system-grid-02',
                //     belongSection: 'tmp-syd-sec-002',
                //     mappedField: 'Table-1-yearly-1-table',
                //     metadata: {
                //         label: 'Power Generation Overview',
                //         xAxis: 'index',
                //         yAxis: 'PowerOutput',
                //         unit: 'MW',
                //         thresholds: { warning: 440, critical: 430 },
                //     },
                // },


                // // 11. Heatmap
                // {
                //     plotId: 'heatmap-001-instance-001',
                //     plotComponentId: 'heatmap-001',
                //     title: 'Parameter Density Matrix',
                //     category: "category-1",
                //     chartType: 'heatmap',
                //     parentPlaceholderTemplate: 'system-grid-02',
                //     mappedField: 'Table-1-yearly-1-table',
                //     belongSection: 'tmp-syd-sec-002',
                //     metadata: {
                //         label: 'Environmental Data Density',
                //         fields: ['Efficiency', 'PredictedFailure', 'AnomalyScore'],
                //         xAxis: 'index',
                //         mode: 'value',
                //         normalize: true,
                //         colorRange: [0, 1],
                //     },
                // },
                // // 9. Bar Grouped
                // {
                //     plotId: 'bar-grouped-001-instance-001',
                //     plotComponentId: 'bar-grouped-001',
                //     title: 'Parameter Comparison',
                //     category: "category-1",
                //     chartType: 'bar-grouped',
                //     parentPlaceholderTemplate: 'system-grid-02',
                //     belongSection: "tmp-syd-sec-002",
                //     mappedField: 'Table-1-yearly-1-table',
                //     metadata: {
                //         label: 'Key Performance Indicators',
                //         categoryField: 'index',
                //         series: ['Efficiency', 'PredictedFailure', 'AnomalyScore', 'PowerAnalysis'],
                //         orientation: 'vertical',
                //         rowIndex: 0,
                //     },
                // },
                // // parllel-coods
                // {
                //     plotId: 'parallel-001-instance-001',
                //     plotComponentId: 'parallel-001',
                //     title: 'Plant Operating Profile',
                //     category: "category-1",
                //     chartType: 'parallel-coords',
                //     parentPlaceholderTemplate: 'system-grid-01',
                //     belongSection: 'tmp-syd-sec-002',
                //     mappedField: 'Table-1-yearly-1-table',
                //     metadata: {
                //         label: 'Multi-Variable Power Profile',
                //         axes: ['Efficiency', 'PredictedFailure', 'AnomalyScore', 'PowerAnalysis'],
                //         colorBy: 'PowerOutput',
                //         colorByLabel: 'Energy Output (MW)',
                //     },
                // },

                // {
                //     plotId: 'kpi-single-001-instance-001',
                //     plotComponentId: 'kpi-single-001',
                //     title: 'Current Efficiency',
                //     category: "category-1",
                //     chartType: 'stat-card',
                //     parentPlaceholderTemplate: 'system-grid-01',
                //     mappedField: 'Table-1-yearly-1-table',
                //     belongSection: 'tmp-syd-sec-001',
                //     metadata: {
                //         label: 'Power Output',
                //         valueField: 'PowerOutput',
                //         aggregation: 'last',
                //         unit: 'MW',
                //         trendField: 'Efficiency',
                //         thresholds: {
                //             warning: 440,
                //             critical: 430,
                //         },
                //     },
                // },

                // {
                //     plotId: 'kpi-multi-001-instance-001',
                //     plotComponentId: 'kpi-multi-001',
                //     title: 'System Performance Dashboard',
                //     category: "category-1",
                //     chartType: 'multi-kpi',
                //     parentPlaceholderTemplate: 'system-grid-01',
                //     belongSection: 'tmp-syd-sec-001',
                //     mappedField: 'Table-1-yearly-1-table',
                //     metadata: {
                //         label: 'Key Analysis Metrics',
                //         kpis: [
                //             {
                //                 label: 'Avg Temperature',
                //                 valueField: 'Temperature',
                //                 unit: '°C',
                //                 aggregation: 'mean',
                //                 thresholds: { warning: 30, critical: 35 },
                //             },
                //             {
                //                 label: 'Max Power',
                //                 valueField: 'PowerOutput',
                //                 unit: 'MW',
                //                 aggregation: 'max',
                //                 thresholds: { warning: 470, critical: 450 },
                //             },
                //             {
                //                 label: 'Current Vacuum',
                //                 valueField: 'Vacuum',
                //                 unit: 'kPa',
                //                 aggregation: 'last',
                //                 thresholds: { warning: 65, critical: 70 },
                //             },
                //             {
                //                 label: 'Avg Humidity',
                //                 valueField: 'Humidity',
                //                 unit: '%',
                //                 aggregation: 'mean',
                //                 thresholds: { warning: 85, critical: 90 },
                //             },
                //         ],
                //     },
                // },
            ],
        },
        {
            templateId: 'tmp-syd-2',
            status: 'inactive',
            plots: []
        }
    ]
}
