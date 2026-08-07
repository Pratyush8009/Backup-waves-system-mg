import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { SystemService, SystemSummaryItem } from '../../../services/system.service';

import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: 'app-unit-systems',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NzCardModule,
    NzButtonModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    NzGridModule,
    NzEmptyModule,
    NzSpinModule,
    NzPopconfirmModule,
    NzIconModule,
    NzTagModule,
    NzSelectModule
  ],
  templateUrl: './unit-systems.html',
  styleUrls: ['./unit-systems.css']
})
export class UnitSystems implements OnInit {
  userId: string = '';
  unitId: string = '';
  isVisible = false;
  isLoading = false;
  deleteLoading: { [key: string]: boolean } = {};
  systemForm: FormGroup;

  systems: SystemSummaryItem[] = [];
  filteredSystems: SystemSummaryItem[] = [];
  searchText: string = '';
  selectedSystemId: string | null = null;

  // Predefined system types for the dropdown
  systemTypes = [
    { label: 'Manufacturing', value: 'MANUFACTURING' },
    { label: 'Energy', value: 'ENERGY' },
    { label: 'Infrastructure', value: 'INFRASTRUCTURE' },
    { label: 'Logistics', value: 'LOGISTICS' },
    { label: 'Utility', value: 'UTILITY' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private message: NzMessageService,
    private cdr: ChangeDetectorRef,
    private systemService: SystemService
  ) {
    this.systemForm = this.fb.group({
      name: ['', [Validators.required]],
      type: [null, [Validators.required]], // null initially to force selection
      description: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    if (this.route.parent) {
      this.route.parent.paramMap.subscribe(params => {
        this.userId = params.get('id') || '';
        this.unitId = params.get('unitId') || '';
        if (this.unitId) {
          this.loadSystems();
        }
      });
    }
  }

  loadSystems(): void {
    this.isLoading = true;
    this.systemService.getSystemsByUnit(this.unitId).subscribe({
      next: (response) => {
        this.systems = response.data.systems || [];
        this.onSearch();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.message.error('Failed to load systems');
        this.cdr.detectChanges();
      }
    });
  }

  handleOk(): void {
    if (this.systemForm.valid) {
      this.isLoading = true;
      const payload = this.systemForm.value;

      this.systemService.createSystem(this.unitId, payload).subscribe({
        next: (response) => {
          this.message.success(response.message || 'System created successfully');
          this.handleCancel(); // Resets and closes
          this.isLoading = false;
          this.loadSystems();
        },
        error: () => {
          this.isLoading = false;
          this.message.error('Failed to create system');
          this.cdr.detectChanges();
        }
      });
    } else {
      Object.values(this.systemForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  deleteSystem(systemId: string): void {
    this.deleteLoading[systemId] = true;
    this.systemService.deleteSystem(this.unitId, systemId).subscribe({
      next: (response) => {
        delete this.deleteLoading[systemId];
        this.message.success(response.message || 'System deleted successfully');
        this.systems = this.systems.filter(s => s.systemId !== systemId);
        this.onSearch();
        this.cdr.detectChanges();
      },
      error: () => {
        delete this.deleteLoading[systemId];
        this.message.error('Failed to delete system');
        this.cdr.detectChanges();
      }
    });
  }

  onSearch(): void {
    const searchLower = this.searchText.toLowerCase().trim();
    if (!searchLower) {
      this.filteredSystems = [...this.systems];
    } else {
      this.filteredSystems = this.systems.filter(system =>
        system.name.toLowerCase().includes(searchLower) ||
        system.type.toLowerCase().includes(searchLower)
      );
    }
    this.cdr.detectChanges();
  }

  clearSearch(): void {
    this.searchText = '';
    this.onSearch();
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleCancel(): void {
    this.isVisible = false;
    this.systemForm.reset();
  }

  viewSystemDetails(systemId: string): void {
    this.selectedSystemId = systemId;
    this.router.navigate([`/units/${this.unitId}/systems/${systemId}`]);
  }
}