import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface TemplateSummary {
  templateId: string;
  templateCategory: string;
  name: string;
  description: string;
  type: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PlotComponentConfig {
  plotId: string;
  plotComponentId: string;
  title?: string;
  category: string;
  chartType: string;
  parentPlaceholderTemplate: string;
  belongSection: string;
  mappedField: string;
  metadata: any;
}

export interface TemplateCategoryGroup {
  category: string;
  components: PlotComponentConfig[];
}

export interface TemplateSection {
  sectionId: string;
  title: string;
  description?: string;
  parentPlaceholderTemplate: string;
  categories: TemplateCategoryGroup[];
}

export interface TemplateConfig extends TemplateSummary {
  sections: TemplateSection[];
}

export interface TemplateFeedData {
  tables: { name: string; value: any[] }[];
}


export interface EntityFeedData {
  entityId: string;
  tables: { name: string; value: any[] }[];
}

export interface EntitySummary {
  entityId: string;
  name: string;
  templateId: string;
  templateCategory: string;
  templateName: string;
  description: string;
}


const SYS_SNAPSHOT_TABLE = 'sys-power-plant-snapshot-table';
const SYS_TIMESERIES_TABLE = 'sys-power-plant-timeseries-table';

const MOD_SNAPSHOT_TABLE = 'mod-energy-monitoring-snapshot-table';
const MOD_TIMESERIES_TABLE = 'mod-energy-monitoring-timeseries-table';

const ANL_SNAPSHOT_TABLE = 'anl-signal-processing-snapshot-table';


interface TemplateSectionDefinition {
  sectionId: string;
  title: string;
  description?: string;
  parentPlaceholderTemplate: string;
  validation: {
    allowCharts?: boolean;
    allowTables?: boolean;
    allowPlotComponentId: string[];
  }[];
}

interface TemplateDefinition extends TemplateSummary {
  sectionList: TemplateSectionDefinition[];
}

export const AVAILABLE_TEMPLATES: TemplateDefinition[] = [
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


interface EntityTemplateInstance {
  templateId: string;
  status: 'active' | 'inactive';
  plots: PlotComponentConfig[];
}

export interface EntityRecord {
  entityId: string;
  name: string;
  templates: EntityTemplateInstance[];
}

// single client all configure plots for sytems/models/analys
export const ENTITY_RECORDS: EntityRecord[] = [
  {
    entityId: 'SYS-550e8400-e29b-41d4-a716-446655440001',
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
            category: 'category-1',
            chartType: 'single-line',
            parentPlaceholderTemplate: 'system-grid-02',
            belongSection: 'tmp-syd-sec-002',
            mappedField: SYS_TIMESERIES_TABLE,
            metadata: {
              label: 'Energy Output Over Time',
              xAxis: 'ts',
              yAxis: 'PowerOutput',
              xAxisLabel: 'Time',
              yAxisLabel: 'Power',
              series: [
                "Efficiency",
                "PredictedFailure",
                "AnomalyScore"
              ],
              unit: 'MW',
              yMin: 400,
              yMax: 500,
              normalize: false,
              thresholds: { warning: 440, critical: 430 },
            },
          },
          {
            plotId: "single-line-001-instance-369",
            plotComponentId: "single-line-001",
            title: "Power Output Trend",
            category: "category-1",
            chartType: "single-line",
            parentPlaceholderTemplate: "system-grid-02",
            belongSection: "tmp-syd-sec-002",
            mappedField: SYS_TIMESERIES_TABLE,
            metadata: {
              label: "Energy output trend detection",
              xAxis: "ts",
              yAxis: "PowerOutput",
              xAxisLabel: "time",
              yAxisLabel: "power",
              series: [
                "Efficiency",
                "PredictedFailure",
                "AnomalyScore"
              ],
              unit: "kPa",
              normalize: false,
              yMin: 400,
              yMax: 500,
              thresholds: {
                "warning": 440,
                "critical": 430
              }
            }
          },
          {
            plotId: 'multi-line-ts-001-instance-001',
            plotComponentId: 'multi-line-ts-001',
            title: 'Efficiency & Risk Trends',
            category: 'category-1',
            chartType: 'multi-line-ts',
            parentPlaceholderTemplate: 'system-grid-02',
            belongSection: 'tmp-syd-sec-002',
            mappedField: SYS_TIMESERIES_TABLE,
            metadata: {
              label: 'Efficiency, Predicted Failure & Anomaly Score Over Time',
              xAxis: 'ts',
              series: ['Efficiency', 'PredictedFailure', 'AnomalyScore'],
              unit: 'Mixed',
              yMin: 0,
              yMax: 1,
              thresholds: { warning: 0.6, critical: 0.8 },
            },
          },
          {
            plotId: 'multi-line-idx-001-instance-001',
            plotComponentId: 'multi-line-idx-001',
            title: 'Environmental Factors Trend',
            category: 'category-2',
            chartType: 'multi-line-index',
            parentPlaceholderTemplate: 'system-grid-02',
            belongSection: 'tmp-syd-sec-002',
            mappedField: SYS_SNAPSHOT_TABLE,
            metadata: {
              label: 'Temperature, Ambient Pressure and Humidity Stability',
              xAxis: 'index',
              series: ['Temperature', 'AmbientPressure', 'Humidity'],
              unit: 'Mixed',
              normalize: true,
            },
          },
          {
            plotId: 'scatter-001-instance-001',
            plotComponentId: 'scatter-001',
            title: 'Temperature vs Energy Output',
            category: 'category-2',
            chartType: 'scatter',
            parentPlaceholderTemplate: 'system-grid-02',
            belongSection: 'tmp-syd-sec-002',
            mappedField: SYS_SNAPSHOT_TABLE,
            metadata: {
              label: 'Ambient Temperature Impact on Power Generation',
              xAxis: 'Temperature',
              yAxis: 'PowerOutput',
              xAxisLabel: 'Ambient Temperature (\u00b0C)',
              yAxisLabel: 'Power Output (MW)',
              colorBy: null,
              colorByLabel: null,
            },
          },
          {
            plotId: 'gauge-001-instance-001',
            plotComponentId: 'gauge-001',
            title: 'Current Power Output',
            category: 'category-2',
            chartType: 'gauge',
            parentPlaceholderTemplate: 'system-grid-02',
            belongSection: 'tmp-syd-sec-002',
            mappedField: SYS_SNAPSHOT_TABLE,
            metadata: {
              label: 'Real-time Power Generation',
              valueField: 'PowerOutput',
              unit: 'MW',
              min: 400,
              max: 500,
              thresholds: { warning: 440, critical: 430 },
            },
          },
          {
            plotId: 'donut-001-instance-001',
            plotComponentId: 'donut-001',
            title: 'Resource Allocation',
            category: 'category-2',
            chartType: 'donut',
            parentPlaceholderTemplate: 'system-grid-02',
            belongSection: 'tmp-syd-sec-002',
            mappedField: SYS_SNAPSHOT_TABLE,
            metadata: {
              label: 'Operating Parameter Distribution',
              labelField: 'index',
              valueField: 'Efficiency',
              showPercentage: true,
              showLegend: true,
            },
          },
          {
            plotId: 'pie-001-instance-001',
            plotComponentId: 'pie-001',
            title: 'Energy Distribution',
            category: 'category-1',
            chartType: 'pie',
            parentPlaceholderTemplate: 'system-grid-01',
            belongSection: 'tmp-syd-sec-002',
            mappedField: SYS_SNAPSHOT_TABLE,
            metadata: {
              label: 'Power Output Distribution',
              labelField: 'index',
              valueField: 'PowerOutput',
              showPercentage: true,
              showLegend: true,
            },
          },
          {
            plotId: 'bar-single-001-instance-001',
            plotComponentId: 'bar-single-001',
            title: 'Energy Output by Period',
            category: 'category-1',
            chartType: 'bar-single',
            parentPlaceholderTemplate: 'system-grid-02',
            belongSection: 'tmp-syd-sec-002',
            mappedField: SYS_SNAPSHOT_TABLE,
            metadata: {
              label: 'Power Generation Overview',
              xAxis: 'index',
              yAxis: 'PowerOutput',
              unit: 'MW',
              thresholds: { warning: 440, critical: 430 },
            },
          },
          {
            plotId: 'heatmap-001-instance-001',
            plotComponentId: 'heatmap-001',
            title: 'Parameter Density Matrix',
            category: 'category-1',
            chartType: 'heatmap',
            parentPlaceholderTemplate: 'system-grid-02',
            belongSection: 'tmp-syd-sec-002',
            mappedField: SYS_SNAPSHOT_TABLE,
            metadata: {
              label: 'Model Risk Signal Density',
              fields: ['Efficiency', 'PredictedFailure', 'AnomalyScore'],
              xAxis: 'index',
              mode: 'value',
              normalize: true,
              colorRange: [0, 1],
            },
          },
          {
            plotId: 'bar-grouped-001-instance-001',
            plotComponentId: 'bar-grouped-001',
            title: 'Parameter Comparison',
            category: 'category-1',
            chartType: 'bar-grouped',
            parentPlaceholderTemplate: 'system-grid-02',
            belongSection: 'tmp-syd-sec-002',
            mappedField: SYS_SNAPSHOT_TABLE,
            metadata: {
              label: 'Key Performance Indicators',
              categoryField: 'index',
              series: ['Efficiency', 'PredictedFailure', 'AnomalyScore'],
              orientation: 'vertical',
              rowIndex: 0,
            },
          },
          {
            plotId: 'parallel-001-instance-001',
            plotComponentId: 'parallel-001',
            title: 'Plant Operating Profile',
            category: 'category-1',
            chartType: 'parallel-coords',
            parentPlaceholderTemplate: 'system-grid-01',
            belongSection: 'tmp-syd-sec-002',
            mappedField: SYS_SNAPSHOT_TABLE,
            metadata: {
              label: 'Multi-Variable Power Profile',
              axes: [
                'Temperature',
                'AmbientPressure',
                'Humidity',
                'PowerOutput',
              ],
              colorBy: 'PowerOutput',
              colorByLabel: 'Energy Output (MW)',
            },
          },
          {
            plotId: 'kpi-single-001-instance-001',
            plotComponentId: 'kpi-single-001',
            title: 'Current Efficiency',
            category: 'category-1',
            chartType: 'stat-card',
            parentPlaceholderTemplate: 'system-grid-01',
            belongSection: 'tmp-syd-sec-001',
            mappedField: SYS_SNAPSHOT_TABLE,
            metadata: {
              label: 'Power Output',
              valueField: 'PowerOutput',
              aggregation: 'last',
              unit: 'MW',
              trendField: 'Efficiency',
              thresholds: { warning: 440, critical: 430 },
            },
          },
          {
            plotId: 'kpi-multi-001-instance-001',
            plotComponentId: 'kpi-multi-001',
            title: 'System Performance Dashboard',
            category: 'category-2',
            chartType: 'multi-kpi',
            parentPlaceholderTemplate: 'system-grid-01',
            belongSection: 'tmp-syd-sec-001',
            mappedField: SYS_SNAPSHOT_TABLE,
            metadata: {
              label: 'Key Analysis Metrics',
              kpis: [
                {
                  label: 'Avg Temperature',
                  valueField: 'Temperature',
                  unit: '\u00b0C',
                  aggregation: 'mean',
                  thresholds: { warning: 30, critical: 35 },
                },
                {
                  label: 'Max Power',
                  valueField: 'PowerOutput',
                  unit: 'MW',
                  aggregation: 'max',
                  thresholds: { warning: 470, critical: 450 },
                },
                {
                  label: 'Avg Humidity',
                  valueField: 'Humidity',
                  unit: '%',
                  aggregation: 'mean',
                  thresholds: { warning: 85, critical: 90 },
                },
              ],
            },
          },
        ],
      },
      {
        templateId: 'tmp-syd-2',
        status: 'inactive',
        plots: [
          {
            plotId: 'single-line-001-instance-t2-001',
            plotComponentId: 'single-line-001',
            title: 'Energy Output Trend',
            category: 'category-1',
            chartType: 'single-line',
            parentPlaceholderTemplate: 'system-grid-01',
            belongSection: 'tmp-syd-sec-t2-002',
            mappedField: SYS_TIMESERIES_TABLE,
            metadata: {
              label: 'Energy Output Over Time',
              xAxis: 'ts',
              yAxis: 'PowerOutput',
              xAxisLabel: 'Time',
              yAxisLabel: 'Power',
              unit: 'MW',
              yMin: 400,
              yMax: 500,
              normalize: false,
              thresholds: { warning: 440, critical: 430 },
            },
          },
        ],
      },
    ],
  },
  {
    entityId: 'MOD-550e8400-e29b-41d4-a716-446655440002',
    name: 'Energy Monitoring Model',
    templates: [
      {
        templateId: 'tmp-mod-1',
        status: 'active',
        plots: [

        ],
      },
    ],
  },
  {
    entityId: 'ANL-550e8400-e29b-41d4-a716-446655440003',
    name: 'Signal Processing Analysis',
    templates: [
      {
        templateId: 'tmp-analysis-1',
        status: 'active',
        plots: [

        ],
      },
    ],
  },
];


