import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Observable, map } from 'rxjs';
import { TemplateRenderer } from '../../template-renderer/template-renderer';

@Component({
  selector: 'app-render-template-with-plots-configuration-with-feed-data',
  imports: [CommonModule, RouterModule, TemplateRenderer],
  templateUrl: './render-template-with-plots-configuration-with-feed-data.html',
  styleUrl: './render-template-with-plots-configuration-with-feed-data.css',
})
export class RenderTemplateWithPlotsConfigurationWithFeedData {
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
