const mockSystemOutputBySystemIdResponse = {
     system: {
       id: 'SYS-550e8400-e29b-41d4-a716-446655440001',
       name: 'Boiler-A1',
       configuration: {
         templateId: 'template-cement-plant-v1',
         templateSections: ['system-grid-01', 'system-grid-02', 'system-grid-full'],
       },
       plots: [
         // 1. Single Line Plot
         {
           plotId: 'single-line-001',
           title: 'Energy Output Trend',
           chartType: 'single-line',
           parentPlaceholderTemplate: 'system-grid-02',
           mappedField: 'Table-2-yearly2-table',
           metadata: {
             label: 'Energy Output Over Time',
             xAxis: 'ts',
             yAxis: 'PE',
             unit: 'MW',
             yMin: 400,
             yMax: 500,
             thresholds: {
               warning: 440,
               critical: 430,
             },
           },
         },

         // 2. Multi-Line Time Series
         {
           plotId: 'multi-line-ts-001',
           title: 'Temperature & Pressure Trends',
           chartType: 'multi-line-ts',
           parentPlaceholderTemplate: 'system-grid-02',
           mappedField: 'Table-2-yearly2-table',
           metadata: {
             label: 'Environmental Parameters Over Time',
             xAxis: 'ts',
             series: ['AT', 'AP', 'RH'],
             unit: 'Mixed',
             yMin: 0,
             yMax: null,
           },
         },


         // 3. Multi-Line Index (already exists, keeping as is)
         {
           plotId: 'multi-line-idx-001',
           title: 'Environmental Factors Trend',
           chartType: 'multi-line-index',
           parentPlaceholderTemplate: 'system-grid-01',
           mappedField: 'Table-1-yearly-1-table',
           metadata: {
             label: 'AT, AP, and RH Stability',
             xAxis: 'index',
             series: ['AT', 'AP', 'RH'],
             unit: 'Mixed',
             normalize: true,
           },
         },


         // 4. Single Scatter
         {
           plotId: 'scatter-001',
           title: 'Temperature vs Energy Output',
           chartType: 'scatter',
           parentPlaceholderTemplate: 'system-grid-02',
           mappedField: 'Table-1-yearly-1-table',
           metadata: {
             label: 'Ambient Temperature Impact on Power Generation',
             xAxis: 'AT',
             yAxis: 'PE',
             xAxisLabel: 'Ambient Temperature (°C)',
             yAxisLabel: 'Power Output (MW)',
             colorBy: null,
             colorByLabel: null,
           },
         },


         // 5. Scatter Multi (already exists, keeping as is)
         {
           plotId: 'scatter-multi-001',
           title: 'Temperature Impact Analysis',
           chartType: 'scatter-multi',
           parentPlaceholderTemplate: 'system-grid-01',
           mappedField: 'Table-2-yearly2-table',
           metadata: {
             label: 'Ambient Temp vs Vacuum & Output',
             xAxis: 'AT',
             xAxisLabel: 'Ambient Temperature (°C)',
             series: ['V', 'PE'],
           },
         },


         // 6. Gauge
         {
           plotId: 'gauge-001',
           title: 'Current Power Output',
           chartType: 'gauge',
           parentPlaceholderTemplate: 'system-grid-02',
           mappedField: 'Table-1-yearly-1-table',
           metadata: {
             label: 'Real-time Power Generation',
             valueField: 'PE',
             unit: 'MW',
             min: 400,
             max: 500,
             thresholds: {
               warning: 440,
               critical: 430,
             },
           },
         },


         // 7. Donut
         {
           plotId: 'donut-001',
           title: 'Resource Allocation',
           chartType: 'donut',
           parentPlaceholderTemplate: 'system-grid-02',
           mappedField: 'Table-1-yearly-1-table',
           metadata: {
             label: 'Operating Parameter Distribution',
             labelField: 'index',
             valueField: 'PE',
           },
         },


         // 8. Bar Single
         {
           plotId: 'bar-single-001',
           title: 'Energy Output by Period',
           chartType: 'bar-single',
           parentPlaceholderTemplate: 'system-grid-01',
           mappedField: 'Table-1-yearly-1-table',
           metadata: {
             label: 'Power Generation Overview',
             xAxis: 'index',
             yAxis: 'PE',
             unit: 'MW',
             orientation: 'vertical',
             thresholds: {
               warning: 440,
               critical: 430,
             },
           },
         },


         // 9. Bar Grouped
         {
           plotId: 'bar-grouped-001',
           title: 'Parameter Comparison',
           chartType: 'bar-grouped',
           parentPlaceholderTemplate: 'system-grid-02',
           mappedField: 'Table-1-yearly-1-table',
           metadata: {
             label: 'Key Performance Indicators',
             categoryField: 'index',
             series: ['AT', 'V', 'PE', 'AP', 'RH'],
             orientation: 'vertical',
             rowIndex: 0,
           },
         },


         // 10. Parallel Coords (already exists, keeping as is)
         {
           plotId: 'parallel-001',
           title: 'Plant Operating Profile',
           chartType: 'parallel-coords',
           parentPlaceholderTemplate: 'system-grid-01',
           mappedField: 'Table-1-yearly-1-table',
           metadata: {
             label: 'Multi-Variable Power Profile',
             axes: ['AT', 'V', 'AP', 'RH', 'PE'],
             colorBy: 'PE',
             colorByLabel: 'Energy Output (MW)',
           },
         },


         // 11. Heatmap
         {
           plotId: 'heatmap-001',
           title: 'Parameter Density Matrix',
           chartType: 'heatmap',
           parentPlaceholderTemplate: 'system-grid-02',
           mappedField: 'Table-1-yearly-1-table',
           metadata: {
             label: 'Environmental Data Density',
             fields: ['AT', 'V', 'AP', 'RH', 'PE'],
             xAxis: 'index',
             mode: 'value',
             normalize: true,
             colorRange: [0, 1],
           },
         },


         // 12. Heatmap Correlation
         {
           plotId: 'heatmap-corr-001',
           title: 'Parameter Correlations',
           chartType: 'heatmap-correlation',
           parentPlaceholderTemplate: 'system-grid-02',
           mappedField: 'Table-1-yearly-1-table',
           metadata: {
             label: 'Correlation Matrix',
             fields: ['AT', 'V', 'AP', 'RH', 'PE'],
             mode: 'correlation',
             normalize: false,
             colorRange: [-1, 1],
           },
         },


         // 13. Single KPI (Stat Card)
         {
           plotId: 'kpi-single-001',
           title: 'Current Efficiency',
           chartType: 'stat-card',
           parentPlaceholderTemplate: 'system-grid-01',
           mappedField: 'Table-1-yearly-1-table',
           metadata: {
             label: 'Power Output',
             valueField: 'PE',
             aggregation: 'last',
             unit: 'MW',
             trendField: 'PE',
             thresholds: {
               warning: 440,
               critical: 430,
             },
           },
         },


         // 14. Multiple KPI
         {
           plotId: 'kpi-multi-001',
           title: 'System Performance Dashboard',
           chartType: 'multi-kpi',
           parentPlaceholderTemplate: 'system-grid-full',
           mappedField: 'Table-1-yearly-1-table',
           metadata: {
             label: 'Key Analysis Metrics',
             kpis: [
               {
                 label: 'Avg Temperature',
                 valueField: 'AT',
                 unit: '°C',
                 aggregation: 'mean',
                 thresholds: { warning: 30, critical: 35 },
               },
               {
                 label: 'Max Power',
                 valueField: 'PE',
                 unit: 'MW',
                 aggregation: 'max',
                 thresholds: { warning: 470, critical: 450 },
               },
               {
                 label: 'Current Vacuum',
                 valueField: 'V',
                 unit: 'kPa',
                 aggregation: 'last',
                 thresholds: { warning: 65, critical: 70 },
               },
               {
                 label: 'Avg Humidity',
                 valueField: 'RH',
                 unit: '%',
                 aggregation: 'mean',
                 thresholds: { warning: 85, critical: 90 },
               },
             ],
           },
         },


         // 15. Radar
         {
           plotId: 'radar-001',
           title: 'Performance Radar Chart',
           chartType: 'radar',
           parentPlaceholderTemplate: 'system-grid-01',
           mappedField: 'Table-1-yearly-1-table',
           metadata: {
             label: 'System Performance Metrics',
             axes: [
               { field: 'AT', label: 'Temperature', min: 0, max: 40 },
               { field: 'V', label: 'Vacuum', min: 30, max: 80 },
               { field: 'AP', label: 'Pressure', min: 1000, max: 1030 },
               { field: 'RH', label: 'Humidity', min: 0, max: 100 },
               { field: 'PE', label: 'Power', min: 400, max: 500 },
             ],
             series: [
               { label: 'Current Performance', rowIndex: 0 },
               { label: 'Target', rowIndex: 5 },
             ],
           },
         },


         // 16. Pie
         {
           plotId: 'pie-001',
           title: 'Energy Distribution',
           chartType: 'pie',
           parentPlaceholderTemplate: 'system-grid-01',
           mappedField: 'Table-1-yearly-1-table',
           metadata: {
             label: 'Power Output Distribution',
             labelField: 'index',
             valueField: 'PE',
             showPercentage: true,
             showLegend: true,
           },
         },
       ],
       liveData: {
         tables: [
           {
             name: 'Table-1-yearly-1-table',
             value: [
               { AT: 23.64, V: 58.49, AP: 1011.4, RH: 74.2, PE: 445.75 },
               { AT: 29.74, V: 56.9, AP: 1007.15, RH: 41.91, PE: 438.76 },
               { AT: 19.07, V: 49.69, AP: 1007.22, RH: 76.79, PE: 453.09 },
               { AT: 11.8, V: 40.66, AP: 1017.13, RH: 97.2, PE: 464.43 },
               { AT: 13.97, V: 39.16, AP: 1016.05, RH: 84.6, PE: 470.96 },
               { AT: 22.1, V: 71.29, AP: 1008.2, RH: 75.38, PE: 442.35 },
               { AT: 14.47, V: 41.76, AP: 1021.98, RH: 78.41, PE: 464.0 },
               { AT: 31.25, V: 69.51, AP: 1010.25, RH: 36.83, PE: 428.77 },
               { AT: 6.77, V: 38.18, AP: 1017.8, RH: 81.13, PE: 484.31 },
               { AT: 28.28, V: 68.67, AP: 1006.36, RH: 69.9, PE: 435.29 },
               { AT: 22.99, V: 46.93, AP: 1014.15, RH: 49.42, PE: 451.41 },
               { AT: 29.3, V: 70.04, AP: 1010.95, RH: 61.23, PE: 426.25 },
               { AT: 8.14, V: 37.49, AP: 1009.04, RH: 80.33, PE: 480.66 },
               { AT: 16.92, V: 44.6, AP: 1017.34, RH: 58.75, PE: 460.17 },
               { AT: 22.72, V: 64.15, AP: 1021.14, RH: 60.34, PE: 453.13 },
               { AT: 18.14, V: 43.56, AP: 1012.83, RH: 47.1, PE: 461.71 },
               { AT: 11.49, V: 44.63, AP: 1020.44, RH: 86.04, PE: 471.08 },
             ],
           },
           {
             name: 'Table-2-yearly2-table',
             value: [
               {ts: '2024-02-01T00:00:01Z',AT: 23.64,V: 58.49,AP: 1011.4,RH: 74.2,PE: 445.75,},
               {ts: '2024-02-02T00:00:02Z',AT: 29.74,V: 56.9,AP: 1007.15,RH: 41.91,PE: 438.76,},
               {ts: '2024-02-03T00:00:00Z',AT: 19.07,V: 49.69,AP: 1007.22,RH: 76.79,PE: 453.09,},
               {ts: '2024-02-04T00:00:00Z',AT: 11.8,V: 40.66,AP: 1017.13,RH: 97.2,PE: 464.43,},
               {ts: '2024-02-05T00:00:00Z',AT: 13.97,V: 39.16,AP: 1016.05,RH: 84.6,PE: 470.96,},
               {ts: '2024-02-06T00:00:00Z',AT: 22.1,V: 71.29,AP: 1008.2,RH: 75.38,PE: 442.35,},
               {ts: '2024-02-07T00:00:00Z',AT: 14.47,V: 41.76,AP: 1021.98,RH: 78.41,PE: 464.0,},
               {ts: '2024-02-08T00:00:00Z',AT: 31.25,V: 69.51,AP: 1010.25,RH: 36.83,PE: 428.77,},
               {ts: '2024-02-09T00:00:00Z',AT: 6.77,V: 38.18,AP: 1017.8,RH: 81.13,PE: 484.31,},
             ],
           },
         ],
       },
     },
   };
