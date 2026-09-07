import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// --- Shared Response Interface ---

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
  metadata?: any;
  requestId: string;
  timestamp: string;
}

// --- System Entities ---

/** Summary for List View (Api2) */
export interface SystemSummaryItem {
  systemId: string;
  name: string;
  type: string;
  status: string;
  criticality: string;
  operatingHours: string;
  lastActivityAt: string;
  healthStatus: string;
  modelCount: number;
  analysisCount: number;
  createdAt: string;
}

/** Detailed System Information (Api3) */
export interface SystemDetail {
  systemMetadata: {
    id: string;
    unitId: string;
    unitName: string;
    name: string;
    description: string;
    type: string;
    status: string;
    state: string;
    healthStatus: string;
    uptime: string;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    createdByName: string;
    lastActivityAt: string;
    isActive: boolean;
    isArchived: boolean;
  };
  configuration: any; // Contains deep nesting for protocols, limits, and alerting
  systemProperties: {
    inputProperties: any[];
    outputProperties: any[];
  };
  models: {
    modelsList: any[];
    totalModels: number;
  };
  analyses: {
    analysesList: any[];
    totalAnalyses: number;
  };
  usageStats: any;
  activityLogs: any;
}

// --- Specific Response Data Payloads ---

export interface UnitSystemsData {
  unitId: string;
  systems: SystemSummaryItem[];
  total: number;
  systemSummary: {
    activeCount: number;
    healthyCount: number;
    [key: string]: any;
  };
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    hasMore: boolean;
  };
}

export interface ActionResponseData {
  success: boolean;
  status: 'ACTIVE' | 'INACTIVE' | 'DELETED';
}

@Injectable({
  providedIn: 'root'
})
export class SystemService {
  private apiUrl = environment.apiUrl;


  constructor(private http: HttpClient) { }

  createSystem(unitId: string, payload: { name: string; type: string }): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/v1/waves/units/${unitId}/systems`, payload);
  }

  getSystemsByUnit(unitId: string): Observable<ApiResponse<UnitSystemsData>> {
    const listUrl = `${this.apiUrl}/waves/units/${unitId}/systems`;
    return this.http.get<ApiResponse<UnitSystemsData>>(listUrl);
  }


  getSystemById(unitId: string, systemId: string): Observable<ApiResponse<SystemDetail>> {
    return this.http.get<ApiResponse<SystemDetail>>(`${this.apiUrl}/v1/waves/units/${unitId}/systems/${systemId}`);
  }

  updateSystem(unitId: string, systemId: string, data: { name: string; description: string }): Observable<ApiResponse<ActionResponseData>> {
    return this.http.put<ApiResponse<ActionResponseData>>(`${this.apiUrl}/v1/waves/units/${unitId}/systems/${systemId}`, data);
  }

  deleteSystem(unitId: string, systemId: string): Observable<ApiResponse<ActionResponseData>> {
    return this.http.delete<ApiResponse<ActionResponseData>>(`${this.apiUrl}/v1/waves/units/${unitId}/systems/${systemId}`);
  }

  deactivateSystem(unitId: string, systemId: string): Observable<ApiResponse<ActionResponseData>> {
    return this.http.put<ApiResponse<ActionResponseData>>(`${this.apiUrl}/v1/waves/units/${unitId}/systems/${systemId}/deactivate`, {});
  }

  activateSystem(unitId: string, systemId: string): Observable<ApiResponse<ActionResponseData>> {
    return this.http.put<ApiResponse<ActionResponseData>>(`${this.apiUrl}/v1/waves/units/${unitId}/systems/${systemId}/activate`, {});
  }
}