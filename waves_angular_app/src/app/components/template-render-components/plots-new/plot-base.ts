// dashboard/plots/plot-base.ts
// Shared base class + helpers used by every plot component.

import { Directive, Input, OnChanges, SimpleChanges } from '@angular/core';
import type { EChartsOption } from 'echarts';

/** Every plot component receives exactly these two inputs */
export interface PlotInputs {
  config: PlotConfig;
  data:   any[];
}

export interface PlotConfig {
  plotId:    string;
  title?:    string;
  chartType: string;
  mappedField: string;
  metadata:  Record<string, any>;
}

/** Shared utility functions — imported by plot components that need them */
export class PlotUtils {

  /** Normalise a column of numbers to [0, 1] range */
  static normalise(values: number[]): number[] {
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    return values.map(v => (v - min) / range);
  }

  /** Safe aggregation (last | mean | min | max | sum) on an array of numbers */
  static aggregate(values: number[], method: string): number {
    if (!values.length) return 0;
    switch (method) {
      case 'mean': return values.reduce((a, b) => a + b, 0) / values.length;
      case 'min':  return Math.min(...values);
      case 'max':  return Math.max(...values);
      case 'sum':  return values.reduce((a, b) => a + b, 0);
      default:     return values[values.length - 1];   // 'last'
    }
  }

  /** Apply threshold colouring to a value; returns a CSS/echarts colour string */
  static thresholdColor(value: number, thresholds?: { warning?: number | null; critical?: number | null }): string {
    if (!thresholds) return '#1677ff';
    if (thresholds.critical != null && value >= thresholds.critical) return '#ff4d4f';
    if (thresholds.warning  != null && value >= thresholds.warning)  return '#faad14';
    return '#52c41a';
  }

  /** Build a standard tooltip formatter string including unit */
  static tooltipFormatter(unit: string): string {
    return unit ? `{b}: {c} ${unit}` : '{b}: {c}';
  }

  /** Standard dataZoom for large datasets */
  static dataZoom(): any[] {
    return [{ type: 'inside' }, { type: 'slider', height: 18 }];
  }

  /** Colour palette aligned with app theme */
  static readonly PALETTE = [
    '#1677ff', '#52c41a', '#faad14', '#f5222d',
    '#722ed1', '#13c2c2', '#fa8c16', '#eb2f96',
  ];
}

/** Base class — all plot components extend this for zero-boilerplate onChange */
@Directive()
export abstract class BasePlotComponent implements OnChanges {
  @Input() config!: PlotConfig;
  @Input() data:    any[] = [];

  options: EChartsOption = {};

  ngOnChanges(_changes: SimpleChanges): void {
    if (this.config && this.data !== undefined) {
      this.options = this.buildOption();
    }
  }

  abstract buildOption(): EChartsOption;
}