import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Observable, map } from 'rxjs';
import { TemplateRenderer } from '../../template-renderer/template-renderer';

@Component({
  selector: 'app-render-template-with-plots-configuration',
  imports: [CommonModule, RouterModule, TemplateRenderer],
  templateUrl: './render-template-with-plots-configuration.html',
  styleUrl: './render-template-with-plots-configuration.css',
})
export class RenderTemplateWithPlotsConfiguration {
  entityId$: Observable<string>;
  templateId$: Observable<string>;

  constructor(private route: ActivatedRoute) {
    this.entityId$ = this.route.paramMap.pipe(
      map((params) => params.get('entityId') ?? ''),
    );
    this.templateId$ = this.route.paramMap.pipe(
      map((params) => params.get('templateId') ?? ''),
    );
  }
}
