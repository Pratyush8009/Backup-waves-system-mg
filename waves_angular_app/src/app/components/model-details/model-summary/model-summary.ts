import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-model-summary',
  standalone: true, // Assuming you are using standalone components
  imports: [
    CommonModule,
    FormsModule,
    NzButtonModule,
    NzDividerModule,
    NzModalModule,
    NzInputModule,
    NzSelectModule,
    NzSpinModule
  ],
  templateUrl: './model-summary.html',
  styleUrls: ['./model-summary.css']
})
export class ModelSummary implements OnInit {
  systemId!: string;
  loading = true;

  // Static Data
  system = {
    name: 'Enterprise Core Alpha',
    version: '2.4.1',
    subsystemCount: 12,
    userId: 'USR-9902',
    updatedAt: '2024-03-15T10:00:00Z',
    id: "SYS-10245",
    flowCount: 45,
    modelId: 'MODEL-01',
    createdAt: '2023-01-10T08:30:00Z',
    description: 'Main processing engine for regional logistics and distribution.',
    status: 'active'
  };

  isModalVisible = false;
  isOkLoading = false;

  editData = {
    name: '',
    description: '',
    status: ''
  };

  constructor(
    private route: ActivatedRoute,
    private message: NzMessageService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.systemId = params.get('id') || 'STATIC_ID';
      console.log("system id", this.systemId);

      // Simulate API delay
      setTimeout(() => {
        this.loading = false;
        this.cdr.detectChanges();
      }, 800);
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  }

  editSystem() {
    this.editData = {
      name: this.system.name,
      description: this.system.description,
      status: this.system.status
    };
    this.isModalVisible = true;
  }

  handleOk() {
    this.isOkLoading = true;

    // Simulate "Saving" delay
    setTimeout(() => {
      // Update the local static object
      this.system = {
        ...this.system,
        name: this.editData.name,
        description: this.editData.description,
        status: this.editData.status,
        updatedAt: new Date().toISOString() // Update timestamp locally
      };

      this.isOkLoading = false;
      this.isModalVisible = false;
      this.message.success('System updated successfully (Static)');
      this.cdr.detectChanges();
    }, 600);
  }

  handleCancel() {
    this.isModalVisible = false;
  }
}