import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';

// Service & Interfaces
import { ModelService, ModelDetails, ModelSummary } from '../../../services/model.service';

// Ng-Zorro Imports
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'app-model-overview',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    NzCardModule, 
    NzDividerModule, 
    NzTagModule,
    NzIconModule, 
    NzSpinModule, 
    NzButtonModule, 
    NzBadgeModule, 
    NzTableModule,
    NzProgressModule,
    NzTooltipModule
  ],
  templateUrl: './model-overview.html',
  styleUrl: './model-overview.css'
})
export class ModelOverview implements OnInit {
  unitId: string = '';
  systemId: string = '';
  modelId: string = '';

  loading = true;
  modelData: ModelDetails | null = null;
  modelSummary: ModelSummary | null = null;

  constructor(
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private message: NzMessageService,
    private modelService: ModelService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.unitId = params.get('unitId') || '';
      this.systemId = params.get('systemId') || '';
      this.modelId = params.get('modelId') || '';

      if (this.unitId && this.systemId && this.modelId) {
        this.fetchAllData();
      } else {
        this.message.warning('Invalid URL parameters. Missing ID context.');
      }
    });
  }

  fetchAllData(): void {
    this.loading = true;
    
    // Parallel fetching of Model Info and Results Summary
    forkJoin({
      details: this.modelService.getModelDetails(this.unitId, this.systemId, this.modelId),
      summary: this.modelService.getModelSummary(this.unitId, this.systemId, this.modelId)
    })
    .pipe(
      finalize(() => {
        this.loading = false;
        this.cdr.detectChanges();
      })
    )
    .subscribe({
      next: (res) => {
        // Extracting 'data' property from BaseApiResponse<T>
        this.modelData = res.details.data;
        this.modelSummary = res.summary.data;
      },
      error: (err) => {
        console.error('API Error:', err);
        this.message.error('Failed to synchronize Digital Twin data.');
      }
    });
  }

  formatDate(date: string | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatFileSize(bytes: number): string {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  getR2ScorePercent(): number {
    const score = this.modelSummary?.summary?.evaluationMetrics?.r2Score;
    return score ? Math.round(score * 100) : 0;
  }
}