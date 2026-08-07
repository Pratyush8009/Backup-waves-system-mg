import {
  Component, Input, OnChanges, SimpleChanges,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule, NgComponentOutlet } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { resolvePlotComponent } from '../../plots-new/dynamic-component-registry';
import { TemplateSelectionService } from '../../../../services/template-selection.service';

// ─── Shared resolver helper ───────────────────────────────────────────────────
function resolveTableData(rawLiveData: any, mappedField: string): any[] {
  return rawLiveData?.tables?.find((t: any) => t.name === mappedField)?.value ?? [];
}

@Component({
  selector: 'app-system-grid-full-v2',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NgComponentOutlet, NzCardModule, NzIconModule, NzEmptyModule],
  templateUrl: './system-grid-full.html',
  styleUrl: './system-grid-full.css',
})
export class SystemGridFull implements OnChanges {
  @Input() plots: any[] = [];
  @Input() rawLiveData: any;
  sectionId = ""

  private dataCache = new Map<string, any[]>();

  ngOnChanges(c: SimpleChanges): void {
    if (c['rawLiveData'] || c['plots']) this.dataCache.clear();
  }
  constructor(public selectionService: TemplateSelectionService) {

  }
  getPlotComponent(chartType: string) { return resolvePlotComponent(chartType); }

  resolveData(mappedField: string): any[] {
    if (!this.dataCache.has(mappedField)) {
      this.dataCache.set(mappedField, resolveTableData(this.rawLiveData, mappedField));
    }
    return this.dataCache.get(mappedField)!;
  }
  onPlotClick(plotId: string, event: MouseEvent): void {
    event.stopPropagation();
    this.selectionService.selectPlot(plotId);
  }
}