const ENTITY_FEED_DATA: EntityFeedData[] = [
  {
    entityId: 'SYS-550e8400-e29b-41d4-a716-446655440001',
    tables: [
      {
        // snapshot rows, one per reading — matches Temperature/Vacuum/Humidity/
        // PowerOutput/Efficiency/PredictedFailure/AnomalyScore field names
        name: SYS_SNAPSHOT_TABLE,
        value: [
          {
            index: 0,
            Temperature: 23.6,
            AmbientPressure: 1011.4,
            Humidity: 74.2,
            PowerOutput: 445.75,
            Efficiency: 0.91,
            PredictedFailure: 0.04,
            AnomalyScore: 0.02,
          },
          {
            index: 1,
            Temperature: 29.7,
            AmbientPressure: 1007.2,
            Humidity: 41.9,
            PowerOutput: 438.76,
            Efficiency: 0.88,
            PredictedFailure: 0.07,
            AnomalyScore: 0.05,
          },
          {
            index: 2,
            Temperature: 19.1,
            AmbientPressure: 1007.2,
            Humidity: 76.8,
            PowerOutput: 453.09,
            Efficiency: 0.93,
            PredictedFailure: 0.02,
            AnomalyScore: 0.01,
          },
          {
            index: 3,
            Temperature: 11.8,
            AmbientPressure: 1017.1,
            Humidity: 97.2,
            PowerOutput: 464.43,
            Efficiency: 0.95,
            PredictedFailure: 0.01,
            AnomalyScore: 0.01,
          },
          {
            index: 4,
            Temperature: 14.0,
            AmbientPressure: 1016.1,
            Humidity: 84.6,
            PowerOutput: 470.96,
            Efficiency: 0.96,
            PredictedFailure: 0.01,
            AnomalyScore: 0.0,
          },
          {
            index: 5,
            Temperature: 22.1,
            AmbientPressure: 1008.2,
            Humidity: 75.4,
            PowerOutput: 442.35,
            Efficiency: 0.9,
            PredictedFailure: 0.05,
            AnomalyScore: 0.03,
          },
        ],
      },
      {
        // time-series rows for trend plots
        name: SYS_TIMESERIES_TABLE,
        value: [
          {
            ts: '2024-02-01T00:00:00Z',
            PowerOutput: 445.75,
            Efficiency: 0.91,
            PredictedFailure: 0.04,
            AnomalyScore: 0.02,
          },
          {
            ts: '2024-02-01T04:00:00Z',
            PowerOutput: 441.1,
            Efficiency: 0.9,
            PredictedFailure: 0.05,
            AnomalyScore: 0.03,
          },
          {
            ts: '2024-02-01T08:00:00Z',
            PowerOutput: 452.3,
            Efficiency: 0.93,
            PredictedFailure: 0.03,
            AnomalyScore: 0.01,
          },
          {
            ts: '2024-02-01T12:00:00Z',
            PowerOutput: 460.85,
            Efficiency: 0.94,
            PredictedFailure: 0.02,
            AnomalyScore: 0.01,
          },
          {
            ts: '2024-02-01T16:00:00Z',
            PowerOutput: 458.2,
            Efficiency: 0.94,
            PredictedFailure: 0.02,
            AnomalyScore: 0.01,
          },
          {
            ts: '2024-02-01T20:00:00Z',
            PowerOutput: 449.6,
            Efficiency: 0.92,
            PredictedFailure: 0.03,
            AnomalyScore: 0.02,
          },
        ],
      },
    ],
  },
  {
    entityId: 'MOD-550e8400-e29b-41d4-a716-446655440002',
    tables: [
      {
        name: MOD_SNAPSHOT_TABLE,
        value: [
          { index: 0, AT: 23.64, V: 58.49, AP: 1011.4, RH: 74.2, PE: 445.75 },
          { index: 1, AT: 29.74, V: 56.9, AP: 1007.15, RH: 41.91, PE: 438.76 },
          { index: 2, AT: 19.07, V: 49.69, AP: 1007.22, RH: 76.79, PE: 453.09 },
          { index: 3, AT: 11.8, V: 40.66, AP: 1017.13, RH: 97.2, PE: 464.43 },
          { index: 4, AT: 13.97, V: 39.16, AP: 1016.05, RH: 84.6, PE: 470.96 },
          { index: 5, AT: 22.1, V: 71.29, AP: 1008.2, RH: 75.38, PE: 442.35 },
        ],
      },
      {
        name: MOD_TIMESERIES_TABLE,
        value: [
          {
            ts: '2024-02-01T00:00:01Z',
            AT: 23.64,
            V: 58.49,
            AP: 1011.4,
            RH: 74.2,
            PE: 445.75,
          },
          {
            ts: '2024-02-02T00:00:02Z',
            AT: 29.74,
            V: 56.9,
            AP: 1007.15,
            RH: 41.91,
            PE: 438.76,
          },
          {
            ts: '2024-02-03T00:00:00Z',
            AT: 19.07,
            V: 49.69,
            AP: 1007.22,
            RH: 76.79,
            PE: 453.09,
          },
          {
            ts: '2024-02-04T00:00:00Z',
            AT: 11.8,
            V: 40.66,
            AP: 1017.13,
            RH: 97.2,
            PE: 464.43,
          },
        ],
      },
    ],
  },
  {
    entityId: 'ANL-550e8400-e29b-41d4-a716-446655440003',
    tables: [
      {
        // raw sensor rows evaluated by the signal-processing analysis
        name: ANL_SNAPSHOT_TABLE,
        value: [
          { index: 0, AT: 21.9, V: 61.2, AP: 1009.8, RH: 68.4, PE: 449.2 },
          { index: 1, AT: 27.3, V: 55.4, AP: 1006.1, RH: 45.7, PE: 440.9 },
          { index: 2, AT: 18.4, V: 47.8, AP: 1008.9, RH: 79.1, PE: 456.4 },
          { index: 3, AT: 12.6, V: 41.9, AP: 1015.6, RH: 92.3, PE: 462.7 },
          { index: 4, AT: 15.2, V: 44.1, AP: 1013.2, RH: 81.9, PE: 458.5 },
        ],
      },
    ],
  },
];

