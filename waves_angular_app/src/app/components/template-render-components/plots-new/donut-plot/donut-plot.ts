import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';
import { PlotUtils } from '../plot-base';


const CHART_STYLE      = 'height:260px;width:100%;';
const CHART_STYLE_SM   = 'height:220px;width:100%;';

@Component({
  selector: 'app-donut-plot-v2',
  imports: [CommonModule,  NgxEchartsDirective],
  templateUrl: './donut-plot.html',
  styleUrl: './donut-plot.css',
  providers: [
    provideEchartsCore({echarts})
  ],
})
export class DonutPlot implements OnChanges {
  @Input() config: any; @Input() data: any[] = [];
  options: EChartsOption = {}; CHART_STYLE_SM = CHART_STYLE_SM;
 
  ngOnChanges() {
    const m   = this.config?.metadata ?? {};
    const lf  = m.labelField  ?? 'name';
    const vf  = m.valueField  ?? 'value';
 
    this.options = {
      tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
      legend:  { bottom: 0 },
      series:  [{
        type: 'pie', radius: ['40%', '65%'],
        data: this.data.map(d => ({ name: d[lf], value: d[vf] })),
        label: { formatter: '{b}: {d}%' },
      }],
    };
  }
}
