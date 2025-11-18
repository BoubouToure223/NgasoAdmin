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
  id: number;
  role: string;
  message: string;
  token: string;
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

  logout(): void {
    localStorage.removeItem('ngaso_token');
    localStorage.removeItem('ngaso_role');
    this.router.navigate(['/login']);
  }
}
