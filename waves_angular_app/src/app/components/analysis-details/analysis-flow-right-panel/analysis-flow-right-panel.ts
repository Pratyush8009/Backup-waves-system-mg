import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-analysis-flow-right-panel',
  imports: [CommonModule, NzIconModule],
  templateUrl: './analysis-flow-right-panel.html',
  styleUrl: './analysis-flow-right-panel.css',
})
export class AnalysisFlowRightPanel {
  @Input() selectedNode: any;

}
