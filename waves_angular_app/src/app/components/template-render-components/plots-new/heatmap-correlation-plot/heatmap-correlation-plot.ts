import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';
import { PlotUtils } from '../plot-base';


const CHART_STYLE      = 'height:260px;width:100%;';
const CHART_STYLE_SM   = 'height:220px;width:100%;';

@Component({
  selector: 'app-heatmap-correlation-plot-v2',
  imports: [CommonModule,  NgxEchartsDirective],
  templateUrl: './heatmap-correlation-plot.html',
  styleUrl: './heatmap-correlation-plot.css',
  providers: [
    provideEchartsCore({echarts})
  ],
})
export class HeatmapCorrelationPlot implements OnChanges {
  @Input() config: any; @Input() data: any[] = [];
  options: EChartsOption = {}; CHART_STYLE = CHART_STYLE;
 
  ngOnChanges() {
    const m      = this.config?.metadata ?? {};
    const fields: string[] = m.fields ?? Object.keys(this.data[0] ?? {});
    const cr     = m.colorRange ?? [-1, 1];
 
    // Pearson correlation between two columns
    const corr = (a: number[], b: number[]): number => {
      const n  = a.length;
      const mA = a.reduce((s, v) => s + v, 0) / n;
      const mB = b.reduce((s, v) => s + v, 0) / n;
      const num = a.reduce((s, v, i) => s + (v - mA) * (b[i] - mB), 0);
      const dA  = Math.sqrt(a.reduce((s, v) => s + (v - mA) ** 2, 0));
      const dB  = Math.sqrt(b.reduce((s, v) => s + (v - mB) ** 2, 0));
      return (dA && dB) ? +(num / (dA * dB)).toFixed(3) : 0;
    };
 
    const heatData: any[] = [];
    fields.forEach((f1, i) => {
      fields.forEach((f2, j) => {
        const col1 = this.data.map(d => +d[f1]);
        const col2 = this.data.map(d => +d[f2]);
        heatData.push([i, j, corr(col1, col2)]);
      });
    });
 
    this.options = {
      tooltip:   { position: 'top', formatter: (p: any) => `${fields[p.value[0]]} × ${fields[p.value[1]]}: ${p.value[2]}` },
      grid:      { top: 10, bottom: 60, left: '15%', right: '5%' },
      xAxis:     { type: 'category', data: fields },
      yAxis:     { type: 'category', data: fields },
      visualMap: { min: cr[0], max: cr[1], calculable: true, orient: 'horizontal', left: 'center', bottom: 0,
                   inRange: { color: ['#ff4d4f','#fff','#1677ff'] } },
      series:    [{ type: 'heatmap', data: heatData, label: { show: true, fontSize: 10 } }],
    };
  }
}
