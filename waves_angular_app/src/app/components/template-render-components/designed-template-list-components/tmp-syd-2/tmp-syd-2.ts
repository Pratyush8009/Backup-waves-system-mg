import { Component, Input } from '@angular/core';
import { CommonModule, NgComponentOutlet } from '@angular/common';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzIconModule, NzIconService } from 'ng-zorro-antd/icon';
import { resolveGridComponent } from '../../plots-new/dynamic-component-registry';
import { TemplateSection } from '../../template-service';
import { icons } from '../../icons-provider';

/**
 * Distinct visual design for `tmp-syd-2` ("System Template 2").
 * Intentionally styled differently from TmpSyd1 — a compact, numbered-panel
 * layout with an amber accent — so the two system templates are visually
 * distinguishable when rendered side by side for the same entity.
 */
@Component({
  selector: 'app-tmp-syd-2',
  imports: [
    CommonModule,
    NgComponentOutlet,
    NzEmptyModule,
    NzTagModule,
    NzIconModule,
  ],
  templateUrl: './tmp-syd-2.html',
  styleUrl: './tmp-syd-2.css',
})
export class TmpSyd2 {
  @Input() name?: string;
  @Input() sections: TemplateSection[] = [];
  @Input() rawLiveData: any;

  readonly icon = 'thunderbolt';
  readonly badgeLabel = 'SYSTEM TEMPLATE · V2';

  constructor(private iconService: NzIconService) {
    this.iconService.addIcon(...icons);
  }

  getGridComponent(gridId: string) {
    return resolveGridComponent(gridId);
  }
}
