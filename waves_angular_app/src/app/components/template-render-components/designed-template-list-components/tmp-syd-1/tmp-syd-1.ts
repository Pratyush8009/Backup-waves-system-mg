import { Component, Input } from '@angular/core';
import { CommonModule, NgComponentOutlet } from '@angular/common';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzIconModule, NzIconService } from 'ng-zorro-antd/icon';
import { resolveGridComponent } from '../../plots-new/dynamic-component-registry';
import { TemplateSection } from '../../template-service';
import { icons } from '../../icons-provider';
import { TemplateSelectionService } from '../../../../services/template-selection.service'; 

@Component({
  selector: 'app-tmp-syd-1',
  imports: [CommonModule, NgComponentOutlet, NzEmptyModule, NzTagModule, NzIconModule],
  templateUrl: './tmp-syd-1.html',
  styleUrl: './tmp-syd-1.css',
})
export class TmpSyd1 {
  @Input() name?: string;
  @Input() sections: TemplateSection[] = [];
  @Input() rawLiveData: any;

  readonly icon = 'apartment';
  readonly badgeLabel = 'SYSTEM TEMPLATE';

  constructor(private iconService: NzIconService,public selectionService: TemplateSelectionService) {
    this.iconService.addIcon(...icons);
  }

  getGridComponent(gridId: string) {
    return resolveGridComponent(gridId);
  }
  onSectionClick(sectionId: string): void {
    this.selectionService.selectSection(sectionId);
  }
}
