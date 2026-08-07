import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

// Ng-Zorro Imports
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTagModule } from 'ng-zorro-antd/tag';

@Component({
  selector: 'app-unit-manage',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, NzFormModule, NzInputModule,
    NzSelectModule, NzButtonModule, NzCardModule, NzSwitchModule,
    NzInputNumberModule, NzDividerModule, NzGridModule, NzTagModule
  ],
  templateUrl: './unit-manage.html',
  styleUrl: './unit-manage.css'
})
export class UnitManage implements OnInit {
  configForm!: FormGroup;

  // Formatter for large API limits
  formatterNumber = (value: number | string): string => value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '';
  parserNumber = (value: string): number => Number(value.replace(/\$\s?|(,*)/g, ''));

  constructor(private fb: FormBuilder, private message: NzMessageService) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.configForm = this.fb.group({
      template: ['TEMPLATE-MANUFACTURING-STANDARD-001'],

      // Section 1: Data Management & Retention
      dataManagement: this.fb.group({
        operationalData: [180],
        analyticalData: [365],
        archiveData: [2555],
        monitoringFrequency: ['Every 5 minutes'],
        deletionPolicy: ['Soft delete then archive'],
        backupLocation: ['Cloud (US-East)']
      }),

      // Section 2: Alerting Configuration
      alerting: this.fb.group({
        emailEnabled: [true],
        mobileEnabled: [true],
        inAppEnabled: [true],
        retryAttempts: [3],
        retryInterval: [5],
        quietHours: [false]
      }),

      // Section 3: Usage Limits
      usage: this.fb.group({
        apiLimit: [10000000],
        dataIngestion: [1000],
        maxSystems: [50],
        maxModels: [200],
        maxUsers: [100],
        storageGB: [5000],
        allowOverage: [true]
      }),

      // Section 4: Maintenance
      maintenance: this.fb.group({
        enabled: [true],
        day: ['Sunday'],
        startTime: ['02:00'],
        endTime: ['04:00'],
        timezone: ['UTC']
      })
    });
  }

  submitForm(): void {
    if (this.configForm.valid) {
      console.log('Final Unit Configuration:', this.configForm.value);
      this.message.success('Unit settings saved and applied successfully');
    }
  }
}