import { Component, Input } from '@angular/core';
import { CommonModule, NgComponentOutlet } from '@angular/common';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzIconModule, NzIconService } from 'ng-zorro-antd/icon';
import { resolveGridComponent } from '../../plots-new/dynamic-component-registry';
import { TemplateSection } from '../../template-service';
import { icons } from '../../icons-provider';

@Component({
  selector: 'app-tmp-analysis-1',
  imports: [CommonModule, NgComponentOutlet, NzEmptyModule, NzTagModule, NzIconModule],
  templateUrl: './tmp-analysis-1.html',
  styleUrl: './tmp-analysis-1.css',
})
export class TmpAnalysis1 {
  @Input() name?: string;
  @Input() sections: TemplateSection[] = [];
  @Input() rawLiveData: any;

  readonly icon = 'pie-chart';
  readonly badgeLabel = 'ANALYSIS TEMPLATE';

  constructor(private iconService: NzIconService) {
    this.iconService.addIcon(...icons);
  }

  getGridComponent(gridId: string) {
    return resolveGridComponent(gridId);
  }
}
