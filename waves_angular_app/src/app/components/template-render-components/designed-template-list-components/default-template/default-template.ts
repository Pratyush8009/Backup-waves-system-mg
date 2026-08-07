import { Component, Input } from '@angular/core';
import { CommonModule, NgComponentOutlet } from '@angular/common';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { resolveGridComponent } from '../../plots-new/dynamic-component-registry';
import { TemplateSection } from '../../template-service';

/**
 * Fallback / generic section-based template renderer.
 * Used whenever a uiTemplateId does not match a specifically designed
 * template component, and also directly by any template whose layout is
 * just "render every section through its own grid" with no extra design.
 */
@Component({
  selector: 'app-default-template',
  imports: [CommonModule, NgComponentOutlet, NzEmptyModule, NzTagModule],
  templateUrl: './default-template.html',
  styleUrl: './default-template.css',
})
export class DefaultTemplate {
  @Input() name?: string;
  @Input() sections: TemplateSection[] = [];
  @Input() rawLiveData: any;

  getGridComponent(gridId: string) {
    return resolveGridComponent(gridId);
  }
}
