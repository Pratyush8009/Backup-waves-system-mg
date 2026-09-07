import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// NG-ZORRO Imports
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzTagModule } from 'ng-zorro-antd/tag';

import { model, getModelSchema, SchemaField, ModelSchemas } from '../../../pages/block-editor/data';

interface AppStateField {
  _id?: string;
  fieldName: string;
  dataType: string;
  type: 'input' | 'output';
  isRequired: boolean;
  defaultValue: any;
  description?: string;
  isModelSchema: boolean; // Flag to designate model-level schema fields
}

@Component({
  selector: 'app-model-schema',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzTableModule,
    NzButtonModule,
    NzInputModule,
    NzSelectModule,
    NzIconModule,
    NzTypographyModule,
    NzTagModule,
  ],
  templateUrl: './model-schema.html',
  styleUrl: './model-schema.css',
})
export class ModelSchema implements OnInit {
  searchText = '';
  systemId!: string;
  modelId: string = '';
  modelVersion: string = '';
  isLoading = false;
  unitId = ''

  dataTypes = ['string', 'number', 'decimal', 'boolean', 'date', 'float', 'object', 'array', 'null'];
  typeOptions: ('input' | 'output')[] = ['input', 'output'];

  appStateFields: AppStateField[] = [];

  constructor(
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router

  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.systemId = params.get('systemId') || 'b8fb0ff1-f1fb-4e68-9938-046d73f1631';
      this.unitId = params.get('unitId') || 'b8fb0ff1-f1fb-4e68-9938-046d73f16f5c';
      this.modelId = params.get('modelId') || 'MDL-660e8400-e29b-41d4-a716-446655440101';
      this.loadModelSchema();

    });
  }

  /**
   * Reads dynamic input and output schemas directly from data.ts via getModelSchema(model)
   */
  loadModelSchema() {
    this.isLoading = true;

    const summary: ModelSchemas = getModelSchema(model);
    this.modelId = summary.modelId ?? 'MDL-660e8400-e29b-41d4-a716-446655440101';
    this.modelVersion = summary.modelVersion ?? '';

    const loadedFields: AppStateField[] = [];

    // Map model input schema
    summary.schema.inputSchema.forEach((field: SchemaField) => {
      loadedFields.push({
        _id: field.id,
        fieldName: field.name,
        dataType: field.type || 'string',
        type: 'input',
        isRequired: false,
        defaultValue: '',
        description: field.description || '',
        isModelSchema: true
      });
    });

    // Map model output schema
    summary.schema.outputSchema.forEach((field: SchemaField) => {
      loadedFields.push({
        _id: field.id,
        fieldName: field.name,
        dataType: field.type || 'string',
        type: 'output',
        isRequired: false,
        defaultValue: '',
        description: field.description || '',
        isModelSchema: true
      });
    });

    this.appStateFields = loadedFields;
    this.isLoading = false;
    this.cdr.detectChanges();
  }

  get filteredFields() {
    if (!this.searchText) return this.appStateFields;
    return this.appStateFields.filter(f =>
      f.fieldName?.toLowerCase().includes(this.searchText.toLowerCase()) ||
      f.type?.toLowerCase().includes(this.searchText.toLowerCase()) ||
      f.dataType?.toLowerCase().includes(this.searchText.toLowerCase()) ||
      f.description?.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  goToEditor() {
    this.router.navigate([`/units/${this.unitId}/systems/${this.systemId}/models/MDL-660e8400-e29b-41d4-a716-446655440101/schema/block-editor`]);

  }
}