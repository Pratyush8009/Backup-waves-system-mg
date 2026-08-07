import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// NG-ZORRO
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzMessageService } from 'ng-zorro-antd/message';

// Components
import { AnalysisFlowEditor } from '../../components/analysis-details/analysis-flow-editor/analysis-flow-editor';
import { AnalysisBlockEditor } from '../../components/analysis-details/analysis-block-editor/analysis-block-editor';
import { Testing } from '../../components/testing/testing';
import { AnalysisOverview } from '../../components/analysis-details/analysis-overview/analysis-overview';
// Services & Interfaces
import { SystemService } from '../../services/system.service';

@Component({
  selector: 'app-analysis-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzTabsModule,
    NzButtonModule,
    NzIconModule,
    NzBreadCrumbModule,
    NzTooltipModule,
    AnalysisBlockEditor,
    AnalysisFlowEditor,
    NzPageHeaderModule,
    NzDividerModule,
    Testing,
    AnalysisOverview
  ],
  templateUrl: './analysis-page.html',
  styleUrl: './analysis-page.css',
})
export class AnalysisPage implements OnInit {
  systemId!: string;
  userId!: any;
  selectedTabIndex = 0;
  isFullScreen = false;
  isConfigFullscreen = false;
  isFlowMode = false;
  unitId!: string;
  analysisId!: string;

  // New states to hold the API extracted data
  system: any | null = null;
  extractedModelId: string = '';
  selectedVersion: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private systemService: SystemService,
    private message: NzMessageService
  ) {
    this.userId = localStorage.getItem("currentUserId");
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.unitId = params.get('unitId') || '';
      this.systemId = params.get('systemId') || '';
      this.analysisId = params.get('analysisId') || '';

      if (this.unitId && this.systemId) {
        this.loadSystemDetails();
      }
    });
  }

  loadSystemDetails() {

  }

  handleVersionSelection(version: string) {
    this.selectedVersion = version;
    this.selectedTabIndex = 1;
  }



  onFullscreenChange(isFullscreen: boolean) {
    this.isFullScreen = isFullscreen;
  }

  setActiveTab(index: number) {
    this.selectedTabIndex = index;
  }

  toggleEditor() {
    this.isFlowMode = !this.isFlowMode;
  }

  goBackToSystem() {
    this.router.navigate([`unit/${this.unitId}/system/${this.systemId}`])

  }
}