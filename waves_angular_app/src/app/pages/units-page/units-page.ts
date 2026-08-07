import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

// NG-ZORRO Imports
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzSelectModule } from 'ng-zorro-antd/select';

import { UnitService, CreateUnitDto } from '../../services/unit.service';

interface UnitCard {
  _id: string;
  name: string;
  description: string;
  system_count: number;
  status: string;
}

@Component({
  selector: 'app-units-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    NzCardModule,
    NzButtonModule,
    NzTagModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    NzGridModule,
    NzEmptyModule,
    NzSpinModule,
    NzPopconfirmModule,
    NzIconModule,
    NzBreadCrumbModule,
    NzPageHeaderModule,
    NzSelectModule
  ],
  templateUrl: './units-page.html',
  styleUrl: './units-page.css',
})
export class UnitsPage implements OnInit {
  userId: string = '';
  isVisible = false;
  isLoading = false;
  deleteLoading: { [key: string]: boolean } = {};
  unitForm!: FormGroup;

  units: UnitCard[] = [];
  filteredUnits: UnitCard[] = [];
  searchText: string = '';
  selectedUnitId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private unitService: UnitService,
    private message: NzMessageService,
    private cdr: ChangeDetectorRef
  ) {
    this.unitForm = this.fb.group({
      name: ['', Validators.required],
      type: ['MANUFACTURING', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.userId = params.get('id')!;
      this.selectedUnitId = localStorage.getItem('selectedUnitId');
      if (this.userId) {
        this.loadUnits();
      }
    });
  }

  loadUnits(): void {
    this.isLoading = true;
    this.unitService.getUnitsByUserId(this.userId).subscribe({
      next: (response) => {
        this.isLoading = false;
        // Mapping from your new API structure
        this.units = response.data.units.map((unit: any) => ({
          _id: unit.id,
          name: unit.name,
          description: unit.descrpt || unit.type || 'No description provided',
          system_count: unit.systemCount || 0,
          status: unit.status || 'ACTIVE'
        }));
        this.filteredUnits = [...this.units];
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.isLoading = false;
        this.message.error(error.error?.message || 'Failed to load units');
        this.cdr.detectChanges();
      }
    });
  }

  onSearch(): void {
    const searchLower = this.searchText.toLowerCase().trim();
    if (!searchLower) {
      this.filteredUnits = [...this.units];
    } else {
      this.filteredUnits = this.units.filter(unit =>
        unit.name.toLowerCase().includes(searchLower) ||
        unit.description.toLowerCase().includes(searchLower)
      );
    }
  }

  clearSearch(): void {
    this.searchText = '';
    this.onSearch();
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    if (this.unitForm.valid) {
      this.isLoading = true;
      const payload: CreateUnitDto = { ...this.unitForm.value, userId: this.userId };

      this.unitService.createUnit(payload).subscribe({
        next: () => {
          this.isLoading = false;
          this.message.success('Unit created successfully');
          this.isVisible = false;
          this.unitForm.reset({ type: 'MANUFACTURING' });
          this.loadUnits();
        },
        error: (error) => {
          this.isLoading = false;
          this.message.error(error.error?.message || 'Failed to create unit');
        }
      });
    } else {
      Object.values(this.unitForm.controls).forEach(control => {
        control.markAsDirty();
        control.updateValueAndValidity();
      });
    }
  }

  handleCancel(): void {
    this.isVisible = false;
    this.unitForm.reset({ type: 'MANUFACTURING' });
  }

  deleteUnit(unitId: string): void {
    this.deleteLoading[unitId] = true;
    this.unitService.deleteUnit(unitId).subscribe({
      next: () => {
        delete this.deleteLoading[unitId];
        this.units = this.units.filter(unit => unit._id !== unitId);
        this.onSearch();
        this.message.success('Unit deleted successfully');
        this.cdr.detectChanges();
      },
      error: (error) => {
        delete this.deleteLoading[unitId];
        this.message.error(error.error?.message || 'Failed to delete unit');
      }
    });
  }

  isDeleteLoading(unitId: string): boolean {
    return !!this.deleteLoading[unitId];
  }

  viewUnitDetails(unitId: string): void {
    this.selectedUnitId = unitId;
    localStorage.setItem("selectedUnitId", unitId);
    this.router.navigate([`/user/${this.userId}/units/${unitId}`]);
  }

  goBackToUser() {
    this.router.navigate(['/']);
  }
}