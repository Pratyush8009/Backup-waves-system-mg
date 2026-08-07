import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';
import { PlotUtils } from '../plot-base';


const CHART_STYLE      = 'height:260px;width:100%;';
const CHART_STYLE_SM   = 'height:220px;width:100%;';

@Component({
  selector: 'app-heatmap-plot-v2',
  imports: [CommonModule,  NgxEchartsDirective],
  templateUrl: './heatmap-plot.html',
  styleUrl: './heatmap-plot.css',
  providers: [
    provideEchartsCore({echarts})
  ],
})
export class HeatmapPlot implements OnChanges {
  @Input() config: any; @Input() data: any[] = [];
  options: EChartsOption = {}; CHART_STYLE = CHART_STYLE;
 
  ngOnChanges() {
    const m      = this.config?.metadata ?? {};
    const fields: string[] = m.fields ?? Object.keys(this.data[0] ?? {});
    const norm   = m.normalize ?? false;
    const cr     = m.colorRange ?? [0, 1];
 
    const heatData: any[] = [];
    this.data.forEach((row, rowIdx) => {
      fields.forEach((f, colIdx) => {
        heatData.push([rowIdx, colIdx, row[f] ?? '-']);
      });
    });
 
    const allVals = heatData.map(d => d[2]).filter(v => typeof v === 'number');
 
    this.options = {
      tooltip: { position: 'top' },
      grid:    { top: 10, bottom: 60, left: '15%', right: '5%' },
      xAxis:   { type: 'category', data: this.data.map((_, i) => String(i)), name: m.xAxis ?? 'Index' },
      yAxis:   { type: 'category', data: fields },
      visualMap: { min: norm ? 0 : Math.min(...allVals), max: norm ? 1 : Math.max(...allVals),
                   calculable: true, orient: 'horizontal', left: 'center', bottom: 0,
                   inRange: { color: ['#e0f3ff','#1677ff'] } },
      series:  [{ type: 'heatmap', data: heatData, label: { show: fields.length <= 8 } }],
    };
  }
}