// ── Service ──────────────────────────────────────────────────────────────
@Injectable({
  providedIn: 'root',
})
export class TemplateService {
  private findTemplateDef(templateId: string): TemplateDefinition | undefined {
    return AVAILABLE_TEMPLATES.find((t) => t.templateId === templateId);
  }

  private findEntity(entityId: string): EntityRecord | undefined {
    return ENTITY_RECORDS.find((e) => e.entityId === entityId);
  }


  private resolveEntityTemplate(
    entity: EntityRecord,
    templateId?: string,
  ): EntityTemplateInstance | undefined {
    if (templateId) {
      return entity.templates.find((t) => t.templateId === templateId);
    }
    return (
      entity.templates.find((t) => t.status === 'active') ?? entity.templates[0]
    );
  }

  private findEntityFeed(entityId: string): TemplateFeedData {
    const feed = ENTITY_FEED_DATA.find((f) => f.entityId === entityId);
    return { tables: feed?.tables ?? [] };
  }

  private toSummary(def: TemplateDefinition): TemplateSummary {
    const { sectionList, ...summary } = def;
    return summary;
  }

  private buildSections(
    def: TemplateDefinition,
    plots: PlotComponentConfig[] = [],
  ): TemplateSection[] {
    return def.sectionList.map((sectionDef) => {
      const sectionPlots = plots.filter(
        (p) => p.belongSection === sectionDef.sectionId,
      );

      const categoryOrder: string[] = [];
      const byCategory = new Map<string, PlotComponentConfig[]>();
      for (const plot of sectionPlots) {
        if (!byCategory.has(plot.category)) {
          categoryOrder.push(plot.category);
          byCategory.set(plot.category, []);
        }
        byCategory.get(plot.category)!.push(plot);
      }

      const categories: TemplateCategoryGroup[] = categoryOrder.map(
        (category) => ({
          category,
          components: byCategory.get(category)!,
        }),
      );

      return {
        sectionId: sectionDef.sectionId,
        title: sectionDef.title,
        description: sectionDef.description,
        parentPlaceholderTemplate: sectionDef.parentPlaceholderTemplate,
        categories,
      };
    });
  }

