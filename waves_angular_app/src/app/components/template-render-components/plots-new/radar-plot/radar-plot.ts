import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';
import { PlotUtils } from '../plot-base';


const CHART_STYLE      = 'height:260px;width:100%;';
const CHART_STYLE_SM   = 'height:220px;width:100%;';

@Component({
  selector: 'app-radar-plot-v2',
  imports: [CommonModule,  NgxEchartsDirective],
  templateUrl: './radar-plot.html',
  styleUrl: './radar-plot.css',
  providers: [
    provideEchartsCore({echarts})
  ],
})
export class RadarPlot implements OnChanges {
  @Input() config: any; @Input() data: any[] = [];
  options: EChartsOption = {}; CHART_STYLE_SM = CHART_STYLE_SM;
 
  ngOnChanges() {
    const m      = this.config?.metadata ?? {};
    const axes: any[] = m.axes ?? [];
    const seriesDefs: any[] = m.series ?? [{ label: 'Current', rowIndex: 0 }];
 
    const indicator = axes.map((ax: any) => {
      const vals = this.data.map(d => d[ax.field] as number);
      return {
        name: ax.label ?? ax.field,
        min:  ax.min ?? 0,
        max:  ax.max ?? Math.max(...vals) * 1.1,
      };
    });
 
    this.options = {
      tooltip: {},
      legend:  { bottom: 0, data: seriesDefs.map((s: any) => s.label) },
      radar:   { indicator, radius: '70%' },
      series:  [{
        type: 'radar',
        data: seriesDefs.map((s: any, i: number) => ({
          name:  s.label,
          value: axes.map((ax: any) => this.data[s.rowIndex ?? 0]?.[ax.field] ?? 0),
          lineStyle: { color: PlotUtils.PALETTE[i % PlotUtils.PALETTE.length] },
          areaStyle: { color: PlotUtils.PALETTE[i % PlotUtils.PALETTE.length], opacity: 0.15 },
        })),
      }],
    };
  }
}
 