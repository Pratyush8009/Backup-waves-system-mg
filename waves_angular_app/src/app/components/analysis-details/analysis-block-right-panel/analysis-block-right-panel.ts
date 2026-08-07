import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzDividerModule } from 'ng-zorro-antd/divider';

@Component({
  selector: 'app-analysis-block-right-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, NzIconModule, NzTooltipModule, NzInputModule, NzTabsModule, NzTagModule, NzDividerModule],
  templateUrl: './analysis-block-right-panel.html',
  styleUrls: ['./analysis-block-right-panel.css']
})
export class AnalysisBlockRightPanel {
  @Input() blockData: any;
  activeTab = 0;

  getPortColor(type: string): string {
    return type === 'INPUT' ? '#E6F7FF' : '#FFF7E6';
  }

  getPortTextColor(type: string): string {
    return type === 'INPUT' ? '#1890FF' : '#FA8C16';
  }

  getDataTypeColor(type: string): string {
    const t = type?.toLowerCase();
    switch (t) {
      case 'number':
        return '#D6E4FF'; // Blue
      case 'decimal':
        return '#F6FFED'; // Green
      case 'string':
        return '#FFF0F6'; // Pink/Magenta
      default:
        return '#F5F5F5'; // Grey
    }
  }

  getDataTypeTextColor(type: string): string {
    const t = type?.toLowerCase();
    switch (t) {
      case 'number':
        return '#0958D9';
      case 'decimal':
        return '#389E0D';
      case 'string':
        return '#C41D7F';
      default:
        return '#595959';
    }
  }
}