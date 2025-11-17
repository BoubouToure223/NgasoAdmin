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
  dateInscription: string;
  nombreProjetsNovice: number;
}

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/api/v1/admin/utilisateurs`;

  list(): Observable<UtilisateurSummaryResponse[]> {
    return this.http.get<UtilisateurSummaryResponse[]>(this.baseUrl);
  }

  enableUser(id: number): Observable<UtilisateurSummaryResponse> {
    return this.http.post<UtilisateurSummaryResponse>(`${this.baseUrl}/${id}/enable`, {});
  }

  disableUser(id: number): Observable<UtilisateurSummaryResponse> {
    return this.http.post<UtilisateurSummaryResponse>(`${this.baseUrl}/${id}/disable`, {});
  }
}
