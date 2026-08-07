// dashboard/dynamic-component-registry.ts
import { Type } from '@angular/core';

// Plot components
import { SingleLinePlot } from './single-line-plot/single-line-plot';
import { MultiLineTsPlot } from './multi-line-ts-plot/multi-line-ts-plot';
import { MultiLineIndexPlot } from './multi-line-index-plot/multi-line-index-plot';
import { ScatterPlot } from './scatter-plot/scatter-plot';
import { ScatterMultiPlot } from './scatter-multi-plot/scatter-multi-plot';
import { GaugePlot } from './gauge-plot/gauge-plot';
import { DonutPlot } from './donut-plot/donut-plot';
import { BarSinglePlot } from './bar-single-plot/bar-single-plot';
import { BarGroupedPlot } from './bar-grouped-plot/bar-grouped-plot';
import { ParallelCoordsPlot } from './parallel-coords-plot/parallel-coords-plot';
import { HeatmapPlot } from './heatmap-plot/heatmap-plot';
import { HeatmapCorrelationPlot } from './heatmap-correlation-plot/heatmap-correlation-plot';
import { StatCardPlot } from './stat-card-plot/stat-card-plot';
import { MultiKpiPlot } from './multi-kpi-plot/multi-kpi-plot';
import { RadarPlot } from './radar-plot/radar-plot';
import { PiePlot } from './pie-plot/pie-plot';

// Grid (sub-template) components
import { SystemGrid01 } from '../component-placeholder/system-grid01/system-grid01';
import { SystemGridFull } from '../component-placeholder/system-grid-full/system-grid-full';
import { SystemGridTable } from '../component-placeholder/system-grid-table/system-grid-table';
import { AnalysisGrid01 } from '../component-placeholder/analysis-grid01/analysis-grid01';

// Fallback plot component
import { DefaultPlotTemplate } from './default-template/default-template';

// Top-level design-templates (sections only)
import { DefaultTemplate } from '../designed-template-list-components/default-template/default-template';
import { TmpSyd1 } from '../designed-template-list-components/tmp-syd-1/tmp-syd-1';
import { TmpSyd2 } from '../designed-template-list-components/tmp-syd-2/tmp-syd-2';
import { TmpMod1 } from '../designed-template-list-components/tmp-mod-1/tmp-mod-1';
import { TmpAnalysis1 } from '../designed-template-list-components/tmp-analysis-1/tmp-analysis-1';



//  PLOT REGISTRY  chartType string → Component class
export const PLOT_COMPONENTS: Record<string, Type<any>> = {
  'single-line': SingleLinePlot,
  'multi-line-ts': MultiLineTsPlot,
  'multi-line-index': MultiLineIndexPlot,
  scatter: ScatterPlot,
  'scatter-multi': ScatterMultiPlot,
  gauge: GaugePlot,
  donut: DonutPlot,
  'bar-single': BarSinglePlot,
  'bar-grouped': BarGroupedPlot,
  'parallel-coords': ParallelCoordsPlot,
  heatmap: HeatmapPlot,
  'heatmap-correlation': HeatmapCorrelationPlot,
  'stat-card': StatCardPlot,
  'multi-kpi': MultiKpiPlot,
  radar: RadarPlot,
  pie: PiePlot,
};

//  GRID REGISTRY  parentPlaceholderTemplate string
export const GRID_TEMPLATES: Record<string, Type<any>> = {
  'system-grid-01': SystemGrid01, // 2-column monitoring grid
  'system-grid-02': SystemGrid01, // 2-column monitoring grid (alt section)
  'system-grid-full': SystemGridFull, // full-width single column grid
  'system-grid-table': SystemGridTable, // full-width table
  'analysis-grid-01': AnalysisGrid01, // analysis result grid
};

//  DASHBOARD TEMPLATE REGISTRY  uiTemplateId string -> Component class

export const DASHBOARD_TEMPLATES: Record<string, Type<any>> = {
  'tmp-syd-1': TmpSyd1,
  'tmp-syd-2': TmpSyd2,
  'tmp-mod-1': TmpMod1,
  'tmp-analysis-1': TmpAnalysis1,
  default_template: DefaultTemplate,
};

/** Resolve a dashboard template by uiTemplateId, falling back to default */
export function resolveDashboardTemplate(uiTemplateId: string): Type<any> {
  return DASHBOARD_TEMPLATES[uiTemplateId] ?? DefaultTemplate;
}

/** Resolve a plot component, falling back to the default "no renderer" plot */
export function resolvePlotComponent(chartType: string): Type<any> {
  return PLOT_COMPONENTS[chartType] ?? DefaultPlotTemplate;
}

/** Resolve a grid component, returning the default 2-col grid if not found */
export function resolveGridComponent(gridId: string): Type<any> {
  return GRID_TEMPLATES[gridId] ?? SystemGrid01;
}
