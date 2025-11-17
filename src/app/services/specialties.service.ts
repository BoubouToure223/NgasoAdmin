import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SpecialiteResponse {
  id: number;
  libelle: string;
  nombreProfessionnels: number;
}

export interface SpecialiteCreateRequest {
  libelle: string;
}

@Injectable({
  providedIn: 'root'
})
export class SpecialtiesService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8080/api/v1/admin/specialites';

  list(): Observable<SpecialiteResponse[]> {
    return this.http.get<SpecialiteResponse[]>(this.baseUrl);
  }

  create(libelle: string): Observable<SpecialiteResponse> {
    const body: SpecialiteCreateRequest = { libelle };
    return this.http.post<SpecialiteResponse>(this.baseUrl, body);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
