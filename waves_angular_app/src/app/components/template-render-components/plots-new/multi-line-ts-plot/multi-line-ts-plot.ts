import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';
import { PlotUtils } from '../plot-base';


const CHART_STYLE      = 'height:260px;width:100%;';
const CHART_STYLE_SM   = 'height:220px;width:100%;';

@Component({
  selector: 'app-multi-line-ts-plot-v2',
  imports: [CommonModule,  NgxEchartsDirective],
  templateUrl: './multi-line-ts-plot.html',
  styleUrl: './multi-line-ts-plot.css',
  providers: [
    provideEchartsCore({echarts})
  ],
})
export class MultiLineTsPlot implements OnChanges {
  @Input() config: any; @Input() data: any[] = [];
  options: EChartsOption = {}; CHART_STYLE = CHART_STYLE;
 
  ngOnChanges() {
    const m       = this.config?.metadata ?? {};
    const series: string[] = m.series ?? [];
 
    this.options = {
      tooltip:  { trigger: 'axis' },
      legend:   { bottom: 0, data: series },
      dataZoom: PlotUtils.dataZoom(),
      xAxis:    { type: 'category', data: this.data.map(d => d[m.xAxis ?? 'ts']), boundaryGap: false },
      yAxis:    { type: 'value', name: m.unit, min: m.yMin ?? undefined, max: m.yMax ?? undefined },
      series:   series.map((key, i) => ({
        name: key, type: 'line', showSymbol: false, smooth: true,
        data: this.data.map(d => d[key]),
        lineStyle: { color: PlotUtils.PALETTE[i % PlotUtils.PALETTE.length] },
      })),
    };
  }
}