  getTemplatesList(): Observable<TemplateSummary[]> {
    return of(AVAILABLE_TEMPLATES.map((t) => this.toSummary(t))).pipe(
      delay(150),
    );
  }

  getEntitiesList(): Observable<EntitySummary[]> {
    const summaries = ENTITY_RECORDS.map((entity) => {
      const activeTemplate = this.resolveEntityTemplate(entity);
      const templateId = activeTemplate?.templateId ?? 'UNKNOWN';
      const def = this.findTemplateDef(templateId);
      return {
        entityId: entity.entityId,
        name: entity.name,
        templateId,
        templateCategory: def?.templateCategory ?? 'UNKNOWN',
        templateName: def?.name ?? templateId,
        description: def?.description ?? '',
      };
    });
    return of(summaries).pipe(delay(150));
  }

  /** Template structure only (sections + placeholders), no plot components. */
  getTemplateOnly(templateId: string): Observable<TemplateConfig> {
    const def = this.findTemplateDef(templateId);
    if (!def) {
      return of({
        templateId,
        templateCategory: 'UNKNOWN',
        name: templateId,
        description: '',
        type: 'UNKNOWN',
        sections: [],
      }).pipe(delay(200));
    }
    return of({
      ...this.toSummary(def),
      sections: this.buildSections(def),
    }).pipe(delay(200));
  }

