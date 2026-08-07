// analysis-overview.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AnalysisService } from '../../../services/analysis.service';

interface AnalysisDetails {
  id: string;
  systemId: string;
  name: string;
  description: string;
  version: string;
  stage: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  metadata: {
    analysisType: string;
    frequency: string;
    tags: string[];
  };
  uploadedFiles: UploadedFile[];
  pipelineId: string;
  collaboration: Collaboration;
  transactionLogs: TransactionLog[];
  currentVersion: string;
  versionHistory: VersionHistory[];
}

interface UploadedFile {
  fileId: string;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
  uploadedBy: string;
  status: string;
  recordCount: number;
}

interface Collaboration {
  sharedWith: SharedWith[];
  comments: Comment[];
}

interface SharedWith {
  userId: string;
  role: string;
  sharedAt: string;
}

interface Comment {
  id: string;
  userId: string;
  comment: string;
  createdAt: string;
}

interface TransactionLog {
  id: string;
  action: string;
  performedBy: string;
  timestamp: string;
  details: any;
}

interface VersionHistory {
  version: string;
  createdAt: string;
  changeType: string;
  changes: string;
  createdBy: string;
}

interface AnalysisSummary {
  analysisId: string;
  pipelineId: string;
  executionId: string;
  executionStatus: string;
  summary: {
    signalProcessing: {
      originalSignalLength: number;
      samplingRate: string;
      duration: string;
      filtersApplied: string[];
    };
    noiseReduction: {
      originalSNR: string;
      smaFilteredSNR: string;
      sgFilteredSNR: string;
      improvementSMA: string;
      improvementSG: string;
    };
    statisticalComparison: {
      original: StatisticalMetrics;
      smaFiltered: StatisticalMetrics;
      sgFiltered: StatisticalMetrics;
    };
    recommendation: string;
  };
  completedAt: string;
  generatedArtifacts: Artifact[];
}

interface StatisticalMetrics {
  mean: number;
  std: number;
  min: number;
  max: number;
  median: number;
}

interface Artifact {
  type: string;
  name: string;
  size: string;
  url: string;
}

interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
  metadata: any;
  requestId: string;
  timestamp: string;
}

@Component({
  selector: 'app-analysis-overview',
  standalone: true,
  imports: [
    CommonModule,
    NzSpinModule,
    NzTagModule,
    NzDividerModule,
    NzIconModule,
    NzTableModule,
    NzBadgeModule,
    NzCardModule,
    NzButtonModule,
    NzProgressModule
  ],
  templateUrl: './analysis-overview.html',
  styleUrls: ['./analysis-overview.css']
})
export class AnalysisOverview implements OnInit {
  loading = false;
  analysisDetails: AnalysisDetails | null = null;
  analysisSummary: AnalysisSummary | null = null;

  // Route parameters
  unitId: string = '';
  systemId: string = '';
  analysisId: string = '';

  constructor(
    private route: ActivatedRoute,
    private analysisService: AnalysisService,
    private message: NzMessageService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.unitId = params.get('unitId') || '';
      this.systemId = params.get('systemId') || '';
      this.analysisId = params.get('analysisId') || '';

      console.log("Unit Id in analysis overview:", this.unitId);
      console.log("System Id in analysis overview:", this.systemId);
      console.log("Analysis Id in analysis overview:", this.analysisId);

      if (this.unitId && this.systemId && this.analysisId) {
        this.loadAnalysisDetails();
        this.loadAnalysisSummary();
      } else {
        this.message.error('Missing required parameters: unitId, systemId, or analysisId');
        this.loading = false;
      }
    });
  }

  loadAnalysisDetails(): void {
    this.loading = true;

    console.log(`Fetching analysis details for unitId: ${this.unitId}, systemId: ${this.systemId}, analysisId: ${this.analysisId}`);

    this.analysisService.getAnalysis(this.unitId, this.systemId, this.analysisId).subscribe({
      next: (response: ApiResponse<AnalysisDetails>) => {
        console.log('Analysis Details API Response:', response);

        if (response.code === 200 && response.data) {
          this.analysisDetails = response.data;
        } else {
          this.message.error(response.message || 'Failed to load analysis details');
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading analysis details:', error);
        this.message.error(error.message || 'Failed to load analysis details from server');
        this.loading = false;
      }
    });
  }

  loadAnalysisSummary(): void {
    console.log(`Fetching analysis summary for unitId: ${this.unitId}, systemId: ${this.systemId}, analysisId: ${this.analysisId}`);

    this.analysisService.getAnalysisSummary(this.unitId, this.systemId, this.analysisId).subscribe({
      next: (response: ApiResponse<AnalysisSummary>) => {
        console.log('Analysis Summary API Response:', response);

        if (response.code === 200 && response.data) {
          this.analysisSummary = response.data;
        } else {
          console.warn('No summary data available:', response.message);
          // Don't show error message as summary might not be available for all analyses
        }
      },
      error: (error) => {
        console.error('Error loading analysis summary:', error);
        // Don't show error message as summary might not be available for all analyses
      }
    });
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatFileSize(bytes: number): string {
    if (!bytes) return 'N/A';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
  }

  getSNRImprovementPercent(): number {
    if (!this.analysisSummary) return 0;
    const original = parseFloat(this.analysisSummary.summary.noiseReduction.originalSNR);
    const improved = parseFloat(this.analysisSummary.summary.noiseReduction.sgFilteredSNR);
    return Math.round(((improved - original) / original) * 100);
  }

  refreshData(): void {
    if (this.unitId && this.systemId && this.analysisId) {
      this.loadAnalysisDetails();
      this.loadAnalysisSummary();
    }
  }
}