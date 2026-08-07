import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';
import { PlotUtils } from '../plot-base';


const CHART_STYLE      = 'height:260px;width:100%;';
const CHART_STYLE_SM   = 'height:220px;width:100%;';


@Component({
  selector: 'app-stat-card-plot-v2',
  imports: [CommonModule],
  templateUrl: './stat-card-plot.html',
  styleUrl: './stat-card-plot.css',
  providers: [
    provideEchartsCore({echarts})
  ],
})
export class StatCardPlot implements OnChanges {
  @Input() config: any; @Input() data: any[] = [];
  displayValue: number | string = '--'; valueColor = '#111827'; trend: number | null = null;
 
  ngOnChanges() {
    const m   = this.config?.metadata ?? {};
    const col = this.data.map(d => d[m.valueField]).filter(v => v != null);
    const val = PlotUtils.aggregate(col, m.aggregation ?? 'last');
    this.displayValue = isNaN(val) ? '--' : +val.toFixed(2);
    this.valueColor   = PlotUtils.thresholdColor(val, m.thresholds);
    if (m.trendField) {
      const tc = this.data.map(d => d[m.trendField]).filter(v => v != null);
      this.trend = tc.length > 0 ? tc[tc.length - 1] : null;
    }
  }
}