  /** Template sections + an entity's saved plot configuration, no live feed data. */
  getTemplateWithPlotsConfiguration(
    entityId: string,
    templateId?: string,
  ): Observable<TemplateConfig> {
    const entity = this.findEntity(entityId);
    const entityTemplate = entity
      ? this.resolveEntityTemplate(entity, templateId)
      : undefined;
    if (!entity || !entityTemplate) {
      return of({
        templateId: templateId ?? entityId,
        templateCategory: 'UNKNOWN',
        name: entityId,
        description: '',
        type: 'UNKNOWN',
        sections: [],
      }).pipe(delay(250));
    }
    const def = this.findTemplateDef(entityTemplate.templateId)!;
    return of({
      ...this.toSummary(def),
      name: entity.name,
      sections: this.buildSections(def, entityTemplate.plots),
    }).pipe(delay(250));
  }

  getTemplateWithFeedData(
    entityId: string,
    templateId?: string,
  ): Observable<{ template: TemplateConfig; feedData: TemplateFeedData }> {
    const entity = this.findEntity(entityId);
    const entityTemplate = entity
      ? this.resolveEntityTemplate(entity, templateId)
      : undefined;
    if (!entity || !entityTemplate) {
      return of({
        template: {
          templateId: templateId ?? entityId,
          templateCategory: 'UNKNOWN',
          name: entityId,
          description: '',
          type: 'UNKNOWN',
          sections: [],
        },
        feedData: this.findEntityFeed(entityId),
      }).pipe(delay(300));
    }
    const def = this.findTemplateDef(entityTemplate.templateId)!;
    return of({
      template: {
        ...this.toSummary(def),
        name: entity.name,
        sections: this.buildSections(def, entityTemplate.plots),
      },
      feedData: this.findEntityFeed(entityId),
    }).pipe(delay(300));
  }
}
