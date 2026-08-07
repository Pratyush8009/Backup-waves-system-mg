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

// Import the SystemService
import { SystemService } from '../../../services/system.service';

@Component({
  selector: 'app-system-analysis',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, FormsModule, NzCardModule, NzButtonModule,
    NzModalModule, NzFormModule, NzInputModule, NzGridModule, NzEmptyModule,
    NzSpinModule, NzPopconfirmModule, NzIconModule, NzTagModule, NzSelectModule
  ],
  templateUrl: './system-analysis.html',
  styleUrls: ['./system-analysis.css']
})
export class SystemAnalysis implements OnInit {
  unitId: string | null = null;
  systemId: string | null = null;

  isVisible = false;
  isLoading = false;
  isCreating = false;
  deleteLoading: { [key: string]: boolean } = {};

  analysisForm: FormGroup;
  analysesList: any[] = [];
  filteredAnalyses: any[] = [];
  searchText: string = '';

  // Store the full system details response
  systemDetails: any = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private message: NzMessageService,
    private cdr: ChangeDetectorRef,
    private systemService: SystemService
  ) {
    this.analysisForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      type: ['PREDICTION', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.unitId = this.route.snapshot.paramMap.get('id') || this.route.parent?.snapshot.paramMap.get('id') || null;
    this.systemId = this.route.snapshot.paramMap.get('systemId') || this.route.parent?.snapshot.paramMap.get('systemId') || null;
    this.loadAnalyses();
  }

  loadAnalyses(): void {
    if (!this.unitId || !this.systemId) {
      this.message.error('Unit ID or System ID not found');
      this.isLoading = false;
      return;
    }

    this.isLoading = true;

    // Call the getSystemById API to fetch system details including analyses
    this.systemService.getSystemById(this.unitId, this.systemId).subscribe({
      next: (response) => {
        if (response.code === 200 && response.data) {
          // Store the full system details
          this.systemDetails = response.data;

          // Extract analyses list from the response
          // The analyses are located in response.data.analyses.analysesList
          if (response.data.analyses && response.data.analyses.analysesList) {
            this.analysesList = response.data.analyses.analysesList;
          } else {
            this.analysesList = [];
            this.message.warning('No analyses found for this system');
          }

          // Apply search filter
          this.onSearch();
        } else {
          this.message.error(response.message || 'Failed to load analyses');
          this.analysesList = [];
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading analyses:', error);
        this.message.error('Failed to load analyses. Please try again.');
        this.analysesList = [];
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSearch(): void {
    const searchLower = this.searchText.toLowerCase().trim();
    if (!searchLower) {
      this.filteredAnalyses = [...this.analysesList];
    } else {
      this.filteredAnalyses = this.analysesList.filter(a =>
        a.name?.toLowerCase().includes(searchLower) ||
        a.description?.toLowerCase().includes(searchLower)
      );
    }
  }

  deleteAnalysis(id: string): void {
    // Note: The API doesn't have a specific delete analysis endpoint based on the provided response
    // You would need to implement this based on your backend API
    this.deleteLoading[id] = true;

    // Example: If there's a delete analysis API
    // this.systemService.deleteAnalysis(this.unitId!, this.systemId!, id).subscribe({
    //   next: (response) => {
    //     if (response.code === 200) {
    //       this.analysesList = this.analysesList.filter(a => a.analysisId !== id);
    //       this.onSearch();
    //       this.message.success('Analysis deleted successfully');
    //     } else {
    //       this.message.error(response.message || 'Failed to delete analysis');
    //     }
    //     this.deleteLoading[id] = false;
    //     this.cdr.detectChanges();
    //   },
    //   error: (error) => {
    //     console.error('Error deleting analysis:', error);
    //     this.message.error('Failed to delete analysis');
    //     this.deleteLoading[id] = false;
    //     this.cdr.detectChanges();
    //   }
    // });

    // Temporary mock deletion (remove this when actual API is implemented)
    setTimeout(() => {
      this.analysesList = this.analysesList.filter(a => a.analysisId !== id);
      this.onSearch();
      this.deleteLoading[id] = false;
      this.message.success('Analysis removed');
      this.cdr.detectChanges();
    }, 800);
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleCancel(): void {
    this.isVisible = false;
    this.analysisForm.reset({ type: 'PREDICTION' });
  }

  handleOk(): void {
    if (this.analysisForm.valid) {
      this.isCreating = true;

      // Implement create analysis API call based on your backend
      // Example structure:
      // const payload = {
      //   name: this.analysisForm.get('name')?.value,
      //   description: this.analysisForm.get('description')?.value,
      //   type: this.analysisForm.get('type')?.value
      // };
      // 
      // this.systemService.createAnalysis(this.unitId!, this.systemId!, payload).subscribe({
      //   next: (response) => {
      //     if (response.code === 201) {
      //       this.message.success('Analysis created successfully');
      //       this.loadAnalyses(); // Reload the list
      //       this.handleCancel();
      //     } else {
      //       this.message.error(response.message || 'Failed to create analysis');
      //     }
      //     this.isCreating = false;
      //     this.cdr.detectChanges();
      //   },
      //   error: (error) => {
      //     console.error('Error creating analysis:', error);
      //     this.message.error('Failed to create analysis');
      //     this.isCreating = false;
      //     this.cdr.detectChanges();
      //   }
      // });

      // Temporary mock creation (remove this when actual API is implemented)
      setTimeout(() => {
        this.message.success('Analysis Created');
        this.isCreating = false;
        this.handleCancel();
        this.loadAnalyses(); // Reload to get updated list
      }, 1000);
    } else {
      Object.values(this.analysisForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsTouched();
        }
      });
      this.message.error('Please fill in all required fields');
    }
  }

  viewAnalytics(id: string): void {
    this.router.navigate([`units/${this.unitId}/systems/${this.systemId}/analysis/${id}`]);
  }
}