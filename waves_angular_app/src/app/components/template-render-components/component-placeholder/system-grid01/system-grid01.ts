import {
  Component, Input, OnChanges, SimpleChanges,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule, NgComponentOutlet } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule, NzIconService } from 'ng-zorro-antd/icon';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { resolvePlotComponent } from '../../plots-new/dynamic-component-registry';
import { icons } from '../../icons-provider';
import { TemplateSelectionService } from '../../../../services/template-selection.service';
// ─── Shared resolver helper ───────────────────────────────────────────────────
function resolveTableData(rawLiveData: any, mappedField: string): any[] {
  return rawLiveData?.tables?.find((t: any) => t.name === mappedField)?.value ?? [];
}

@Component({
  selector: 'app-system-grid01-v2',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NgComponentOutlet, NzCardModule, NzIconModule, NzEmptyModule],
  templateUrl: './system-grid01.html',
  styleUrl: './system-grid01.css',
})
export class SystemGrid01 implements OnChanges {
  @Input() plots: any[] = [];
  @Input() rawLiveData: any;
  @Input() sectionId?: string;

  constructor(private iconService: NzIconService, public selectionService: TemplateSelectionService) {
    this.iconService.addIcon(...icons);
  }

  private dataCache = new Map<string, any[]>();
  activeActionMenuPlotId: string | null = null;

  ngOnChanges(c: SimpleChanges): void {
    if (c['rawLiveData'] || c['plots']) this.dataCache.clear();
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

  toggleActionMenu(plotId: string, event: MouseEvent): void {
    event.stopPropagation();
    this.activeActionMenuPlotId = this.activeActionMenuPlotId === plotId ? null : plotId;
  }

  toggleFullscreen(plotId: string, event: MouseEvent): void {
    event.stopPropagation();
    const card = (event.currentTarget as HTMLElement).closest('.sg01-card');
    if (!card) {
      return;
    }
    if (!document.fullscreenElement) {
      card.requestFullscreen?.().catch(() => { });
    } else {
      document.exitFullscreen?.();
    }
  }

  openCollab(plot: any): void {
    console.log('Collab action:', plot);
  }
}
