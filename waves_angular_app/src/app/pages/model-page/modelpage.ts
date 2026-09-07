import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { RouterModule, Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-system-page',
  standalone: true,
  imports: [
    CommonModule,
    NzLayoutModule,
    NzMenuModule,
    NzIconModule,
    NzButtonModule,
    RouterModule
  ],
  templateUrl: './model-page.html',
  styleUrl: './model-page.css',
})
export class ModelPage implements OnInit {
  systemId!: string;
  unitId!: string;
  modelId!: string;

  isConfigOpen = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.systemId = params.get('systemId') || '';
      this.unitId = params.get('unitId') || '';
      this.modelId = params.get('modelId') || '';

      this.checkConfigSubMenu(this.router.url);
    });

    // Auto-expand Configuration sub-menu if route matches on load/navigation
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.checkConfigSubMenu(event.urlAfterRedirects || event.url);
    });
  }

  private checkConfigSubMenu(url: string) {
    if (url.includes('/configuration') || url.includes('/schema') || url.includes('/template')) {
      this.isConfigOpen = true;
    }
  }

  // --- Navigation Methods ---

  navigateToOverview() {
    this.router.navigate([`/units/${this.unitId}/systems/${this.systemId}/models/${this.modelId}/`]);
  }

  navigateToEditor() {
    this.router.navigate([`/units/${this.unitId}/systems/${this.systemId}/models/${this.modelId}/editor`]);
  }

  navigateToConfigSchema() {
    this.router.navigate([`/units/${this.unitId}/systems/${this.systemId}/models/${this.modelId}/schema`]);
  }

  navigateToConfigTemplate() {
    this.router.navigate([`/units/${this.unitId}/systems/${this.systemId}/models/${this.modelId}/template`]);
  }

  navigateToConfigSettings() {
    this.router.navigate([`/units/${this.unitId}/systems/${this.systemId}/models/${this.modelId}/configuration`]);
  }

  navigateToTesting() {
    this.router.navigate([`/units/${this.unitId}/systems/${this.systemId}/models/${this.modelId}/testing`]);
  }

  navigateToDeploy() {
    this.router.navigate([`/units/${this.unitId}/systems/${this.systemId}/models/${this.modelId}/deploy`]);
  }

  goBackToUnits() {
    this.router.navigate([`/units/${this.unitId}/systems/${this.systemId}/models`]);
  }
}