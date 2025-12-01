import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface ModeleEtapeResponse {
  id: number;
  nom: string;
  description: string;
  ordre: number;
  specialiteIds: number[];
  specialiteLibelles: string[];
  nombreIllustrations: number;
}

export interface ModeleEtapeCreateRequest {
  nom: string;
  description?: string;
  ordre: number;
  specialiteIds: number[];
}

export interface IllustrationResponse {
  id: number;
  titre: string;
  description: string;
  urlImage: string;
  modeleId: number;
}

@Injectable({ providedIn: 'root' })
export class StepsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/api/v1/admin/modeles-etapes`;

  list(): Observable<ModeleEtapeResponse[]> {
    return this.http.get<ModeleEtapeResponse[]>(this.baseUrl);
  }

  create(payload: ModeleEtapeCreateRequest): Observable<ModeleEtapeResponse> {
    return this.http.post<ModeleEtapeResponse>(this.baseUrl, payload);
  }

  addIllustration(
    modeleId: number,
    data: { titre: string; description?: string },
    file: File
  ): Observable<IllustrationResponse> {
    const formData = new FormData();
    const payload = {
      titre: data.titre,
      description: data.description ?? ''
    };
    const jsonBlob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
    // Provide a filename to ensure proper part handling in some servers
    formData.append('data', jsonBlob, 'data.json');
    formData.append('image', file);

    return this.http.post<IllustrationResponse>(`${this.baseUrl}/${modeleId}/illustrations`, formData);
  }

  listIllustrations(modeleId: number): Observable<IllustrationResponse[]> {
    return this.http.get<IllustrationResponse[]>(`${this.baseUrl}/${modeleId}/illustrations`);
  }

  deleteIllustration(id: number): Observable<void> {
    const url = `${environment.apiBaseUrl}/api/v1/admin/illustrations/${id}`;
    return this.http.delete<void>(url);
  }

  deleteModeleEtape(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  uploadProfileImage(modeleId: number, file: File): Observable<IllustrationResponse> {
    const formData = new FormData();
    formData.append('image', file);

    return this.http.post<IllustrationResponse>(
      `${environment.apiBaseUrl}/api/v1/admin/modeles-etapes/${modeleId}/image-profil`,
      formData
    );
  }

  getProfileImage(modeleId: number): Observable<string> {
    return this.http.get(`${environment.apiBaseUrl}/api/v1/admin/modeles-etapes/${modeleId}/image-profil`, {
      responseType: 'text'
    });
  }
}

