import {
  Component,
  Input,
  ElementRef,
  ViewChild,
  AfterViewChecked,
  OnChanges,
  SimpleChanges,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';

export interface FlowLog {
  timestamp: Date;
  level: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
  message: string;
}

@Component({
  selector: 'app-logs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './logs.html',
  styleUrls: ['./logs.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Logs implements AfterViewChecked, OnChanges, OnDestroy {

  @Input() logs: FlowLog[] = [];
  interval = 2000;

  displayedLogs: FlowLog[] = [];
  private timer: any;

  @ViewChild('logContainer') private logContainer!: ElementRef;

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['logs']) {
      this.startLogAnimation();
    }
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  private startLogAnimation() {
    if (this.timer) {
      clearInterval(this.timer);
    }

    this.displayedLogs = [];
    this.cdr.detectChanges();

    let index = 0;

    this.timer = setInterval(() => {
      if (index < this.logs.length) {
        this.displayedLogs = [
          ...this.displayedLogs,
          this.logs[index]
        ];

        index++;

        this.cdr.detectChanges();
      } else {
        clearInterval(this.timer);
      }
    }, this.interval);
  }

  private scrollToBottom(): void {
    if (this.logContainer) {
      this.logContainer.nativeElement.scrollTop =
        this.logContainer.nativeElement.scrollHeight;
    }
  }

  getLevelClass(level: string): string {
    switch (level) {
      case 'ERROR': return 'log-error';
      case 'WARNING': return 'log-warning';
      case 'SUCCESS': return 'log-success';
      default: return 'log-info';
    }
  }
}
