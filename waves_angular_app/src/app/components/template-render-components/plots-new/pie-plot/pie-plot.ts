import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';
import { PlotUtils } from '../plot-base';


const CHART_STYLE      = 'height:260px;width:100%;';
const CHART_STYLE_SM   = 'height:220px;width:100%;';

@Component({
  selector: 'app-pie-plot-v2',
  imports: [CommonModule,  NgxEchartsDirective],
  templateUrl: './pie-plot.html',
  styleUrl: './pie-plot.css',
  providers: [
    provideEchartsCore({echarts})
  ],
})
export class PiePlot implements OnChanges {
  @Input() config: any; @Input() data: any[] = [];
  options: EChartsOption = {}; CHART_STYLE_SM = CHART_STYLE_SM;
 
  ngOnChanges() {
    const m   = this.config?.metadata ?? {};
    const lf  = m.labelField ?? 'name';
    const vf  = m.valueField ?? 'value';
    const pct = m.showPercentage ?? true;
    const leg = m.showLegend     ?? true;
 
    this.options = {
      tooltip: { trigger: 'item', formatter: pct ? '{b}: {d}%' : '{b}: {c}' },
      legend:  leg ? { bottom: 0 } : undefined,
      series:  [{
        type:  'pie',
        radius: '70%',
        data:  this.data.map(d => ({ name: d[lf], value: d[vf] })),
        label: { formatter: pct ? '{b}\n{d}%' : '{b}' },
      }],
    };
  }
}
 
