import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Required for *ngIf
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb'; // Added Breadcrumb module
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
    NzBreadCrumbModule,
    RouterModule
  ],
  templateUrl: './model-page.html',
  styleUrl: './model-page.css',
})
export class ModelPage implements OnInit {
  systemId!: string;
  unitId!: string;
  modelId!: string;
  currentPage: string = 'Overview'; // Track the breadcrumb state

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.systemId = params.get('systemId') || '';
      this.unitId = params.get('unitId') || '';
      this.modelId = params.get('modelId') || '';

      this.updateCurrentPage(this.router.url);
    });

    // Listen to route changes to update breadcrumbs automatically
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.updateCurrentPage(event.url);
    });
    console.log("THE UNIT ID AND USER ID IN UNIT PAGE 2 ARE", this.systemId, this.unitId, this.modelId)
  }

  // Helper to determine which breadcrumb to show based on URL
  updateCurrentPage(url: string) {
    if (url.includes('/configuration')) this.currentPage = 'Configuration';
    else if (url.includes('/testing')) this.currentPage = 'Testing';
    else if (url.includes('/editor')) this.currentPage = 'Editor';
    else if (url.includes('/deploy')) this.currentPage = 'Deploy';
    else if (url.includes('/template')) this.currentPage = 'Template';
    else this.currentPage = 'Overview';
  }

  modelOverviewPage() {
    this.router.navigate([`/units/${this.unitId}/systems/${this.systemId}/models/${this.modelId}/`]);
  }
  modeleditorPage() {
    this.router.navigate([`/units/${this.unitId}/systems/${this.systemId}/models/${this.modelId}/editor`]);
  }

  modelConfigurationPage() {
    this.router.navigate([`/units/${this.unitId}/systems/${this.systemId}/models/${this.modelId}/configuration`]);
  }
  modelTemplateConfigurationPage() {
    this.router.navigate([`/units/${this.unitId}/systems/${this.systemId}/models/${this.modelId}/template`]);
  }
  modelTestingPage() {
    this.router.navigate([`/units/${this.unitId}/systems/${this.systemId}/models/${this.modelId}/testing`]);
  }
  modelDeployPage() {
    this.router.navigate([`/units/${this.unitId}/systems/${this.systemId}/models/${this.modelId}/deploy`]);
  }
  goBackToUnits() {
    this.router.navigate([`/units/${this.unitId}/systems/${this.systemId}/models`]);
  }
}