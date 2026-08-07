import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { PlotConfig } from '../plot-base';

/**
 * Fallback plot component rendered when a plot's chartType cannot be
 * resolved to a registered plot component in dynamic-component-registry.
 */
@Component({
  selector: 'app-default-plot-template',
  imports: [CommonModule, NzEmptyModule],
  templateUrl: './default-template.html',
  styleUrl: './default-template.css',
})
export class DefaultPlotTemplate {
  @Input() config!: PlotConfig;
  @Input() data: any[] = [];
}
