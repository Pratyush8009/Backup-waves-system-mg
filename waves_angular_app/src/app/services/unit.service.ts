import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/** * --- Interfaces for the New API Structure ---
 */

export interface UnitListItem {
  id: string;
  name: string;
  type: string;
  accessLevel: string;
  assignedAt: string;
  systemCount: number;
  state: string;
  status: string;
  planType: string;
  membersCount: number;
  lastAccessedAt: string;
}

export interface SystemListItem {
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

export interface UnitMetadata {
  unitId: string;
  name: string;
  type: string;
  description: string;
  location: string;
  state: string;
  status: string;
  clientId: string;
  clientName: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  // ... add other fields from the response as needed
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
  metadata: any;
  requestId: string;
  timestamp: string;
}

/** * --- DTOs ---
 */

export interface CreateUnitDto {
  name: string;
  type: string;
  description: string;
  userId: string;
}

export interface UpdateUnitDto {
  name: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class UnitService {
  private apiUrl = 'http://localhost:8080/api/v1/waves';

  constructor(private http: HttpClient) { }

  /**
   * API 1: Get units for a specific user
   * GET /users/<user_id>/units
   */
  getUnitsByUserId(userId: string): Observable<ApiResponse<{ units: UnitListItem[], total: number }>> {
    return this.http.get<ApiResponse<{ units: UnitListItem[], total: number }>>(
      `${this.apiUrl}/users/${userId}/units`
    );
  }

  /**
   * API 2: Get systems for a specific unit
   * GET /units/<unit_id>/systems
   */
  getSystemsByUnitId(unitId: string): Observable<ApiResponse<{ systems: SystemListItem[], total: number, systemSummary: any }>> {
    return this.http.get<ApiResponse<{ systems: SystemListItem[], total: number, systemSummary: any }>>(
      `http://localhost:8080/api/waves/units/${unitId}/systems`
    );
  }

  /**
   * API 3: Create unit for a specific user
   * POST /units
   */
  createUnit(unitData: CreateUnitDto): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`http://localhost:8080/api/waves/units`, unitData);
  }

  /**
   * API 4: Get a unit details (Comprehensive details)
   * GET /units/<unit_id>
   */
  getUnitById(unitId: string): Observable<ApiResponse<{ unitMetadata: UnitMetadata, subscription: any, members: any, systems: any }>> {
    return this.http.get<ApiResponse<any>>(`http://localhost:8080/api/waves/units/${unitId}`);
  }

  /**
   * API 5: Update unit
   * PUT /units/<unit_id>
   */
  updateUnit(unitId: string, unitData: UpdateUnitDto): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`http://localhost:8080/api/waves/units/${unitId}`, unitData);
  }

  /**
   * API 6: Delete unit
   * DELETE /units/<unit_id>
   */
  deleteUnit(unitId: string): Observable<ApiResponse<{ success: boolean }>> {
    return this.http.delete<ApiResponse<{ success: boolean }>>(`http://localhost:8080/api/waves/units/${unitId}`);
  }
}