import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// Ng-Zorro Imports
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

// Services
import { SystemService } from '../../../services/system.service'; 
import { ModelService, ModelPayload } from '../../../services/model.service';

@Component({
  selector: 'app-system-models',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, FormsModule, NzCardModule, NzButtonModule,
    NzModalModule, NzFormModule, NzInputModule, NzGridModule, NzEmptyModule,
    NzSpinModule, NzPopconfirmModule, NzIconModule, NzTagModule, NzSelectModule
  ],
  templateUrl: './system-models.html',
  styleUrls: ['./system-models.css']
})
export class SystemModels implements OnInit {
  unitId: string | null = null;
  systemId: string | null = null;
  
  isVisible = false;
  isLoading = false; // Page loading
  isCreating = false; // Modal button loading
  deleteLoading: { [key: string]: boolean } = {};
  
  modelForm: FormGroup;
  modelsList: any[] = [];
  filteredModels: any[] = [];
  searchText: string = '';
  selectedModelId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private message: NzMessageService,
    private cdr: ChangeDetectorRef,
    private systemService: SystemService,
    private modelService: ModelService 
  ) {
    this.modelForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      type: ['PREDICTION', [Validators.required]],
      category: ['PerformanceMonitoring', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Check both current and parent route for IDs
    this.unitId = this.route.snapshot.paramMap.get('id') || 
                  this.route.parent?.snapshot.paramMap.get('id') || null;
    
    this.systemId = this.route.snapshot.paramMap.get('systemId') || 
                    this.route.parent?.snapshot.paramMap.get('systemId') || null;

    if (this.unitId && this.systemId) {
      this.loadModels();
    } else {
      this.message.error("Context Error: Unit ID or System ID not found in route.");
    }
  }

  loadModels(): void {
    if (!this.unitId || !this.systemId) return;

    this.isLoading = true;
    this.systemService.getSystemById(this.unitId, this.systemId).subscribe({
      next: (response) => {
        if (response && response.data && response.data.models) {
          this.modelsList = response.data.models.modelsList || [];
          this.onSearch();
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        this.message.error('Failed to refresh models list.');
        this.cdr.detectChanges();
      }
    });
  }

  handleOk(): void {
    if (this.modelForm.valid) {
      if (!this.unitId || !this.systemId) {
        this.message.error("Missing Unit or System ID. Cannot create model.");
        return;
      }

      this.isCreating = true;
      const payload: ModelPayload = this.modelForm.value;

      this.modelService.createModel(this.unitId, this.systemId, payload).subscribe({
        next: (res) => {
          this.isCreating = false; // Reset loading state
          if (res.code === 200 || res.code === 201) {
            this.message.success('Model created successfully');
            this.handleCancel(); // Close modal and reset form
            this.loadModels();   // Refresh the grid
          } else {
            this.message.warning(res.message || 'Model creation returned unexpected status');
          }
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.isCreating = false; // Reset loading state on error
          this.message.error(err.error?.message || 'Server error: Could not create model');
          this.cdr.detectChanges();
        }
      });
    } else {
      // Mark fields as dirty to show validation errors
      Object.values(this.modelForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  onSearch(): void {
    const searchLower = this.searchText.toLowerCase().trim();
    if (!searchLower) {
      this.filteredModels = [...this.modelsList];
    } else {
      this.filteredModels = this.modelsList.filter(m => 
        m.name?.toLowerCase().includes(searchLower) || 
        m.description?.toLowerCase().includes(searchLower)
      );
    }
    this.cdr.detectChanges();
  }

  deleteModel(modelId: string): void {
    this.deleteLoading[modelId] = true;
    // Temporary timeout until delete API is integrated
    setTimeout(() => {
      this.modelsList = this.modelsList.filter(m => m.modelId !== modelId);
      this.onSearch();
      this.deleteLoading[modelId] = false;
      this.message.success('Model removed');
      this.cdr.detectChanges();
    }, 800);
  }

  showModal(): void { this.isVisible = true; }
  
  handleCancel(): void { 
    this.isVisible = false; 
    this.isCreating = false; // Ensure loading is reset if closed
    this.modelForm.reset({ type: 'PREDICTION', category: 'PerformanceMonitoring' }); 
  }

  clearSearch(): void { this.searchText = ''; this.onSearch(); }

  viewModelDetails(modelId: string): void {
    this.router.navigate([`units/${this.unitId}/systems/${this.systemId}/models/${modelId}`]);
  }
}