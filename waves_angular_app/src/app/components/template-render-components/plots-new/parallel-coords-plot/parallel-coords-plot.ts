import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';
import { PlotUtils } from '../plot-base';


const CHART_STYLE      = 'height:260px;width:100%;';
const CHART_STYLE_SM   = 'height:220px;width:100%;';

@Component({
  selector: 'app-parallel-coords-plot-v2',
  imports: [CommonModule,  NgxEchartsDirective],
  templateUrl: './parallel-coords-plot.html',
  styleUrl: './parallel-coords-plot.css',
  providers: [
    provideEchartsCore({echarts})
  ],
})
export class ParallelCoordsPlot implements OnChanges {
  @Input() config: any; @Input() data: any[] = [];
  options: EChartsOption = {}; CHART_STYLE = CHART_STYLE;
 
  ngOnChanges() {
    const m    = this.config?.metadata ?? {};
    const axes: string[] = m.axes ?? [];
 
    const parallelAxis = axes.map((field: string, i: number) => {
      const vals = this.data
        .map(d => Number(d[field]))
        .filter((v) => Number.isFinite(v));
      return {
        dim: i,
        name: field,
        min: vals.length ? Math.min(...vals) : 0,
        max: vals.length ? Math.max(...vals) : 0,
      };
    });
 
    const colorByVals = m.colorBy
      ? this.data.map(d => Number(d[m.colorBy])).filter((v) => Number.isFinite(v))
      : [];
    const colorByDim = axes.indexOf(m.colorBy);
    const hasColorBy = colorByVals.length > 0 && colorByDim >= 0;
    const cMin = hasColorBy ? Math.min(...colorByVals) : 0;
    const cMax = hasColorBy ? Math.max(...colorByVals) : 1;
 
    this.options = {
      parallelAxis,
      parallel: { left: '5%', right: '8%', bottom: 60, top: 30 },
      tooltip: { trigger: 'item' },
      visualMap: hasColorBy
        ? {
            min: cMin,
            max: cMax,
            dimension: colorByDim,
            orient: 'horizontal',
            bottom: 0,
            left: 'center',
            text: [m.colorByLabel ?? m.colorBy, ''],
            inRange: { color: ['#52c41a', '#faad14', '#ff4d4f'] },
          } as any
        : undefined,
      series: [
        {
          type: 'parallel',
          lineStyle: { width: 1, opacity: 0.5 },
          data: this.data.map((d) => axes.map((f) => Number(d[f]))),
        },
      ],
    };
  }
}
 