import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';
import { PlotUtils } from '../plot-base';


const CHART_STYLE      = 'height:260px;width:100%;';
const CHART_STYLE_SM   = 'height:220px;width:100%;';
@Component({
  selector: 'app-single-line-plot-v2',
  imports: [CommonModule,  NgxEchartsDirective],
  templateUrl: './single-line-plot.html',
  styleUrl: './single-line-plot.css',
  providers: [
    provideEchartsCore({echarts})
  ],
})
export class SingleLinePlot implements OnChanges {
  @Input() config: any; @Input() data: any[] = [];
  options: EChartsOption = {}; CHART_STYLE = CHART_STYLE;
 
  ngOnChanges() {
    const m    = this.config?.metadata ?? {};
    const xKey = m.xAxis ?? 'ts';
    const yKey = m.yAxis ?? Object.keys(this.data?.[0] ?? {}).find(k => k !== xKey) ?? '';
 
    this.options = {
      tooltip:  { trigger: 'axis' },
      dataZoom: PlotUtils.dataZoom(),
      xAxis:    { type: 'category', data: this.data.map(d => d[xKey]), boundaryGap: false },
      yAxis:    { type: 'value', name: m.unit, min: m.yMin ?? undefined, max: m.yMax ?? undefined },
      series: [{
        type: 'line', showSymbol: false, smooth: true,
        data: this.data.map(d => d[yKey]),
        lineStyle: { color: PlotUtils.PALETTE[0], width: 2 },
        markLine: m.thresholds?.warning != null ? {
          data: [
            { yAxis: m.thresholds.warning,  name: 'Warning',  lineStyle: { color: '#faad14' } },
            { yAxis: m.thresholds.critical, name: 'Critical', lineStyle: { color: '#ff4d4f' } },
          ],
        } : undefined,
      }],
    };
  }
}