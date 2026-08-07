import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { TemplateService, TemplateSummary, EntitySummary } from '../../template-service';

@Component({
  selector: 'app-landing-pages-for-all-template-page',
  imports: [
    CommonModule,
    RouterModule,
    NzCardModule,
    NzTagModule,
    NzButtonModule,
    NzEmptyModule,
    NzSpinModule,
  ],
  templateUrl: './landing-pages-for-all-template-page.html',
  styleUrl: './landing-pages-for-all-template-page.css',
})
export class LandingPagesForAllTemplatePage implements OnInit {
  templates = signal<TemplateSummary[]>([]);
  entities = signal<EntitySummary[]>([]);
  loading = signal(true);

  constructor(private templateService: TemplateService) {}

  ngOnInit(): void {
    forkJoin({
      templates: this.templateService.getTemplatesList(),
      entities: this.templateService.getEntitiesList(),
    })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe(({ templates, entities }) => {
        this.templates.set(templates);
        this.entities.set(entities);
      });
  }
}
