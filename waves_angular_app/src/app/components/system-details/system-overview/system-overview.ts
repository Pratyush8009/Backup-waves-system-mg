import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SystemService, SystemDetail, ApiResponse } from '../../../services/system.service';

import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzEmptyModule } from 'ng-zorro-antd/empty';

@Component({
  selector: 'app-system-overview',
  standalone: true,
  imports: [
    CommonModule, NzCardModule, NzTagModule, NzIconModule, 
    NzProgressModule, NzDividerModule, NzSpinModule, NzEmptyModule, DecimalPipe
  ],
  templateUrl: './system-overview.html',
  styleUrl: './system-overview.css'
})
export class SystemOverview implements OnInit {
  loading = true;
  
  // Data containers
  system: any = {};
  models: any[] = [];
  analysis: any[] = [];
  usage: any = {
    apiCalls: 0,
    storage: "0 GB",
    apiPercent: 0,
    storagePercent: 0,
    alerts: { critical: 0, warning: 0, low: 0 }
  };
  activities: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private systemService: SystemService,
    private message: NzMessageService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    /** * NOTE: Since SystemOverview is a child of 'unit/:id/system/:systemId',
     * we access parameters from the 'parent' route.
     * We use 'id' to match your route definition: path: 'unit/:id...'
     */
    const parentParams = this.route.parent?.snapshot.paramMap;
    const unitId = parentParams?.get('id'); 
    const systemId = parentParams?.get('systemId');

    if (unitId && systemId) {
      this.fetchSystemDetails(unitId, systemId);
    } else {
      this.loading = false;
      this.message.error("Route parameters 'id' or 'systemId' are missing.");
    }
  }

  fetchSystemDetails(unitId: string, systemId: string) {
    this.loading = true;
    this.systemService.getSystemById(unitId, systemId).subscribe({
      next: (res: ApiResponse<SystemDetail>) => {
        const data = res.data;

        // 1. Map System Metadata
        this.system = {
          name: data.systemMetadata.name,
          id: data.systemMetadata.id,
          unitId: data.systemMetadata.unitId,
          activeVersion: 'v' + (data.models.modelsList[0]?.currentVersion || '1.0.0'),
          userId: data.systemMetadata.createdByName || 'Admin',
          createdAt: new Date(data.systemMetadata.createdAt).toLocaleDateString(),
          updatedAt: new Date(data.systemMetadata.updatedAt).toLocaleDateString(),
          description: data.systemMetadata.description,
          uptime: data.systemMetadata.uptime,
          status: data.systemMetadata.status
        };

        // 2. Map Models
        this.models = data.models.modelsList.map(m => ({
          name: m.name,
          version: m.currentVersion,
          desc: m.description,
          status: m.currentStatus === 'ACTIVE' ? 'Active' : 'Inactive',
          flow: m.stats?.successRate || 0
        }));

        // 3. Map Analysis
        this.analysis = data.analyses.analysesList.map(a => ({
          name: a.name,
          version: a.currentVersion,
          desc: a.description,
          status: a.currentStatus === 'ACTIVE' ? 'Active' : 'Inactive'
        }));

        // 4. Map Usage Stats
        this.usage = {
          apiCalls: data.usageStats.api.totalCalls,
          storage: `${data.usageStats.dataStorage.used} ${data.usageStats.dataStorage.unit}`,
          apiPercent: data.usageStats.api.percentageUsed,
          storagePercent: data.usageStats.dataStorage.percentageUsed,
          alerts: { 
            critical: data.usageStats.executions.modelExecutions.failed, 
            warning: data.usageStats.systemHealth.warningCount, 
            low: data.activityLogs.activitySummary.today.errors 
          }
        };

        // 5. Map Activities
        this.activities = data.activityLogs.activitiesList.slice(0, 5).map((act: { timestamp: string | number | Date; action: any; userName: any; severity: string; type: string; }) => ({
          time: new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          title: act.action,
          sub: act.userName || 'System Auto-Task',
          color: this.getActivityColor(act.severity),
          icon: this.getActivityIcon(act.type)
        }));

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.message.error("Failed to load system details from server");
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private getActivityColor(severity: string): string {
    switch (severity) {
      case 'CRITICAL': return '#f5222d';
      case 'HIGH': return '#fa8c16';
      case 'MEDIUM': return '#1890ff';
      default: return '#d9d9d9';
    }
  }

  private getActivityIcon(type: string): string {
    switch (type) {
      case 'EXECUTION': return 'play-circle';
      case 'ALERT': return 'warning';
      case 'CONFIGURATION': return 'setting';
      default: return 'info-circle';
    }
  }
}