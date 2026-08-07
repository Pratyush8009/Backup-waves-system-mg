import { Component, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AVAILABLE_TEMPLATES, system } from './template';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { RouterModule, Router } from '@angular/router';
import { TemplateRenderer } from '../../template-render-components/template-renderer/template-renderer';
import { TemplateSelectionService } from '../../../services/template-selection.service';


@Component({
  selector: 'app-analysis-template',
  imports: [CommonModule, FormsModule, RouterModule, NzLayoutModule, TemplateRenderer],
  templateUrl: './analysis-template.html',
  styleUrl: './analysis-template.css',
})
export class AnalysisTemplate {
  templatesData = signal<any[]>(AVAILABLE_TEMPLATES);
  systemData = signal<any>(system);
  entityId = "SYS-550e8400-e29b-41d4-a716-446655440001";
  templateId = "tmp-syd-1";

  selectedTemplateId = signal<string>('tmp-syd-1');

  // Reactively track selection state from TemplateSelectionService
  selectedSectionId = computed(() => this.selectionService.activeSectionId());
  selectedPlotId = computed(() => this.selectionService.activePlotId());

  activePlotConfig = signal<any>(null);

  // Modal State for Adding Plot
  isAddPlotModalOpen = signal<boolean>(false);
  newPlotTitle = signal<string>('');
  newPlotCategory = signal<string>('');
  selectedComponentCatalogItem = signal<any>(null);

  constructor(private router: Router, public selectionService: TemplateSelectionService) {
    // Automatically keep activePlotConfig synced whenever activePlotId changes
    effect(() => {
      const pId = this.selectedPlotId();
      if (pId) {
        this.loadPlotConfig(pId);
      } else {
        this.activePlotConfig.set(null);
      }
    }, { allowSignalWrites: true });
  }

  system_schema = {
    id: 'SYS-550e8400-e29b-41d4-a716-446655440001',
    name: 'Sugar Power Plant',
    inputProperties: [
      { id: 1, name: 'Temperature', dataType: 'float', propertyType: 'input', unit: 'celsius' },
      { id: 2, name: 'Vacuum', dataType: 'float', propertyType: 'input', unit: 'cm Hg' },
      { id: 3, name: 'Pressure', dataType: 'float', propertyType: 'input', unit: 'millibar' },
      { id: 5, name: 'Humidity', dataType: 'float', propertyType: 'input', unit: 'percent' },
      { id: 6, name: 'Energy', dataType: 'float', propertyType: 'input', unit: 'millibar' },
    ],
    outputProperties: [
      { id: 4, name: 'PowerOutput', dataType: 'float', propertyType: 'output', unit: 'MW' },
      { id: 12, name: 'Efficiency', dataType: 'float', propertyType: 'output', unit: 'percent' },
      { id: 7, name: 'PredictedFailure', dataType: 'boolean', propertyType: 'output', unit: null },
      { id: 8, name: 'AnomalyScore', dataType: 'float', propertyType: 'output', unit: null },
      {
        id: 13,
        name: 'PowerAnalysis',
        dataType: 'json',
        propertyType: 'output',
        validation: { schema: { properties: { field1value: { type: 'number' }, field2value: { type: 'string' } } } }
      },
      {
        id: 14,
        name: 'AnalyisisOFpressure',
        dataType: 'json',
        propertyType: 'output',
        validation: { schema: { properties: { field1value: { type: 'number' }, field2value: { type: 'string' } } } }
      },
    ],
  };

