import { Component, signal, OnDestroy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzUploadModule, NzUploadFile } from 'ng-zorro-antd/upload';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzMessageService } from 'ng-zorro-antd/message';

import * as XLSX from 'xlsx';
import { systemSchema, modelFileGroups, analysisFileGroups, fileData } from './file';

export interface ExecutableFile {
  id: string;
  name: string;
  size: string;
  status: 'pending' | 'processing' | 'completed';
  type?: 'csv' | 'excel';
  progress?: number;
  timerRef?: any;
}

export interface FileGroup {
  date: string;
  files: ExecutableFile[];
}

export interface ColumnMappingItem {
  sourceColumn: string;
  targetSchema: string;
  detectedType: 'Numeric' | 'Decimal' | 'Boolean' | 'String';
  typeMismatch: boolean;
  columnMismatch: boolean;
}

export interface TableRow {
  index: any;
  [key: string]: any;
}

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzUploadModule,
    NzProgressModule,
    NzButtonModule,
    NzIconModule,
    NzSelectModule
  ],
  templateUrl: './file-upload.html',
  styleUrl: './file-upload.css'
})
export class FileUpload implements OnDestroy {
  activeTab = signal<'model' | 'analysis'>('model');

  // Analysis Selection Keys
  analysisKeys = Object.keys(analysisFileGroups);
  selectedAnalysis = signal<string>(this.analysisKeys[0] || 'MonthlyProductionAnalysis');

  // Workflow Step State (1 = Data Overview, 2 = Column Mapping, 3 = Run Model, 4 = Result)
  workflowStep = signal<number>(1);

  // Active Selected File State
  selectedFile = signal<ExecutableFile | null>(null);

  // Model Run Execution State
  modelProgress = signal<number>(0);
  isModelRunning = signal<boolean>(false);
  modelIntervalRef: any = null;

  // Table Overview State
  tableColumns = signal<string[]>([]);
  tableData = signal<TableRow[]>([]);
  rawBackupData = signal<{ cols: string[]; rows: TableRow[] }>({ cols: [], rows: [] });

  // Complete List of System Schemas (Never filtered)
  availableSchemas: { label: string; value: string; dataType: string; type: string }[] = [];

  mappingItems = signal<ColumnMappingItem[]>([]);

  // Local Reactive Copies of mock data from file.ts
  modelGroups = signal<FileGroup[]>(modelFileGroups as FileGroup[]);
  analysisData = signal<Record<string, FileGroup[]>>(analysisFileGroups as unknown as Record<string, FileGroup[]>);

  // Active File History
  activeFileGroups = computed(() => {
    if (this.activeTab() === 'model') {
      return this.modelGroups();
    } else {
      return this.analysisData()[this.selectedAnalysis()] || [];
    }
  });

  // Table Null and Empty Cell Counts
  nullCount = computed(() => {
    let count = 0;
    const cols = this.tableColumns();
    this.tableData().forEach(row => {
      cols.forEach(col => {
        const val = String(row[col] ?? '').trim().toLowerCase();
        if (val === 'null') count++;
      });
    });
    return count;
  });

  emptyCount = computed(() => {
    let count = 0;
    const cols = this.tableColumns();
    this.tableData().forEach(row => {
      cols.forEach(col => {
        const val = row[col];
        if (val === '' || val === undefined || val === null) count++;
      });
    });
    return count;
  });

  jsonResultFormatted = computed(() => {
    return JSON.stringify(this.tableData(), null, 2);
  });

  constructor(private msg: NzMessageService) {
    this.extractSystemSchemas();

    const initialGroups = this.activeFileGroups();
    if (initialGroups.length > 0 && initialGroups[0].files.length > 0) {
      this.selectFile(initialGroups[0].files[0]);
    }
  }

  // Extract ALL input and output schema items from systemSchema
  private extractSystemSchemas(): void {
    const inputs = systemSchema.inputProperties.map(p => ({
      label: `${p.name} (${p.propertyType.toUpperCase()})`,
      value: p.name,
      dataType: p.dataType,
      type: p.propertyType
    }));

    const outputs = systemSchema.outputProperties.map(p => ({
      label: `${p.name} (${p.propertyType.toUpperCase()})`,
      value: p.name,
      dataType: p.dataType,
      type: p.propertyType
    }));

    // Retain all schema definitions intact without hiding any options
    this.availableSchemas = [...inputs, ...outputs];
  }

  setActiveTab(tab: 'model' | 'analysis'): void {
    this.activeTab.set(tab);
    this.workflowStep.set(1);
    this.pickFirstAvailableFile();
  }

  onAnalysisChange(analysisKey: string): void {
    this.selectedAnalysis.set(analysisKey);
    this.workflowStep.set(1);
    this.pickFirstAvailableFile();
  }

  private pickFirstAvailableFile(): void {
    const groups = this.activeFileGroups();
    if (groups.length > 0 && groups[0].files.length > 0) {
      this.selectFile(groups[0].files[0]);
    } else {
      this.selectedFile.set(null);
      this.tableColumns.set([]);
      this.tableData.set([]);
    }
  }

