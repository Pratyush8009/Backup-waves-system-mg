import { Component } from '@angular/core';
import { ConfigurePage } from '../../../pages/configure-page/configure-page';
import { FlowEditor } from '../../../pages/flow-editor/flow-editor';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-model-editor',
  imports: [ConfigurePage, FlowEditor, FormsModule,CommonModule],
  templateUrl: './model-editor.html',
  styleUrl: './model-editor.css',
})
export class ModelEditor {
  isFullScreen = false;
  isConfigFullscreen = true;
  isFlowMode = false;

  onFullscreenChange(isFullscreen: boolean) {
    this.isFullScreen = isFullscreen;
  }

  toggleEditor() {
    this.isFlowMode = !this.isFlowMode;
  }
}
