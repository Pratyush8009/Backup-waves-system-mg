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
  templateUrl: './system-page.html',
  styleUrl: './system-page.css',
})
export class SystemPage implements OnInit {
  systemId!: string;
  userId = "6994521938cd90f90d351ad0";
  unitId!: string;
  currentPage: string = 'Overview'; // Track the breadcrumb state

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.unitId = params.get('id') || '';
      this.systemId = params.get('systemId') || '';
      this.updateCurrentPage(this.router.url);
    });

    // Listen to route changes to update breadcrumbs automatically
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.updateCurrentPage(event.url);
    });
  }

  // Helper to determine which breadcrumb to show based on URL
  updateCurrentPage(url: string) {
    if (url.includes('/models')) this.currentPage = 'Models';
    else if (url.includes('/analysis')) this.currentPage = 'Analysis';
    else if (url.includes('/configure')) this.currentPage = 'Configure';
    else if (url.includes('/upload')) this.currentPage = 'Upload';
    else if (url.includes('/template')) this.currentPage = 'Template';
    else this.currentPage = 'Overview';
  }

  viewModelPage() {
    this.router.navigate([`/units/${this.unitId}/systems/${this.systemId}/models`]);
  }
  viewAnalysisPage() {
    this.router.navigate([`/units/${this.unitId}/systems/${this.systemId}/analysis`]);
  }
  systemOverviewPage() {
    this.router.navigate([`/units/${this.unitId}/systems/${this.systemId}/`]);
  }
  viewFileUploadPage() {
    this.router.navigate([`/units/${this.unitId}/systems/${this.systemId}/upload`]);
  }
  viewConfigurationPage() {
    this.router.navigate([`/units/${this.unitId}/systems/${this.systemId}/configure`]);
  }
  templateConfigurationPage() {
    this.router.navigate([`/units/${this.unitId}/systems/${this.systemId}/template`]);
  }
  goBackToUnit() {
    this.router.navigate([`/user/${this.userId}/units/${this.unitId}`]);
  }
}