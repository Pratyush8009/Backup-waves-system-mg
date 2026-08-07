import { Component, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Logs, FlowLog } from '../../logs/logs';

export type DeploymentStatus = 'idle' | 'processing' | 'live' | 'failed';

export interface DeploymentHistoryItem {
  id: string;
  modelName: string;
  deploymentId: string;
  version: string;
  status: 'success' | 'failed';
  timestamp: string;
}

@Component({
  selector: 'app-model-deploy',
  standalone: true,
  imports: [
    CommonModule,
    NzButtonModule,
    NzTagModule,
    NzCardModule,
    NzIconModule,
    Logs
  ],
  templateUrl: './model-deploy.html',
  styleUrl: './model-deploy.css'
})
export class ModelDeploy implements OnDestroy {
  version = 'V2.0.1';
  deploymentId = 'srv-d97kfld7vvec73cdg7q0';
  status: DeploymentStatus = 'idle';

  currentLogs: FlowLog[] = [];
  private checkInterval: ReturnType<typeof setInterval> | null = null;

  // Deployment history matching your screenshot design
  deploymentHistory: DeploymentHistoryItem[] = [
    {
      id: 'h-1',
      modelName: 'Production Line 1 Model',
      deploymentId: 'srv-d97kfld7vvec73cdg7q0',
      version: 'V1.0.2',
      status: 'success',
      timestamp: 'July 9,2026 at 12:33 PM'
    },
    {
      id: 'h-2',
      modelName: 'Production Line 1 Model',
      deploymentId: 'srv-d97kfld7vvec73cdg7q0',
      version: 'V1.0.1',
      status: 'failed',
      timestamp: 'July 8,2026 at 10:33 PM'
    },
    {
      id: 'h-3',
      modelName: 'Production Line 1 Model',
      deploymentId: 'srv-d97kfld7vvec73cdg7q0',
      version: 'V1.0.3',
      status: 'success',
      timestamp: 'July 9,2026 at 12:33 PM'
    }
  ];

  private mockLogs: FlowLog[] = [
    { timestamp: new Date(), level: 'INFO', message: 'Validationg system.' },
    { timestamp: new Date(), level: 'INFO', message: 'Validating model...' },
    { timestamp: new Date(), level: 'INFO', message: 'Validation Model configuration...' },
    { timestamp: new Date(), level: 'WARNING', message: 'Validationg template configuration...' },
    { timestamp: new Date(), level: 'INFO', message: 'Connecting to production inference endpoint...' },
    { timestamp: new Date(), level: 'INFO', message: 'Connecting to production inference endpoint...' },
    { timestamp: new Date(), level: 'SUCCESS', message: 'Model Deployed successfully.' },
    // { timestamp: new Date(), level: 'ERROR', message: 'Model Deployment Faild.' }

  ];

  constructor(private cdr: ChangeDetectorRef) { }

  onDeploy(): void {
    this.stopStatusCheck();

    this.status = 'processing';

    // 1. Pass deep-copied logs so Logs component's ngOnChanges triggers
    this.currentLogs = this.mockLogs.map(log => ({ ...log, timestamp: new Date() }));

    // 2. Add extra buffer time to total log animation (logs.ts interval is 2000ms per item)
    const logInterval = 2000;
    const totalLogTime = (this.mockLogs.length + 1) * logInterval;
    const startTime = Date.now();

    // 3. Poll until total animation time has elapsed, ensuring last line is rendered
    this.checkInterval = setInterval(() => {
      const elapsedTime = Date.now() - startTime;

      if (elapsedTime >= totalLogTime) {
        const hasError = this.currentLogs.some(log => log.level === 'ERROR');
        this.status = hasError ? 'failed' : 'live';

        // Add newly completed deployment to history list top
        this.deploymentHistory.unshift({
          id: 'h-' + Date.now(),
          modelName: 'Production Line 1 Model',
          deploymentId: this.deploymentId,
          version: this.version,
          status: hasError ? 'failed' : 'success',
          timestamp: new Date().toLocaleString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
          })
        });

        this.stopStatusCheck();
        this.cdr.detectChanges(); // Force view update once complete
      }
    }, 500);
  }

  getStatusColor(status: DeploymentStatus): string {
    switch (status) {
      case 'live': return 'success';
      case 'processing': return 'processing';
      case 'failed': return 'error';
      default: return 'default';
    }
  }

  private stopStatusCheck(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  ngOnDestroy(): void {
    this.stopStatusCheck();
  }
}