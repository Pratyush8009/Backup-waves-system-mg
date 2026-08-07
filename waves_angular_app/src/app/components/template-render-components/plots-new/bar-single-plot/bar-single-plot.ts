import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';
import { PlotUtils } from '../plot-base';


const CHART_STYLE      = 'height:260px;width:100%;';
const CHART_STYLE_SM   = 'height:220px;width:100%;';


@Component({
  selector: 'app-bar-single-plot-v2',
  imports: [CommonModule,  NgxEchartsDirective],
  templateUrl: './bar-single-plot.html',
  styleUrl: './bar-single-plot.css',
  providers: [
    provideEchartsCore({echarts})
  ],

})
export class BarSinglePlot implements OnChanges {
  @Input() config: any; @Input() data: any[] = [];
  options: EChartsOption = {}; CHART_STYLE_SM = CHART_STYLE_SM;
 
  ngOnChanges() {
    const m    = this.config?.metadata ?? {};
    const horiz = m.orientation === 'horizontal';
    const cats  = m.xAxis === 'index' 
      ? this.data.map((_, i) => i) 
      : this.data.map(d => d[m.xAxis]);
    const vals  = this.data.map(d => d[m.yAxis]);
 
    const colorFn = (params: any) =>
      PlotUtils.thresholdColor(params.value, m.thresholds);
 
    this.options = {
      tooltip: {},
      [horiz ? 'yAxis' : 'xAxis']: { type: 'category', data: cats },
      [horiz ? 'xAxis' : 'yAxis']: { type: 'value', name: m.unit },
      series: [{ type: 'bar', data: vals, itemStyle: { color: colorFn as any, borderRadius: horiz ? [0,4,4,0] : [4,4,0,0] } }],
    };
  }
}
