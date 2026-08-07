import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  // Base URL updated to match your new API endpoints
  private baseUrl = 'http://localhost:8080/api/v1/waves/units';

  constructor(private http: HttpClient) { }

  /**
   * API 1: Create System
   * POST /api/v1/waves/units/<unit_id>/systems
   */
  createSystem(unitId: string, payload: { name: string; type: string }): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/${unitId}/systems`, payload);
  }

  /**
   * API 2: Get all systems for a unit
   * GET /api/v1/waves/units/<unit_id>/systems
   */
  getSystemsByUnit(unitId: string): Observable<ApiResponse<UnitSystemsData>> {
    // Note: API 2 in your example uses /api/waves/ (no v1), 
    // but typically these are consistent. Adjusting to match your list URL:
    const listUrl = `http://localhost:8080/api/waves/units/${unitId}/systems`;
    return this.http.get<ApiResponse<UnitSystemsData>>(listUrl);
  }

  /**
   * API 3: Get specific system details
   * GET /api/v1/waves/units/<unit_id>/systems/<system_id>
   */
  getSystemById(unitId: string, systemId: string): Observable<ApiResponse<SystemDetail>> {
    return this.http.get<ApiResponse<SystemDetail>>(`${this.baseUrl}/${unitId}/systems/${systemId}`);
  }

  /**
   * API 4: Update a system
   * PUT /api/v1/waves/units/<unit_id>/systems/<system_id>
   */
  updateSystem(unitId: string, systemId: string, data: { name: string; description: string }): Observable<ApiResponse<ActionResponseData>> {
    return this.http.put<ApiResponse<ActionResponseData>>(`${this.baseUrl}/${unitId}/systems/${systemId}`, data);
  }

  /**
   * API 5: Delete a system
   * DELETE /api/v1/waves/units/<unit_id>/systems/<system_id>
   */
  deleteSystem(unitId: string, systemId: string): Observable<ApiResponse<ActionResponseData>> {
    return this.http.delete<ApiResponse<ActionResponseData>>(`${this.baseUrl}/${unitId}/systems/${systemId}`);
  }

  /**
   * API 6: Deactivate system
   * PUT /api/v1/waves/units/<unit_id>/systems/<system_id>/deactivate
   */
  deactivateSystem(unitId: string, systemId: string): Observable<ApiResponse<ActionResponseData>> {
    return this.http.put<ApiResponse<ActionResponseData>>(`${this.baseUrl}/${unitId}/systems/${systemId}/deactivate`, {});
  }

  /**
   * API 7: Activate a system
   * PUT /api/v1/waves/units/<unit_id>/systems/<system_id>/activate
   */
  activateSystem(unitId: string, systemId: string): Observable<ApiResponse<ActionResponseData>> {
    return this.http.put<ApiResponse<ActionResponseData>>(`${this.baseUrl}/${unitId}/systems/${systemId}/activate`, {});
  }
}