  chartComponentCatalog = [
    { label: 'Status Card (KPI Single)', chartType: 'stat-card', plotComponentId: 'kpi-single-001' },
    { label: 'Multi KPI', chartType: 'multi-kpi', plotComponentId: 'kpi-multi-001' },
    { label: 'Single Line Chart', chartType: 'single-line', plotComponentId: 'single-line-001' },
    { label: 'Multi Line Time-Series', chartType: 'multi-line-ts', plotComponentId: 'multi-line-ts-001' },
    { label: 'Multi Line Index', chartType: 'multi-line-index', plotComponentId: 'multi-line-idx-001' },
    { label: 'Scatter Plot', chartType: 'scatter', plotComponentId: 'scatter-001' },
    { label: 'Scatter Multi Plot', chartType: 'scatter-multi', plotComponentId: 'scatter-multi-001' },
    { label: 'Gauge Chart', chartType: 'gauge', plotComponentId: 'gauge-001' },
    { label: 'Donut Chart', chartType: 'donut', plotComponentId: 'donut-001' },
    { label: 'Pie Chart', chartType: 'pie', plotComponentId: 'pie-001' },
    { label: 'Bar Single Chart', chartType: 'bar-single', plotComponentId: 'bar-single-001' },
    { label: 'Bar Grouped Chart', chartType: 'bar-grouped', plotComponentId: 'bar-grouped-001' },
    { label: 'Parallel Coordinates', chartType: 'parallel-coords', plotComponentId: 'parallel-001' },
    { label: 'Heatmap Density', chartType: 'heatmap', plotComponentId: 'heatmap-001' },
    { label: 'Heatmap Correlation', chartType: 'heatmap-corr', plotComponentId: 'heatmap-corr-001' },
  ];

  currentSystemTemplateObj = computed(() => {
    const sys = this.systemData();
    const templateId = this.selectedTemplateId();
    if (!sys || !sys.templates) return null;
    return sys.templates.find((t: any) => t.templateId === templateId);
  });

  currentTemplate = computed(() => {
    return this.templatesData().find((t) => t.templateId === this.selectedTemplateId());
  });

  availableSections = computed(() => {
    const tmpl = this.currentTemplate();
    if (!tmpl) return [];
    // Support both root-level sectionList and legacy metadata.sectionList
    return tmpl.sectionList || tmpl.metadata?.sectionList || [];
  });

  currentSection = computed(() => {
    const sId = this.selectedSectionId();
    if (!sId) return null;
    return this.availableSections().find((s: any) => s.sectionId === sId);
  });

  availableProperties = computed(() => {
    const list: { label: string; value: string }[] = [];

    const processProps = (props: any[]) => {
      props.forEach((p) => {
        const typeLabel = p.propertyType ? p.propertyType.toUpperCase() : '';

        if (p.dataType === 'json' && p.validation?.schema?.properties) {
          const schemaProps = p.validation.schema.properties;
          Object.keys(schemaProps).forEach((key) => {
            const subType = schemaProps[key]?.type || 'json';
            const propPath = `${p.name}.${key}`;
            list.push({ value: propPath, label: `${propPath}(${subType}) (${typeLabel})` });
          });
        } else {
          list.push({ value: p.name, label: `${p.name}(${p.dataType}) (${typeLabel})` });
        }
      });
    };

    if (this.system_schema.inputProperties) processProps(this.system_schema.inputProperties);
    if (this.system_schema.outputProperties) processProps(this.system_schema.outputProperties);

    return list;
  });

  allowedChartComponentsForSection = computed(() => {
    const sec = this.currentSection();
    if (!sec) return [];

    // Support both lowercase 'validation' and legacy uppercase 'Validation'
    const validationList = sec.validation || sec.Validation;
    if (!validationList) return [];

    const allowedComponentIds: string[] = [];
    validationList.forEach((v: any) => {
      if (v.allowCharts && v.allowPlotComponentId) {
        allowedComponentIds.push(...v.allowPlotComponentId);
      }
    });

    return this.chartComponentCatalog.filter((item) =>
      allowedComponentIds.includes(item.plotComponentId)
    );
  });

  onTemplateChange(templateId: string) {
    this.selectedTemplateId.set(templateId);
    this.templateId = templateId;
    this.selectionService.clearSelection();

    this.systemData.update((sys) => {
      if (sys && sys.templates) {
        sys.templates.forEach((t: any) => {
          t.status = t.templateId === templateId ? 'active' : 'inactive';
        });
      }
      return { ...sys };
    });
  }

  loadPlotConfig(plotId: string) {
    const tmplObj = this.currentSystemTemplateObj();
    const plotsList = tmplObj?.plots || [];
    const plot = plotsList.find((p: any) => p.plotId === plotId);
    if (plot) {
      this.activePlotConfig.set(JSON.parse(JSON.stringify(plot)));
    } else {
      this.activePlotConfig.set(null);
    }
  }

