import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ProfessionnelSummaryResponse {
  id: number;
  nom: string;
  prenom: string;
  telephone: string;
  adresse: string;
  email: string;
  entreprise: string;
  description: string;
  estValider: boolean;
  documentJustificatif: string;
  specialiteId: number | null;
  specialiteLibelle: string | null;
  dateInscription: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class ProfessionalRequestsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/v1/admin/professionnels/pending';

  listPending(): Observable<ProfessionnelSummaryResponse[]> {
    return this.http.get<ProfessionnelSummaryResponse[]>(this.apiUrl);
  }

  validate(id: number): Observable<ProfessionnelSummaryResponse> {
    return this.http.post<ProfessionnelSummaryResponse>(
      `http://localhost:8080/api/v1/admin/professionnels/${id}/validate`,
      {}
    );
  }

  reject(id: number): Observable<ProfessionnelSummaryResponse> {
    return this.http.post<ProfessionnelSummaryResponse>(
      `http://localhost:8080/api/v1/admin/professionnels/${id}/reject`,
      {}
    );
  }
}
