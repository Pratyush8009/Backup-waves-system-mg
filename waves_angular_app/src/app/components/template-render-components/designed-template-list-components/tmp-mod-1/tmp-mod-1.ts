import { Component, Input } from '@angular/core';
import { CommonModule, NgComponentOutlet } from '@angular/common';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzIconModule, NzIconService } from 'ng-zorro-antd/icon';
import { resolveGridComponent } from '../../plots-new/dynamic-component-registry';
import { TemplateSection } from '../../template-service';
import { icons } from '../../icons-provider';
@Component({
  selector: 'app-tmp-mod-1',
  imports: [CommonModule, NgComponentOutlet, NzEmptyModule, NzTagModule, NzIconModule],
  templateUrl: './tmp-mod-1.html',
  styleUrl: './tmp-mod-1.css',
})
export class TmpMod1 {
  @Input() name?: string;
  @Input() sections: TemplateSection[] = [];
  @Input() rawLiveData: any;

  readonly icon = 'dashboard';
  readonly badgeLabel = 'MODEL TEMPLATE';

  constructor(private iconService: NzIconService) {
    this.iconService.addIcon(...icons);
  }

  getGridComponent(gridId: string) {
    return resolveGridComponent(gridId);
  }
}
