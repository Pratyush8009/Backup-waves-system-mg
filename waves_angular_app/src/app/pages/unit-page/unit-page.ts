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
  templateUrl: './unit-page.html',
  styleUrl: './unit-page.css',
})
export class UnitPage implements OnInit {
  userId!: string;
  unitId!: string;
  currentPage: string = 'Overview'; // Track the breadcrumb state

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.userId = params.get('id') || '';
      this.unitId = params.get('unitId') || '';
      this.updateCurrentPage(this.router.url);
    });

    // Listen to route changes to update breadcrumbs automatically
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.updateCurrentPage(event.url);
    });
    console.log("THE UNIT ID AND USER ID IN UNIT PAGE 2 ARE", this.userId, this.unitId)
  }

  // Helper to determine which breadcrumb to show based on URL
  updateCurrentPage(url: string) {
    if (url.includes('/configuration')) this.currentPage = 'Configuration';
    else if (url.includes('/systems')) this.currentPage = 'System';
    else if (url.includes('/subscription')) this.currentPage = 'Subscription';
    else if (url.includes('/billings')) this.currentPage = 'Billings';
    else this.currentPage = 'Overview';
  }

  unitOverviewPage() {
    this.router.navigate([`/user/${this.userId}/units/${this.unitId}`]);
  }
  unitSystemsPage() {
    this.router.navigate([`/user/${this.userId}/units/${this.unitId}/systems`]);
  }

  unitConfigurationPage() {
    this.router.navigate([`/user/${this.userId}/units/${this.unitId}/configuration`]);
  }

  goBackToUnits() {
    this.router.navigate([`/units/${this.userId}`]);
  }
}