  selectFile(file: ExecutableFile): void {
    this.selectedFile.set(file);
    this.workflowStep.set(1);

    // Sync execution progress state
    this.modelProgress.set(file.progress || (file.status === 'completed' ? 100 : 0));

    const match = fileData.find(f => f.fileId === file.id);

    if (match) {
      const dataCols = match.columns.filter(c => c.toLowerCase() !== 'index');
      this.tableColumns.set(dataCols);
      this.tableData.set(JSON.parse(JSON.stringify(match.tableData)));
      this.rawBackupData.set({
        cols: [...dataCols],
        rows: JSON.parse(JSON.stringify(match.tableData))
      });
    } else {
      const fallbackCols = ['temperature', 'vacuum', 'pressure', 'humidity'];
      const mockRows: TableRow[] = [
        { index: 1, temperature: 100.2, vacuum: 40.5, pressure: 1012, humidity: 55 },
        { index: 2, temperature: 101.8, vacuum: 42.1, pressure: 1013, humidity: 58 }
      ];

      this.tableColumns.set(fallbackCols);
      this.tableData.set(mockRows);
      this.rawBackupData.set({ cols: fallbackCols, rows: JSON.parse(JSON.stringify(mockRows)) });
    }
  }

  handleFileUpload = (file: NzUploadFile): boolean => {
    const rawFile = file as unknown as File;
    if (!rawFile || !rawFile.name) {
      this.msg.error('Invalid file.');
      return false;
    }

    const sizeMb = `${Math.ceil(rawFile.size / (1024 * 1024))}MB`;
    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        const rawJson: Record<string, any>[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        if (!rawJson || rawJson.length === 0) {
          this.msg.error('Uploaded file has no readable data.');
          return;
        }

        let allCols = Object.keys(rawJson[0]);
        const foundIndexKey = allCols.find(c => c.trim().toLowerCase() === 'index');
        let dataCols = foundIndexKey ? allCols.filter(c => c !== foundIndexKey) : allCols;

        const parsedRows: TableRow[] = rawJson.map((row, idx) => {
          const rowObj: TableRow = {
            index: foundIndexKey ? row[foundIndexKey] : idx + 1
          };
          dataCols.forEach(col => {
            rowObj[col] = row[col] !== undefined ? String(row[col]) : '';
          });
          return rowObj;
        });

        const newId = 'file-' + Date.now();
        const newFile: ExecutableFile = {
          id: newId,
          name: rawFile.name,
          size: sizeMb,
          status: 'pending',
          type: rawFile.name.endsWith('.csv') ? 'csv' : 'excel',
          progress: 0
        };

        fileData.push({
          fileId: newId,
          fileName: rawFile.name,
          type: newFile.type || 'csv',
          totalRows: parsedRows.length,
          columns: ['index', ...dataCols],
          tableData: parsedRows as any
        });

        const todayDate = '20 July 2026';

        if (this.activeTab() === 'model') {
          this.modelGroups.update(groups => {
            const grp = groups.find(g => g.date === todayDate);
            if (grp) { grp.files.unshift(newFile); return [...groups]; }
            return [{ date: todayDate, files: [newFile] }, ...groups];
          });
        } else {
          this.analysisData.update(map => {
            const currentList = map[this.selectedAnalysis()] || [];
            const grp = currentList.find(g => g.date === todayDate);
            if (grp) { grp.files.unshift(newFile); }
            else { currentList.unshift({ date: todayDate, files: [newFile] }); }
            return { ...map, [this.selectedAnalysis()]: [...currentList] };
          });
        }

        this.selectFile(newFile);
        this.msg.success(`File uploaded successfully!`);
      } catch (err) {
        console.error(err);
        this.msg.error('Could not process file.');
      }
    };

