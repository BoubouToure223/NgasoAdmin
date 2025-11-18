import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface UtilisateurSummaryResponse {
  id: number;
  nom: string;
  prenom: string;
  telephone: string;
  adresse: string;
  email: string;
  role: string;
  actif: boolean;
  dateInscription: string | null;
  nombreProjetsNovice: number;
}

export interface PagedUtilisateurResponse {
  items: UtilisateurSummaryResponse[];
  page: number;
  size: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
}

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/api/v1/admin/utilisateurs`;

  list(page: number, size: number, role?: 'Novice' | 'Professionnel'): Observable<PagedUtilisateurResponse> {
    const params: any = { page: page.toString(), size: size.toString() };

    if (role) {
      params.role = role;
    }

    return this.http.get<PagedUtilisateurResponse>(this.baseUrl, { params });
  }

  enableUser(id: number): Observable<UtilisateurSummaryResponse> {
    return this.http.post<UtilisateurSummaryResponse>(`${this.baseUrl}/${id}/enable`, {});
  }

  disableUser(id: number): Observable<UtilisateurSummaryResponse> {
    return this.http.post<UtilisateurSummaryResponse>(`${this.baseUrl}/${id}/disable`, {});
  }
}
