import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core'; // 1. Added NgZone
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// NG-ZORRO Imports
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzMessageService } from 'ng-zorro-antd/message';

import { UnitService } from '../../../services/unit.service';

@Component({
  selector: 'app-unit-overview',
  standalone: true,
  imports: [
    CommonModule, FormsModule, NzTabsModule, NzSwitchModule, NzAvatarModule,
    NzProgressModule, NzIconModule, NzPageHeaderModule, NzBreadCrumbModule,
    NzTagModule, NzTooltipModule, NzSpinModule, DatePipe
  ],
  templateUrl: './unit-overview.html',
  styleUrls: ['./unit-overview.css']
})
export class UnitOverview implements OnInit {
  userId: string = '';
  unitId: string = '';
  isLoading: boolean = true;

  unitData: any = {};
  subscriptionData: any = {};
  members: any[] = [];
  systems: any = { system_list: [], summary: { active: 0, totalModels: 0, totalAnalyses: 0 } };
  usageStats: any = { api: {}, storage: {} };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private unitService: UnitService,
    private message: NzMessageService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone // 2. Inject NgZone
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.userId = params.get('id') || '';
      this.unitId = params.get('unitId') || '';
      if (this.unitId) {
        this.fetchUnitDetails();
      }
    });
  }

  fetchUnitDetails(): void {
    this.isLoading = true;

    this.unitService.getUnitById(this.unitId).subscribe({
      next: (res) => {
        // 3. Wrap EVERYTHING in ngZone.run()
        this.ngZone.run(() => {
          const d = res.data as any;

          this.unitData = {
            ...d.unitMetadata,
            createdByName: d.unitMetadata?.createdByName || 'System',
            updatedByName: d.unitMetadata?.updatedByName || 'System'
          };

          this.subscriptionData = d.subscription;

          this.usageStats = {
            api: {
              percentageUsed: d.usageStats.api.percentageUsed,
              total: (d.usageStats.api.totalCalls / 1000000).toFixed(1) + 'M',
              limit: (d.usageStats.api.limit / 1000000).toFixed(0) + 'M'
            },
            storage: {
              percentageUsed: d.usageStats.dataStorage.percentageUsed,
              used: d.usageStats.dataStorage.used + ' GB',
              limit: d.usageStats.dataStorage.limit + ' GB'
            }
          };

          this.systems = {
            system_list: d.systems.systemsList,
            summary: {
              active: d.systems.systemSummary.activeCount,
              totalModels: d.systems.systemSummary.totalModelsAcrossAllSystems,
              totalAnalyses: d.systems.systemSummary.totalAnalysesAcrossAllSystems
            }
          };

          this.members = d.members.membersList.map((m: any) => ({
            ...m,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name)}&background=random`
          }));

          this.isLoading = false;
          
          // Force a final check just to be 100% sure
          this.cdr.markForCheck();
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        this.ngZone.run(() => {
          this.isLoading = false;
          this.message.error("Failed to load unit details");
          this.cdr.detectChanges();
        });
      }
    });
  }

  goBack() {
    this.router.navigate([`/user/${this.userId}/units`]);
  }
}