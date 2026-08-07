// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) { }


  validateUser(userId: string): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.apiUrl}/${userId}`);
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