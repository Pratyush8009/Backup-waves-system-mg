import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Observable, map } from 'rxjs';
import { TemplateRenderer } from '../../template-renderer/template-renderer';

@Component({
  selector: 'app-render-template-only',
  imports: [CommonModule, RouterModule, TemplateRenderer],
  templateUrl: './render-template-only.html',
  styleUrl: './render-template-only.css',
})
export class RenderTemplateOnly {
  templateId$: Observable<string>;

  constructor(private route: ActivatedRoute) {
    this.templateId$ = this.route.paramMap.pipe(map(params => params.get('templateId') ?? ''));
  }
}
