import { Component } from '@angular/core';
import { ModelSummary } from '../model-summary/model-summary';
import { ModelBlockDetails } from '../model-block-details/model-block-details';
@Component({
  selector: 'app-model-configuration',
  imports: [ModelSummary, ModelBlockDetails],
  templateUrl: './model-configuration.html',
  styleUrl: './model-configuration.css',
})
export class ModelConfiguration {

}
