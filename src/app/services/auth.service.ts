import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

export interface AuthLoginRequest {
  email?: string;
  telephone?: string;
  password: string;
}

export interface AuthLoginResponse {
  userId: number;
  role: string;
  message: string;
  token: string;
  refreshToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly apiUrl = 'http://localhost:8080/api/v1';

  loginAdmin(email: string, password: string): Observable<AuthLoginResponse> {
    const payload: AuthLoginRequest = { email, password };
    return this.http.post<AuthLoginResponse>(`${this.apiUrl}/auth/login`, payload);
  }

  refresh(refreshToken: string): Observable<AuthLoginResponse> {
    return this.http.post<AuthLoginResponse>(`${this.apiUrl}/auth/refresh`, { refreshToken });
  }

  logout(): void {
    localStorage.removeItem('ngaso_token');
    localStorage.removeItem('ngaso_role');
    localStorage.removeItem('ngaso_refresh_token');
    localStorage.removeItem('ngaso_user_id');
    this.router.navigate(['/login']);
  }
}
