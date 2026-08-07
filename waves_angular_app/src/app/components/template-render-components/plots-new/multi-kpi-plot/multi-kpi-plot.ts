import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';
import { PlotUtils } from '../plot-base';


const CHART_STYLE      = 'height:260px;width:100%;';
const CHART_STYLE_SM   = 'height:220px;width:100%;';

@Component({
  selector: 'app-multi-kpi-plot-v2',
  imports: [CommonModule,],
  templateUrl: './multi-kpi-plot.html',
  styleUrl: './multi-kpi-plot.css',
  providers: [
    provideEchartsCore({echarts})
  ],
})
export class MultiKpiPlot implements OnChanges {
  @Input() config: any; @Input() data: any[] = [];
  kpis: any[] = [];
 
  ngOnChanges() {
    const defs: any[] = this.config?.metadata?.kpis ?? [];
    this.kpis = defs.map(kpi => {
      const col = this.data.map(d => d[kpi.valueField]).filter(v => v != null);
      const val = PlotUtils.aggregate(col, kpi.aggregation ?? 'last');
      return {
        label: kpi.label,
        value: isNaN(val) ? '--' : +val.toFixed(2),
        unit:  kpi.unit ?? '',
        color: PlotUtils.thresholdColor(val, kpi.thresholds),
      };
    });
  }
}
