import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

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

  private apiUrl = environment.apiUrl;


  constructor(private http: HttpClient) { }

  getUnitsByUserId(userId: string): Observable<ApiResponse<{ units: UnitListItem[], total: number }>> {
    return this.http.get<ApiResponse<{ units: UnitListItem[], total: number }>>(
      `${this.apiUrl}/v1/waves/users/${userId}/units`
    );
  }

  getSystemsByUnitId(unitId: string): Observable<ApiResponse<{ systems: SystemListItem[], total: number, systemSummary: any }>> {
    return this.http.get<ApiResponse<{ systems: SystemListItem[], total: number, systemSummary: any }>>(
      `${this.apiUrl}/v1/waves/units/${unitId}/systems`
    );
  }

  createUnit(unitData: CreateUnitDto): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/v1/waves/units`, unitData);
  }

  getUnitById(unitId: string): Observable<ApiResponse<{ unitMetadata: UnitMetadata, subscription: any, members: any, systems: any }>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/waves/units/${unitId}`);
  }

  updateUnit(unitId: string, unitData: UpdateUnitDto): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.apiUrl}/waves/units/${unitId}`, unitData);
  }

  deleteUnit(unitId: string): Observable<ApiResponse<{ success: boolean }>> {
    return this.http.delete<ApiResponse<{ success: boolean }>>(`${this.apiUrl}/waves/units/${unitId}`);
  }
}