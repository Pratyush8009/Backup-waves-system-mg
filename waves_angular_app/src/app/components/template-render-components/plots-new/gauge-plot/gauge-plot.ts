import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';
import { PlotUtils } from '../plot-base';


const CHART_STYLE      = 'height:260px;width:100%;';
const CHART_STYLE_SM   = 'height:220px;width:100%;';

@Component({
  selector: 'app-gauge-plot-v2',
  imports: [CommonModule,  NgxEchartsDirective],
  templateUrl: './gauge-plot.html',
  styleUrl: './gauge-plot.css',
  providers: [
    provideEchartsCore({echarts})
  ],
})
export class GaugePlot implements OnChanges {
  @Input() config: any; @Input() data: any[] = [];
  options: EChartsOption = {};
 
  ngOnChanges() {
    const m    = this.config?.metadata ?? {};
    const val  = m.valueField ? (this.data?.[0]?.[m.valueField] ?? 0) : (this.data?.[0]?.current ?? 0);
    const max  = m.max ?? 100;
    const min  = m.min ?? 0;
    const warn = m.thresholds?.warning  ?? max * 0.75;
    const crit = m.thresholds?.critical ?? max * 0.9;
 
    this.options = {
      tooltip: {
        formatter: (params: any) => {
          const m = this.config?.metadata ?? {};
          const val = params.value;
          const unit = m.unit ?? '';
          const min = m.min ?? 0;
          const max = m.max ?? 100;
          const warn = m.thresholds?.warning ?? max * 0.75;
          const crit = m.thresholds?.critical ?? max * 0.9;
          let status = 'Normal';
          if (val >= crit) status = 'Critical';
          else if (val >= warn) status = 'Warning';
          
          return `
            <strong>${m.label ?? 'Gauge'}</strong><br/>
            Value: ${val} ${unit}<br/>
            Range: ${min} - ${max} ${unit}<br/>
            Warning: ${warn} ${unit}<br/>
            Critical: ${crit} ${unit}<br/>
            Status: ${status}
          `;
        }
      },
      series: [{
        type: 'gauge', center: ['50%', '62%'], radius: '82%', min, max, splitNumber: 5,
        axisLine: { lineStyle: { width: 14, color: [
          [warn / max, '#52c41a'], [crit / max, '#faad14'], [1, '#ff4d4f'],
        ]}},
        axisTick:  { distance: -16, length: 6,  lineStyle: { color: '#fff', width: 1.5 } },
        splitLine: { distance: -20, length: 12, lineStyle: { color: '#fff', width: 2   } },
        axisLabel: { distance: -28, color: '#4b5563', fontSize: 10 },
        pointer:   { itemStyle: { color: 'auto' }, length: '55%', width: 5 },
        progress:  { show: true, width: 14, roundCap: true },
        detail:    { valueAnimation: true, formatter: `{value} ${m.unit ?? ''}`, color: '#111827', fontSize: 18, fontWeight: 700, offsetCenter: [0, '22%'] },
        title:     { offsetCenter: [0, '42%'], fontSize: 11, color: '#6b7280' },
        data:      [{ value: val, name: m.label ?? '' }],
      }],
    };
  }
}
