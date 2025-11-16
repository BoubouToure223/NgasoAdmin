import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ProjetAdminItemResponse {
  id: number;
  titre: string;
  proprietaireNom?: string;
  proprietairePrenom?: string;
  localisation: string;
  budget: number;
  currentEtape?: string;
  progressPercent: number;
  dateCreation: string;
}

export interface PagedProjetAdminResponse {
  items: ProjetAdminItemResponse[];
  page: number;
  size: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/v1/admin/projets';

  list(page: number, size: number): Observable<PagedProjetAdminResponse> {
    const params = { page: page.toString(), size: size.toString() };
    return this.http.get<PagedProjetAdminResponse>(this.apiUrl, { params });
  }
}
