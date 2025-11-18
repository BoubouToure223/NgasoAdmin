import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfessionalRequestsService, ProfessionnelSummaryResponse, PagedProfessionnelResponse } from '../services/professional-requests.service';

interface Registration {
  id: number;
  name: string;
  specialty: string;
  date: string;
  telephone: string;
  email: string;
  documentFilename: string | null;
  status: string;
}

@Component({
  selector: 'app-professional-requests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './professional-requests.component.html',
  styleUrls: ['./professional-requests.component.css']
})
export class ProfessionalRequestsComponent implements OnInit {
  registrations: Registration[] = [];

  private readonly service = inject(ProfessionalRequestsService);

  loading = false;
  errorMessage: string | null = null;

  // Pagination
  page = 0;
  size = 10;
  total = 0;
  totalPages = 0;

  ngOnInit(): void {
    this.loadRegistrations(0);
  }

  private mapToRegistration(p: ProfessionnelSummaryResponse): Registration {
    const name = [p.prenom, p.nom].filter((v) => !!v).join(' ');
    const specialty = p.specialiteLibelle ?? 'Non renseignée';
    const date = p.dateInscription ? new Date(p.dateInscription).toLocaleDateString() : '—';

    let documentFilename: string | null = null;
    if (p.documentJustificatif) {
      const parts = p.documentJustificatif.split(/[/\\]/);
      documentFilename = parts[parts.length - 1] || null;
    }

    return {
      id: p.id,
      name,
      specialty,
      date,
      telephone: p.telephone,
      email: p.email,
      documentFilename,
      status: p.estValider ? 'Validé' : 'En attente'
    };
  }

  private loadRegistrations(page: number): void {
    this.loading = true;
    this.errorMessage = null;

    this.service.listPending(page, this.size).subscribe({
      next: (res: PagedProfessionnelResponse) => {
        this.page = res.page ?? 0;
        this.size = res.size ?? this.size;
        this.total = res.total ?? 0;
        this.totalPages = res.totalPages ?? 0;

        const items = res.items ?? [];
        this.registrations = items.map((p) => this.mapToRegistration(p));
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Erreur lors du chargement des demandes de professionnels';
      }
    });
  }

  goToPage(page: number): void {
    if (page < 0 || (this.totalPages && page >= this.totalPages) || page === this.page) {
      return;
    }
    this.loadRegistrations(page);
  }

  viewDocument(filename: string | null): void {
    if (!filename) {
      return;
    }

    const url = `http://localhost:8080/api/v1/files/justificatifs/${encodeURIComponent(filename)}`;
    window.open(url, '_blank');
  }

  validateRegistration(id: number, name: string): void {
    this.loading = true;
    this.errorMessage = null;

    this.service.validate(id).subscribe({
      next: (updated) => {
        this.registrations = this.registrations.map((r) =>
          r.id === updated.id
            ? {
                ...r,
                status: updated.estValider ? 'Validé' : r.status
              }
            : r
        );
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = `Erreur lors de la validation de ${name}`;
      }
    });
  }

  rejectRegistration(id: number, name: string): void {
    this.loading = true;
    this.errorMessage = null;

    this.service.reject(id).subscribe({
      next: (removed) => {
        this.registrations = this.registrations.filter((r) => r.id !== removed.id);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = `Erreur lors du rejet de ${name}`;
      }
    });
  }
}
