import { Component, signal, computed, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzUploadModule, NzUploadFile, NzUploadChangeParam } from 'ng-zorro-antd/upload';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzMessageService } from 'ng-zorro-antd/message';

interface ValidationItem {
  label: string;
  status: 'pending' | 'success' | 'loading';
}

@Component({
  selector: 'app-testing',
  standalone: true,
  imports: [
    CommonModule,
    NzButtonModule,
    NzIconModule,
    NzListModule,
    NzCardModule,
    NzStepsModule,
    NzUploadModule,
    NzProgressModule
  ],
  templateUrl: './testing.html',
  styleUrl: './testing.css'
})
export class Testing implements OnDestroy {
  currentStep = signal<number>(0);

  isFullValidating = signal<boolean>(false);
  isRunningModel = signal<boolean>(false);
  progressValue = signal<number>(0);

  fileList: NzUploadFile[] = [];
  private timer: ReturnType<typeof setInterval> | null = null;

  validationSteps = signal<ValidationItem[]>([
    { label: 'System is Active', status: 'pending' },
    { label: 'System input schema defined', status: 'pending' },
    { label: 'System output schema defined', status: 'pending' },
    { label: 'All blocks are connected', status: 'pending' },
    { label: 'Block schema validation', status: 'pending' },
    { label: 'All flows mapped', status: 'pending' },
    { label: 'Flow schema validation', status: 'pending' },
    { label: 'No circular dependency', status: 'pending' },
    { label: 'Template selected', status: 'pending' },
    { label: 'Nodes in block are configured', status: 'pending' },
    { label: 'All nodes in flow are configured', status: 'pending' },
  ]);

  canProceedToStep2 = computed(() =>
    this.validationSteps().every(step => step.status === 'success')
  );

  hasRunModelSucceeded = signal<boolean>(false);
  canProceedToStep3 = computed(() => this.hasRunModelSucceeded());

  constructor(private msg: NzMessageService) { }

  goToStep(stepIndex: number): void {
    if (stepIndex === 1 && !this.canProceedToStep2()) return;
    if (stepIndex === 2 && !this.canProceedToStep3()) return;
    this.currentStep.set(stepIndex);
  }

  runTest(index: number): void {
    this.updateStatus(index, 'loading');

    setTimeout(() => {
      this.updateStatus(index, 'success');
    }, 400);
  }

  runFullValidation(): void {
    this.isFullValidating.set(true);

    this.validationSteps().forEach((_, i) => {
      setTimeout(() => {
        this.updateStatus(i, 'success');

        if (i === this.validationSteps().length - 1) {
          this.isFullValidating.set(false);
        }
      }, (i + 1) * 150);
    });
  }

  private updateStatus(index: number, status: 'pending' | 'success' | 'loading'): void {
    this.validationSteps.update(steps => {
      const newSteps = [...steps];
      newSteps[index] = { ...newSteps[index], status };
      return newSteps;
    });
  }

  // --- Step 2 Upload & Progress Logic ---
  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = [file];
    this.progressValue.set(0);
    this.hasRunModelSucceeded.set(false);
    return false;
  };

  handleFileChange(info: NzUploadChangeParam): void {
    if (info.fileList.length === 0) {
      this.fileList = [];
      this.progressValue.set(0);
      this.hasRunModelSucceeded.set(false);
    }
  }

  runModel(): void {
    if (this.fileList.length === 0) return;

    this.isRunningModel.set(true);
    this.progressValue.set(0);
    this.hasRunModelSucceeded.set(false);

    // 30 seconds total = 30000ms. Increments 1% every 300ms
    const totalDuration = 30000;
    const intervalTime = 300;

    this.timer = setInterval(() => {
      this.progressValue.update(val => {
        if (val >= 99) {
          this.clearTimer();
          this.isRunningModel.set(false);
          this.hasRunModelSucceeded.set(true);
          this.msg.success('Model execution complete! Click Next to view results.');
          return 100;
        }
        return val + 1;
      });
    }, intervalTime);
  }

  private clearTimer(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }
}