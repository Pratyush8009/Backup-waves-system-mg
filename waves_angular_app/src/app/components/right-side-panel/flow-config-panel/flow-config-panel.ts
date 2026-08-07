import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-flow-config-panel',
  imports: [CommonModule, NzIconModule],
  templateUrl: './flow-config-panel.html',
  styleUrl: './flow-config-panel.css',
})
export class FlowConfigPanel {
  @Input() selectedNode: any;

}
