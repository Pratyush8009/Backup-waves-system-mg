import {
  Component, Input, OnChanges, SimpleChanges,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule, NgComponentOutlet } from '@angular/common';
import { NzCardModule }   from 'ng-zorro-antd/card';
import { NzIconModule }   from 'ng-zorro-antd/icon';
import { NzEmptyModule }  from 'ng-zorro-antd/empty';
import { resolvePlotComponent } from '../../plots-new/dynamic-component-registry';
 
// ─── Shared resolver helper ───────────────────────────────────────────────────
function resolveTableData(rawLiveData: any, mappedField: string): any[] {
  return rawLiveData?.tables?.find((t: any) => t.name === mappedField)?.value ?? [];
}


@Component({
  selector: 'app-analysis-grid01-v2',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NgComponentOutlet, NzCardModule, NzIconModule, NzEmptyModule],
  templateUrl: './analysis-grid01.html',
  styleUrl: './analysis-grid01.css',
})
export class AnalysisGrid01 {
 @Input() plots:       any[] = [];
  @Input() rawLiveData: any;
 
  activeActionMenuPlotId: string | null = null;

  getPlotComponent(chartType: string) { return resolvePlotComponent(chartType); }
 
  resolveData(mappedField: string): any[] {
    return resolveTableData(this.rawLiveData, mappedField);
  }

  toggleActionMenu(plotId: string, event: MouseEvent): void {
    event.stopPropagation();
    this.activeActionMenuPlotId = this.activeActionMenuPlotId === plotId ? null : plotId;
  }

  toggleFullscreen(plotId: string, event: MouseEvent): void {
    event.stopPropagation();
    const card = (event.currentTarget as HTMLElement).closest('.ag01-card');
    if (!card) {
      return;
    }
    if (!document.fullscreenElement) {
      card.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.();
    }
  }

  openCollab(plot: any): void {
    console.log('Collab action:', plot);
  }
}