import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';
import { PlotUtils } from '../plot-base';


const CHART_STYLE      = 'height:260px;width:100%;';
const CHART_STYLE_SM   = 'height:220px;width:100%;';

@Component({
  selector: 'app-scatter-plot-v2',
  imports: [CommonModule,  NgxEchartsDirective],
  templateUrl: './scatter-plot.html',
  styleUrl: './scatter-plot.css',
  providers: [
    provideEchartsCore({echarts})
  ],
})
export class ScatterPlot implements OnChanges {
  @Input() config: any; @Input() data: any[] = [];
  options: EChartsOption = {}; CHART_STYLE = CHART_STYLE;
 
  ngOnChanges() {
    const m = this.config?.metadata ?? {};
    this.options = {
      tooltip: { trigger: 'item', formatter: (p: any) => `${m.xAxisLabel ?? m.xAxis}: ${p.value[0]}<br>${m.yAxisLabel ?? m.yAxis}: ${p.value[1]}` },
      xAxis:   { type: 'value', name: m.xAxisLabel ?? m.xAxis, nameLocation: 'middle', nameGap: 25 },
      yAxis:   { type: 'value', name: m.yAxisLabel ?? m.yAxis },
      series:  [{ type: 'scatter', data: this.data.map(d => [d[m.xAxis], d[m.yAxis]]), itemStyle: { color: PlotUtils.PALETTE[0], opacity: 0.7 } }],
    };
  }
}
