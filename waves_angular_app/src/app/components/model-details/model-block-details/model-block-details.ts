import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { ActivatedRoute, Router } from '@angular/router';
import { NzSpinModule } from 'ng-zorro-antd/spin';

// Local interfaces since we removed the service import
interface Subsystem {
  _id?: string;
  subsystem_name: string;
  description: string;
  is_top: boolean;
  is_bottom: boolean;
  is_configured: boolean;
  flowcount: number;
}

interface CreateSubsystemDto {
  subsystem_name: string;
  description: string;
  is_top: boolean;
  is_bottom: boolean;
  system_id: string;
}

@Component({
  selector: 'app-subsystem-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    NzCardModule,
    NzButtonModule,
    NzModalModule,
    NzInputModule,
    NzIconModule,
    NzTooltipModule,
    NzSwitchModule,
    NzPopconfirmModule,
    NzSpinModule
  ],
  templateUrl: './model-block-details.html',
  styleUrl: './model-block-details.css',
  providers: [NzMessageService]
})
export class ModelBlockDetails implements OnInit {
  systemId!: string;
  isLoading = false;

  // Static Mock Data
  subsystems: Subsystem[] = [
    {
      _id: 'sub_01',
      subsystem_name: 'Block-1',
      description: 'Handles user login, JWT validation, and RBAC.',
      is_top: true,
      is_bottom: false,
      is_configured: true,
      flowcount: 5
    },
    {
      _id: 'sub_02',
      subsystem_name: 'Block-2',
      description: 'Stripe and PayPal integration for processing transactions.',
      is_top: false,
      is_bottom: false,
      is_configured: false,
      flowcount: 12
    },
    {
      _id: 'sub_03',
      subsystem_name: 'Block-3',
      description: 'Sends emails and SMS via AWS SNS.',
      is_top: false,
      is_bottom: true,
      is_configured: true,
      flowcount: 3
    }
  ];

  isModalVisible = false;
  isOkLoading = false;
  nameError = false;

  isDeleteModalVisible = false;
  isDeleteLoading = false;
  subsystemToDelete: Subsystem | null = null;

  newSubsystem: CreateSubsystemDto = {
    subsystem_name: '',
    description: '',
    is_top: true,
    is_bottom: false,
    system_id: ''
  };

  constructor(
    private router: Router,
    private activeroute: ActivatedRoute,
    private message: NzMessageService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.activeroute.paramMap.subscribe(params => {
      this.systemId = params.get('id') || 'STATIC_SYS_ID';
      this.newSubsystem.system_id = this.systemId;
      this.loadSubsystems();
    });
  }

  loadSubsystems() {
    this.isLoading = true;
    // Simulate a brief loading delay
    setTimeout(() => {
      this.isLoading = false;
      this.cdr.detectChanges();
    }, 600);
  }

  createSubsystem() {
    this.resetForm();
    this.isModalVisible = true;
  }

  confirmDelete(subsystem: Subsystem, event: Event) {
    event.stopPropagation();
    this.subsystemToDelete = subsystem;
    this.isDeleteModalVisible = true;
  }

  handleDeleteConfirm() {
    if (!this.subsystemToDelete) return;

    this.isDeleteLoading = true;

    // Simulate API deletion
    setTimeout(() => {
      this.subsystems = this.subsystems.filter(s => s._id !== this.subsystemToDelete?._id);
      this.message.success('Subsystem deleted successfully (Static)');
      this.isDeleteModalVisible = false;
      this.subsystemToDelete = null;
      this.isDeleteLoading = false;
      this.cdr.detectChanges();
    }, 500);
  }

  handleDeleteCancel() {
    this.isDeleteModalVisible = false;
    this.subsystemToDelete = null;
    this.cdr.detectChanges();
  }

  handleOk() {
    this.validateName();
    if (this.nameError) return;

    this.isOkLoading = true;

    // Simulate API Creation
    setTimeout(() => {
      const createdSub: Subsystem = {
        _id: Math.random().toString(36).substr(2, 9),
        subsystem_name: this.newSubsystem.subsystem_name,
        description: this.newSubsystem.description,
        is_top: this.newSubsystem.is_top,
        is_bottom: this.newSubsystem.is_bottom,
        is_configured: false,
        flowcount: 0
      };

      this.subsystems = [...this.subsystems, createdSub];
      this.message.success('Subsystem created successfully (Static)');
      this.isOkLoading = false;
      this.isModalVisible = false;
      this.cdr.detectChanges();
    }, 800);
  }

  handleCancel() {
    this.isModalVisible = false;
    this.cdr.detectChanges();
  }

  validateName() {
    this.nameError = !this.newSubsystem.subsystem_name || this.newSubsystem.subsystem_name.trim() === '';
  }

  resetForm() {
    this.newSubsystem = {
      subsystem_name: '',
      description: '',
      is_top: true,
      is_bottom: false,
      system_id: this.systemId
    };
    this.nameError = false;
  }

  configure() {
    this.router.navigate(['unit/system/subsystem/configure/', this.systemId]);
  }
}