// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface UserResponse {
  success: boolean;
  data: {
    _id: string;
    name: string;
    email: string;
    __v: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
    private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }


  validateUser(userId: string): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.baseUrl}/users/${userId}`);
  }


  storeUserId(userId: string): void {
    localStorage.setItem('currentUserId', userId);
  }

  getStoredUserId(): string | null {
    return localStorage.getItem('currentUserId');
  }

  clearStoredUserId(): void {
    localStorage.removeItem('currentUserId');
  }


  isUserLoggedIn(): boolean {
    return !!this.getStoredUserId();
  }
}