  openAddPlotModal() {
    if (!this.selectedSectionId()) return;
    this.newPlotTitle.set('');
    this.newPlotCategory.set('');
    const allowed = this.allowedChartComponentsForSection();
    if (allowed.length > 0) {
      this.selectedComponentCatalogItem.set(allowed[0]);
    } else {
      this.selectedComponentCatalogItem.set(null);
    }
    this.isAddPlotModalOpen.set(true);
  }

  closeAddPlotModal() {
    this.isAddPlotModalOpen.set(false);
  }

  onCatalogItemSelect(plotComponentId: string) {
    const item = this.chartComponentCatalog.find((c) => c.plotComponentId === plotComponentId);
    if (item) {
      this.selectedComponentCatalogItem.set(item);
    }
  }

  confirmAddPlot() {
    const title = this.newPlotTitle().trim();
    const category = this.newPlotCategory().trim();
    const catalogItem = this.selectedComponentCatalogItem();
    const secId = this.selectedSectionId();
    const currentSec = this.currentSection();

    if (!title || !catalogItem || !secId) {
      alert('Please fill out all required fields.');
      return;
    }

    const instanceSuffix = `instance-${String(Math.floor(Math.random() * 900) + 100)}`;
    const generatedPlotId = `${catalogItem.plotComponentId}-${instanceSuffix}`;

    const newPlot: any = {
      plotId: generatedPlotId,
      plotComponentId: catalogItem.plotComponentId,
      title: title,
      category: category,
      chartType: catalogItem.chartType,
      parentPlaceholderTemplate: currentSec?.parentPlaceholderTemplate || 'system-grid-02',
      belongSection: secId,
      metadata: this.buildDefaultMetadata(catalogItem.chartType),
    };

    const currentData = JSON.parse(JSON.stringify(this.systemData()));
    let tmplObj = currentData.templates?.find((t: any) => t.templateId === this.selectedTemplateId());

    if (!tmplObj) {
      tmplObj = { templateId: this.selectedTemplateId(), status: 'active', plots: [] };
      if (!currentData.templates) currentData.templates = [];
      currentData.templates.push(tmplObj);
    }

    if (!tmplObj.plots) tmplObj.plots = [];
    tmplObj.plots.push(newPlot);

    console.log(`📑 Template (${tmplObj.plots.length}):`, JSON.stringify(tmplObj, null, 2));

    // 1. Update systemData state
    this.systemData.set(currentData);
    this.closeAddPlotModal();
  }

  private buildDefaultMetadata(chartType: string): any {
    switch (chartType) {
      case 'single-line':
        return { label: '', xAxis: '', yAxis: '', xAxisLabel: '', yAxisLabel: '', series: [], unit: '', normalize: false, yMin: null, yMax: null, thresholds: { warning: null, critical: null } };
      case 'multi-line-ts':
        return { label: '', xAxis: '', series: [], unit: '', yMin: 0, yMax: null, thresholds: { warning: null, critical: null } };
      case 'multi-line-index':
        return { label: '', xAxis: '', series: [], unit: '', normalize: true };
      case 'scatter':
        return { label: '', xAxis: '', yAxis: '', xAxisLabel: '', yAxisLabel: '', colorBy: null, colorByLabel: null };
      case 'gauge':
        return { label: '', valueField: '', unit: '', min: null, max: null, thresholds: { warning: null, critical: null } };
      case 'donut':
        return { label: '', labelField: '', valueField: '' };
      case 'bar-single':
        return { label: '', xAxis: '', yAxis: '', unit: '', thresholds: { warning: null, critical: null } };
      case 'heatmap':
        return { label: '', fields: [], xAxis: '', mode: '', normalize: false, colorRange: [] };
      case 'bar-grouped':
        return { label: '', categoryField: '', series: [], orientation: '', rowIndex: 0 };
      case 'parallel-coords':
        return { label: '', axes: [], colorBy: '', colorByLabel: '' };
      case 'pie':
        return { label: '', labelField: '', valueField: '', showPercentage: true, showLegend: true };
      case 'stat-card':
        return { label: '', valueField: '', aggregation: '', unit: '', trendField: '', thresholds: { warning: null, critical: null } };
      case 'multi-kpi':
        return { label: '', kpis: [{ label: '', valueField: '', unit: '', aggregation: '', thresholds: { warning: null, critical: null } }] };
      default:
        return { label: '', xAxis: '', yAxis: '', unit: '', thresholds: { warning: null, critical: null } };
    }
  }

