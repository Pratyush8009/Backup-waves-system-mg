import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

// Ng-Zorro Imports
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-system-info',
  standalone: true,
  imports: [
    CommonModule, FormsModule, NzButtonModule, NzDividerModule,
    NzModalModule, NzInputModule, NzSpinModule, NzTagModule, NzIconModule
  ],
  templateUrl: './system-info.html',
  styleUrls: ['./system-info.css'],
  providers: [NzMessageService]
})
export class SystemInfo implements OnInit {
  loading = true;
  isModalVisible = false;
  isOkLoading = false;

  // Static Data mapping your provided JSON
  system = {
    id: "b8fb0ff1-f1fb-4e68-9938-046d73f1631",
    name: "Intelly System",
    createdAt: "2026-03-17T09:23:21.080194Z",
    description: "Intelly System description",
    createdBy: "pratyush mohanty",
    unitId: "b8fb0ff1-f1fb-4e68-9938-046d73f16f5c",
    activeModel: "v1.01",
    modelId: "model-12345",
    modelName: "Intelly Model",
    totalBlock: 20,
    totalFlow: 40
  };

  editData = {
    name: '',
    description: ''
  };

  constructor(
    private message: NzMessageService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    // Simulate loading
    setTimeout(() => {
      this.loading = false;
      this.cdr.detectChanges();
    }, 700);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  editSystem() {
    this.editData = {
      name: this.system.name,
      description: this.system.description
    };
    this.isModalVisible = true;
  }

  handleOk() {
    this.isOkLoading = true;
    setTimeout(() => {
      this.system.name = this.editData.name;
      this.system.description = this.editData.description;

      this.isOkLoading = false;
      this.isModalVisible = false;
      this.message.success('System information updated');
      this.cdr.detectChanges();
    }, 600);
  }

  handleCancel() {
    this.isModalVisible = false;
  }
}