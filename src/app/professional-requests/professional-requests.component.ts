import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfessionalRequestsService, ProfessionnelSummaryResponse } from '../services/professional-requests.service';

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

  ngOnInit(): void {
    this.loadRegistrations();
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

  private loadRegistrations(): void {
    this.loading = true;
    this.errorMessage = null;

    this.service.listPending().subscribe({
      next: (items) => {
        this.registrations = items.map((p) => this.mapToRegistration(p));
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Erreur lors du chargement des demandes de professionnels';
      }
    });
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
