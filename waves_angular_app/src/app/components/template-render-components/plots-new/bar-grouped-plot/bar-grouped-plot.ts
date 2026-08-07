import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';
import { PlotUtils } from '../plot-base';


const CHART_STYLE      = 'height:260px;width:100%;';
const CHART_STYLE_SM   = 'height:220px;width:100%;';

@Component({
  selector: 'app-bar-grouped-plot-v2',
  imports: [CommonModule,  NgxEchartsDirective],
  templateUrl: './bar-grouped-plot.html',
  styleUrl: './bar-grouped-plot.css',
  providers: [
    provideEchartsCore({echarts})
  ],
})
export class BarGroupedPlot implements OnChanges {
  @Input() config: any; @Input() data: any[] = [];
  options: EChartsOption = {}; CHART_STYLE_SM = CHART_STYLE_SM;
 
  ngOnChanges() {
    const m       = this.config?.metadata ?? {};
    const series: string[] = m.series ?? [];
    const rowIdx  = m.rowIndex ?? 0;
    const row     = this.data[rowIdx] ?? this.data[this.data.length - 1] ?? {};
    const cats    = ['Parameters'];  // Single category for grouped bars
 
    this.options = {
      tooltip: { trigger: 'axis' },
      legend:  { bottom: 0, data: series },
      xAxis:   { type: 'category', data: cats },
      yAxis:   { type: 'value' },
      series:  series.map((key, i) => ({
        name: key, type: 'bar',
        data: [row[key]],
        itemStyle: { color: PlotUtils.PALETTE[i % PlotUtils.PALETTE.length], borderRadius: [4,4,0,0] },
      })),
    };
  }
}