    reader.readAsArrayBuffer(rawFile);
    return false;
  };

  nextStep(): void {
    if (this.workflowStep() === 1) {
      this.generateAutomaticMappings();
      this.workflowStep.set(2);
    } else if (this.workflowStep() === 2) {
      this.workflowStep.set(3);
    } else if (this.workflowStep() === 3) {
      this.workflowStep.set(4);
    }
  }

  prevStep(): void {
    if (this.workflowStep() > 1) {
      this.workflowStep.update(s => s - 1);
    }
  }

  // Automatic Mapping Logic
  private generateAutomaticMappings(): void {
    const cols = this.tableColumns();

    const items: ColumnMappingItem[] = cols.map(col => {
      const detectedType = this.detectColumnType(col);

      // Attempt fuzzy match for pre-selection only
      const matchedSchema = this.availableSchemas.find(
        s => s.value.toLowerCase().replace(/[^a-z0-9]/g, '') === col.toLowerCase().replace(/[^a-z0-9]/g, '')
      );

      const targetSchema = matchedSchema ? matchedSchema.value : '';
      const colMismatch = !matchedSchema;
      const typeMismatch = matchedSchema ? this.checkTypeMismatch(detectedType, matchedSchema.dataType) : false;

      return {
        sourceColumn: col,
        targetSchema,
        detectedType,
        columnMismatch: colMismatch,
        typeMismatch
      };
    });

    this.mappingItems.set(items);
  }

  private detectColumnType(colName: string): 'Numeric' | 'Decimal' | 'Boolean' | 'String' {
    const rows = this.tableData();
    let numericCount = 0;
    let floatCount = 0;
    let totalSample = 0;

    for (const row of rows) {
      const val = row[colName];
      if (val !== '' && val !== null && val !== undefined) {
        totalSample++;
        const num = Number(val);
        if (!isNaN(num)) {
          numericCount++;
          if (String(val).includes('.')) floatCount++;
        }
      }
    }

    if (totalSample > 0 && numericCount / totalSample > 0.6) {
      return floatCount > 0 ? 'Decimal' : 'Numeric';
    }
    return 'String';
  }

  updateMapping(sourceColumn: string, selectedSchemaValue: string): void {
    this.mappingItems.update(items =>
      items.map(item => {
        if (item.sourceColumn === sourceColumn) {
          const matchedSchema = this.availableSchemas.find(s => s.value === selectedSchemaValue);
          const typeMismatch = matchedSchema ? this.checkTypeMismatch(item.detectedType, matchedSchema.dataType) : false;

          return {
            ...item,
            targetSchema: selectedSchemaValue,
            columnMismatch: false,
            typeMismatch
          };
        }
        return item;
      })
    );
  }

  private checkTypeMismatch(detectedType: string, schemaDataType: string): boolean {
    if (schemaDataType === 'float' || schemaDataType === 'int') {
      return detectedType !== 'Numeric' && detectedType !== 'Decimal';
    }
    if (schemaDataType === 'boolean') {
      return detectedType !== 'Boolean';
    }
    return false;
  }

  // FIXED: Realtime Progress Bar Update Logic
  startModelRun(): void {
    const file = this.selectedFile();
    if (!file) return;

    if (this.modelIntervalRef) {
      clearInterval(this.modelIntervalRef);
    }

    this.isModelRunning.set(true);
    this.modelProgress.set(0);
    file.status = 'processing';
    file.progress = 0;

    this.modelIntervalRef = setInterval(() => {
      const current = this.modelProgress();
      if (current >= 100) {
        clearInterval(this.modelIntervalRef);
        this.modelIntervalRef = null;

        this.modelProgress.set(100);
        this.isModelRunning.set(false);

        file.status = 'completed';
        file.progress = 100;

        this.msg.success('Model execution complete!');
      } else {
        const nextVal = current + 10;
        this.modelProgress.set(nextVal);
        file.progress = nextVal;
      }
    }, 250);
  }

  saveToResultDB(): void {
    this.msg.success('Saved to Result Database!');
  }

  // Data Preview Handlers
  isInvalidCell(val: any): boolean {
    if (val === undefined || val === null) return true;
    const str = String(val).trim().toLowerCase();
    return str === '' || str === 'null';
  }

  updateColumnName(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const oldName = this.tableColumns()[index];
    const newName = input.value.trim();

    if (!newName || oldName === newName) return;

    this.tableColumns.update(cols => {
      const updated = [...cols];
      updated[index] = newName;
      return updated;
    });

    this.tableData.update(data =>
      data.map(row => {
        const newRow: TableRow = { index: row['index'] };
        Object.keys(row).forEach(key => {
          if (key === oldName) newRow[newName] = row[oldName];
          else if (key !== 'index') newRow[key] = row[key];
        });
        return newRow;
      })
    );
  }

  addNewColumn(): void {
    const colCount = this.tableColumns().length + 1;
    const newColName = `Col_${colCount}`;
    this.tableColumns.update(cols => [...cols, newColName]);
    this.tableData.update(data => data.map(row => ({ ...row, [newColName]: '' })));
  }

  addNewRow(): void {
    const newIndex = this.tableData().length + 1;
    const newRow: TableRow = { index: newIndex };
    this.tableColumns().forEach(col => (newRow[col] = ''));
    this.tableData.update(data => [...data, newRow]);
  }

  dropColumn(colIndex: number): void {
    const colName = this.tableColumns()[colIndex];
    this.tableColumns.update(cols => cols.filter((_, i) => i !== colIndex));
    this.tableData.update(data =>
      data.map(row => {
        const newRow = { ...row };
        delete newRow[colName];
        return newRow;
      })
    );
  }

  deleteRow(rowIndex: number): void {
    this.tableData.update(data => data.filter((_, i) => i !== rowIndex));
  }

  resetToOriginal(): void {
    const backup = this.rawBackupData();
    this.tableColumns.set([...backup.cols]);
    this.tableData.set(JSON.parse(JSON.stringify(backup.rows)));
  }

  ngOnDestroy(): void {
    if (this.modelIntervalRef) {
      clearInterval(this.modelIntervalRef);
    }
  }
}