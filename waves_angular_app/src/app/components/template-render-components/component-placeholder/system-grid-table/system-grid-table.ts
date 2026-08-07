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
  selector: 'app-system-grid-table-v2',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NzCardModule, NzIconModule, NzEmptyModule],
  templateUrl: './system-grid-table.html',
  styleUrl: './system-grid-table.css',
})
export class SystemGridTable {
 @Input() plots:       any[] = [];
  @Input() rawLiveData: any;
  activeActionMenuPlotId: string | null = null;
 
  resolveData(mappedField: string): any[] {
    return resolveTableData(this.rawLiveData, mappedField);
  }
 
  getColumns(plot: any, data: any[]): string[] {
    return plot.metadata?.columns ?? Object.keys(data[0] ?? {});
  }

  toggleActionMenu(plotId: string, event: MouseEvent): void {
    event.stopPropagation();
    this.activeActionMenuPlotId = this.activeActionMenuPlotId === plotId ? null : plotId;
  }

  toggleFullscreen(plotId: string, event: MouseEvent): void {
    event.stopPropagation();
    const card = (event.currentTarget as HTMLElement).closest('.sgt-card');
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
