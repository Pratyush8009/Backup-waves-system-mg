import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';
import { PlotUtils } from '../plot-base';


const CHART_STYLE      = 'height:260px;width:100%;';
const CHART_STYLE_SM   = 'height:220px;width:100%;';

@Component({
  selector: 'app-scatter-multi-plot-v2',
  imports: [CommonModule,  NgxEchartsDirective],
  templateUrl: './scatter-multi-plot.html',
  styleUrl: './scatter-multi-plot.css',
  providers: [
    provideEchartsCore({echarts})
  ],
})
export class ScatterMultiPlot implements OnChanges {
  @Input() config: any; @Input() data: any[] = [];
  options: EChartsOption = {}; CHART_STYLE = CHART_STYLE;
 
  ngOnChanges() {
    const m       = this.config?.metadata ?? {};
    const series: string[] = m.series ?? [];
 
    this.options = {
      tooltip: { trigger: 'item' },
      legend:  { bottom: 0, data: series },
      xAxis:   { type: 'value', name: m.xAxisLabel ?? m.xAxis, nameLocation: 'middle', nameGap: 25 },
      yAxis:   { type: 'value' },
      series:  series.map((key, i) => ({
        name: key, type: 'scatter',
        data: this.data.map(d => [d[m.xAxis], d[key]]),
        itemStyle: { color: PlotUtils.PALETTE[i % PlotUtils.PALETTE.length], opacity: 0.75 },
      })),
    };
  }
}