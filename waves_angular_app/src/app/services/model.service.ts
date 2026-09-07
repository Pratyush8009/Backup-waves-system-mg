import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// --- Base API Envelope ---
export interface BaseApiResponse<T> {
  code: number;
  message: string;
  data: T;
  metadata: any;
  requestId: string;
  timestamp: string;
}

// --- API 1: Model Info Interfaces ---
export interface ModelDetails {
  id: string;
  systemId: string;
  name: string;
  description: string;
  version: string;
  stage: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  // Metadata made optional to support the ?. operator in HTML
  metadata?: {
    owner?: string;
    department?: string;
    tags?: string[];
  };
  systemProperties: any;
  propertiesGroup: any;
  dataMapper: any;
  uploadedFiles: any[];
  pipelineId: string;
  versionHistory: any[];
}

export interface ModelPayload {
  name: string;
  description: string;
  type: string;
  category: string;
}

// --- API 4: Model Summary Interfaces ---
export interface ModelSummary {
  modelId: string;
  pipelineId: string;
  executionId: string;
  executionStatus: string;
  summary: {
    trainingMetrics: any;
    evaluationMetrics: any;
    datasetInfo: any;
    modelArchitecture: any;
    predictionRange: {
      min: number;
      max: number;
      mean: number;
      std: number;
    };
  };
  completedAt: string;
  generatedArtifacts: any[];
}

export interface ModelPlots {
  modelId: string;
  plotsByCategory: { [key: string]: { heading: string; description: string; plots: any[] } };
  totalPlots: number;
  categories: string[];
}

export interface PipelineDetails {
  id: string;
  entityId: string;
  name: string;
  blocks: any[];
  blockConnections: any[];
}

@Injectable({
  providedIn: 'root'
})
export class ModelService {
  private apiUrl = environment.apiUrl;



  constructor(private http: HttpClient) { }

  getModelDetails(unitId: string, systemId: string, modelId: string): Observable<BaseApiResponse<ModelDetails>> {
    return this.http.get<BaseApiResponse<ModelDetails>>(`${this.apiUrl}/v1/waves/unit/${unitId}/system/${systemId}/models/${modelId}`);
  }

  getModelSummary(unitId: string, systemId: string, modelId: string): Observable<BaseApiResponse<ModelSummary>> {
    return this.http.get<BaseApiResponse<ModelSummary>>(`${this.apiUrl}/v1/waves/unit/${unitId}/system/${systemId}/models/${modelId}/results/summary`);
  }

  createModel(unitId: string, systemId: string, payload: ModelPayload): Observable<BaseApiResponse<any>> {
    return this.http.post<BaseApiResponse<any>>(`${this.apiUrl}/v1/waves/unit/${unitId}/system/${systemId}/models`, payload);
  }

  updateModel(unitId: string, systemId: string, modelId: string, payload: ModelPayload): Observable<BaseApiResponse<any>> {
    return this.http.put<BaseApiResponse<any>>(`${this.apiUrl}/v1/waves/unit/${unitId}/system/${systemId}/models/${modelId}`, payload);
  }

  getModelPlots(unitId: string, systemId: string, modelId: string): Observable<BaseApiResponse<ModelPlots>> {
    return this.http.get<BaseApiResponse<ModelPlots>>(`${this.apiUrl}/v1/waves/unit/${unitId}/system/${systemId}/models/${modelId}/plots`);
  }

  getModelPipeline(modelId: string, pipelineId: string): Observable<BaseApiResponse<PipelineDetails>> {
    return this.http.get<BaseApiResponse<PipelineDetails>>(`${this.apiUrl}/v1/waves/models/${modelId}/pipelines/${pipelineId}/`);
  }

  updateModelStatus(unitId: string, systemId: string, modelId: string, status: string): Observable<BaseApiResponse<any>> {
    return this.http.put<BaseApiResponse<any>>(`${this.apiUrl}/v1/waves/unit/${unitId}/system/${systemId}/models/${modelId}/status`, { status });
  }
}