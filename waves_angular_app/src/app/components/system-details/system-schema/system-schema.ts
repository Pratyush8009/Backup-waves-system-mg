import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

interface AppStateField {
  _id?: string;
  fieldName: string;
  dataType: string;
  type: 'input' | 'output';
  isRequired: boolean;
  defaultValue: any;
  isEditing?: boolean;
  originalData?: any;
}

@Component({
  selector: 'app-system-schema',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzTableModule,
    NzButtonModule,
    NzInputModule,
    NzSelectModule,
    NzSwitchModule,
    NzIconModule,
    NzTypographyModule
  ],
  templateUrl: './system-schema.html',
  styleUrl: './system-schema.css',
})
export class SystemSchema implements OnInit {
  searchText = '';
  systemId!: string;
  isLoading = false;
  initialLoadComplete = false;

  dataTypes = ['string', 'number', 'boolean', 'date', 'float', 'object', 'array', 'null'];
  typeOptions: ('input' | 'output')[] = ['input', 'output'];

  // Static Data
  appStateFields: AppStateField[] = [
    { _id: '1', fieldName: 'user_name', dataType: 'string', type: 'input', isRequired: true, defaultValue: 'Guest', isEditing: false },
    { _id: '2', fieldName: 'retry_count', dataType: 'number', type: 'input', isRequired: false, defaultValue: 3, isEditing: false },
    { _id: '3', fieldName: 'is_authenticated', dataType: 'boolean', type: 'output', isRequired: true, defaultValue: false, isEditing: false }
  ];

  constructor(
    private activeroute: ActivatedRoute,
    private message: NzMessageService,
    private modal: NzModalService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.activeroute.paramMap.subscribe(params => {
      this.systemId = params.get('id') || 'STATIC-SYS-001';

      // Simulate initial loading
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
        this.initialLoadComplete = true;
        this.cdr.detectChanges();
      }, 500);
    });
  }

  addField() {
    const newField: AppStateField = {
      fieldName: '',
      dataType: 'string',
      type: 'input',
      isRequired: false,
      defaultValue: '',
      isEditing: true
    };
    // Add to the top or bottom of the list
    this.appStateFields = [...this.appStateFields, newField];
    this.cdr.detectChanges();
  }

  saveField(field: AppStateField, index: number) {
    if (!field.fieldName || field.fieldName.trim() === '') {
      this.message.error('Field name is required');
      return;
    }

    // Simulate "Saving"
    this.isLoading = true;

    setTimeout(() => {
      if (!field._id) {
        // Create Logic (assign a fake ID)
        field._id = Math.random().toString(36).substr(2, 9);
        this.message.success('Field created locally');
      } else {
        // Update Logic
        this.message.success('Field updated locally');
      }

      field.isEditing = false;
      this.appStateFields = [...this.appStateFields];
      this.isLoading = false;
      this.cdr.detectChanges();
    }, 400);
  }

  deleteField(index: number) {
    const field = this.appStateFields[index];

    // If it's a new unsaved row, just remove it
    if (!field._id) {
      this.removeAt(index);
      return;
    }

    this.modal.confirm({
      nzTitle: 'Confirm Delete',
      nzContent: 'Are you sure you want to delete this field?',
      nzOkText: 'Yes',
      nzOkDanger: true,
      nzOnOk: () => {
        this.removeAt(index);
        this.message.success('Field removed');
      }
    });
  }

  private removeAt(index: number) {
    this.appStateFields.splice(index, 1);
    this.appStateFields = [...this.appStateFields];
    this.cdr.detectChanges();
  }

  cancelEdit(field: AppStateField, index: number) {
    if (!field._id) {
      // If it was a new row being added, remove it
      this.appStateFields.splice(index, 1);
    } else {
      // Restore original data
      if (field.originalData) {
        this.appStateFields[index] = { ...field.originalData, isEditing: false };
      } else {
        field.isEditing = false;
      }
    }
    this.appStateFields = [...this.appStateFields];
    this.cdr.detectChanges();
  }

  editField(field: AppStateField) {
    // Store original data in case of cancel
    field.originalData = JSON.parse(JSON.stringify(field));
    field.isEditing = true;
    this.cdr.detectChanges();
  }

  get filteredFields() {
    if (!this.searchText) return this.appStateFields;
    return this.appStateFields.filter(f =>
      f.fieldName?.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }
}