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

// --- API: Block Flow Interfaces ---

export interface Port {
  id: string;
  name: string;
  portType: 'INPUT' | 'OUTPUT';
  portOrder: number;
}

export interface NodeUiLayout {
  canvasX: number;
  canvasY: number;
  canvasWidth: number;
  canvasHeight: number;
  color: string;
  icon: string;
  borderStyle: string;
}

export interface PipelineNode {
  id: string;
  nodeId: string;
  name: string;
  nodeType: 'INPUT' | 'PROCESSOR' | 'OUTPUT';
  category: string;
  order: number;
  ports: Port[];
  config: any;
  uiLayout: NodeUiLayout;
}

export interface NodeConnection {
  id: string;
  sourceNodeInstanceId: string;
  targetNodeInstanceId: string;
  sourcePortId: string;
  targetPortId: string;
}

export interface PipelineFlow {
  id: string;
  name: string;
  flowType: 'SEQUENTIAL' | 'PARALLEL';
  priorityLevel: number;
  status: string;
  nodes: PipelineNode[];
  nodeConnections: NodeConnection[];
}

export interface BlockFlowDetails {
  id: string;
  blockId: string;
  name: string;
  description: string;
  blockType: string;
  category: string;
  flows: PipelineFlow[];
}

@Injectable({
  providedIn: 'root'
})
export class ModelPipelineService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }


  getBlockFlow(
    modelId: string,
    pipelineId: string,
    blockId: string
  ): Observable<BaseApiResponse<BlockFlowDetails>> {
    const url = `${this.apiUrl}/v1/waves/models/${modelId}/pipelines/${pipelineId}/block/${blockId}`;
    return this.http.get<BaseApiResponse<BlockFlowDetails>>(url);
  }
}