  addKpiItem() {
    const config = { ...this.activePlotConfig() };
    if (!config.metadata) config.metadata = {};
    if (!config.metadata.kpis) config.metadata.kpis = [];

    const firstProp = this.availableProperties()[0]?.value || '';
    config.metadata.kpis.push({
      label: '', valueField: firstProp, unit: '', aggregation: '', thresholds: { warning: 0, critical: 0 },
    });
    this.activePlotConfig.set(config);
  }

  removeKpiItem(index: number) {
    const config = { ...this.activePlotConfig() };
    if (config?.metadata?.kpis) {
      config.metadata.kpis.splice(index, 1);
      this.activePlotConfig.set(config);
    }
  }

  addSeriesTag(event: Event) {
    const select = event.target as HTMLSelectElement;
    const value = select.value;
    if (!value) return;

    const config = { ...this.activePlotConfig() };
    if (!config.metadata) config.metadata = {};
    if (!config.metadata.series) config.metadata.series = [];

    if (!config.metadata.series.includes(value)) {
      config.metadata.series.push(value);
      this.activePlotConfig.set(config);
    }
    select.value = '';
  }

  removeSeriesTag(index: number) {
    const config = { ...this.activePlotConfig() };
    if (config?.metadata?.series) {
      config.metadata.series.splice(index, 1);
      this.activePlotConfig.set(config);
    }
  }

  addHeatmapFieldTag(event: Event) {
    const select = event.target as HTMLSelectElement;
    const value = select.value;
    if (!value) return;

    const config = { ...this.activePlotConfig() };
    if (!config.metadata) config.metadata = {};
    if (!config.metadata.fields) config.metadata.fields = [];

    if (!config.metadata.fields.includes(value)) {
      config.metadata.fields.push(value);
      this.activePlotConfig.set(config);
    }
    select.value = '';
  }

  removeHeatmapFieldTag(index: number) {
    const config = { ...this.activePlotConfig() };
    if (config?.metadata?.fields) {
      config.metadata.fields.splice(index, 1);
      this.activePlotConfig.set(config);
    }
  }

  addParallelAxisTag(event: Event) {
    const select = event.target as HTMLSelectElement;
    const value = select.value;
    if (!value) return;

    const config = { ...this.activePlotConfig() };
    if (!config.metadata) config.metadata = {};
    if (!config.metadata.axes) config.metadata.axes = [];

    if (!config.metadata.axes.includes(value)) {
      config.metadata.axes.push(value);
      this.activePlotConfig.set(config);
    }
    select.value = '';
  }

  removeParallelAxisTag(index: number) {
    const config = { ...this.activePlotConfig() };
    if (config?.metadata?.axes) {
      config.metadata.axes.splice(index, 1);
      this.activePlotConfig.set(config);
    }
  }

  saveConfiguration() {
    const currentConfig = this.activePlotConfig();
    if (!currentConfig) return;

    const currentData = { ...this.systemData() };
    const tmplObj = currentData.templates?.find((t: any) => t.templateId === this.selectedTemplateId());

    if (tmplObj) {
      const plotsList = tmplObj.plots || [];
      const plotIndex = plotsList.findIndex((p: any) => p.plotId === currentConfig.plotId);

      if (plotIndex !== -1) {
        currentConfig.belongSection = currentConfig.belongSection || this.selectedSectionId();
        tmplObj.plots[plotIndex] = currentConfig;
        this.systemData.set(currentData);
        console.log('Updated System Payload:', JSON.stringify(this.systemData(), null, 2));
        alert('Configuration saved successfully!');
      }
    }
  }
}