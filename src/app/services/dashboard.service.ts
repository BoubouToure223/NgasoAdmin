import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface DashboardStatItem {
  value: number;
  changePercent: number;
}

export interface DashboardStatsResponse {
  utilisateursTotaux: DashboardStatItem;
  projetsActifs: DashboardStatItem;
  projetsCeMois: DashboardStatItem;
  tauxAchevement: DashboardStatItem;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/api/v1/admin/dashboard/stats`;

  getStats(): Observable<DashboardStatsResponse> {
    return this.http.get<DashboardStatsResponse>(this.baseUrl);
  }
}
