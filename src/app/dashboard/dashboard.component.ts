import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardService, DashboardStatsResponse } from '../services/dashboard.service';

interface Specialty {
  name: string;
  professionals: number;
}

interface Registration {
  id: number;
  name: string;
  specialty: string;
  date: string;
  status: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);

  searchQuery = '';
  newSpecialty = '';

  stats = [
    {
      title: 'Utilisateurs totaux',
      value: '0',
      change: '0%',
      changeLabel: 'vs mois précédent',
      iconClass: 'users',
      iconColor: 'blue',
      changeType: 'neutral'
    },
    {
      title: 'Projets actifs',
      value: '0',
      change: '0%',
      changeLabel: 'vs mois précédent',
      iconClass: 'folder',
      iconColor: 'yellow',
      changeType: 'neutral'
    },
    {
      title: 'Projets ce mois',
      value: '0',
      change: '0%',
      changeLabel: 'vs mois précédent',
      iconClass: 'file',
      iconColor: 'purple',
      changeType: 'neutral'
    },
    {
      title: "Taux d'achèvement",
      value: '0%',
      change: '0%',
      changeLabel: 'vs mois précédent',
      iconClass: 'trending',
      iconColor: 'orange',
      changeType: 'neutral'
    }
  ];

  specialties: Specialty[] = [
    { name: 'Peinture', professionals: 42 },
    { name: 'Électricité', professionals: 36 },
    { name: 'Maçonnerie', professionals: 28 }
  ];

  registrations: Registration[] = [
    { id: 1, name: 'Jean Dupont', specialty: 'Plomberie', date: '12/05/2023', status: 'En attente' },
    { id: 2, name: 'Marie Laurent', specialty: 'Électricité', date: '14/05/2023', status: 'En attente' },
    { id: 3, name: 'Thomas Mercier', specialty: 'Maçonnerie', date: '15/05/2023', status: 'En attente' },
    { id: 4, name: 'Sophie Leroy', specialty: 'Plomberie', date: '16/05/2023', status: 'En attente' }
  ];

  currentPage = 1;
  totalPages = 2;

  ngOnInit(): void {
    this.loadStats();
  }

  private loadStats(): void {
    this.dashboardService.getStats().subscribe({
      next: (response: DashboardStatsResponse) => {
        this.stats = [
          {
            title: 'Utilisateurs totaux',
            value: response.utilisateursTotaux.value.toString(),
            change: `${response.utilisateursTotaux.changePercent}%`,
            changeLabel: 'vs mois précédent',
            iconClass: 'users',
            iconColor: 'blue',
            changeType: this.getChangeType(response.utilisateursTotaux.changePercent)
          },
          {
            title: 'Projets actifs',
            value: response.projetsActifs.value.toString(),
            change: `${response.projetsActifs.changePercent}%`,
            changeLabel: 'vs mois précédent',
            iconClass: 'folder',
            iconColor: 'yellow',
            changeType: this.getChangeType(response.projetsActifs.changePercent)
          },
          {
            title: 'Projets ce mois',
            value: response.projetsCeMois.value.toString(),
            change: `${response.projetsCeMois.changePercent}%`,
            changeLabel: 'vs mois précédent',
            iconClass: 'file',
            iconColor: 'purple',
            changeType: this.getChangeType(response.projetsCeMois.changePercent)
          },
          {
            title: "Taux d'achèvement",
            value: `${response.tauxAchevement.value}%`,
            change: `${response.tauxAchevement.changePercent}%`,
            changeLabel: 'vs mois précédent',
            iconClass: 'trending',
            iconColor: 'orange',
            changeType: this.getChangeType(response.tauxAchevement.changePercent)
          }
        ];
      },
      error: (err) => {
        console.error('Erreur lors du chargement des stats du dashboard', err);
      }
    });
  }

  private getChangeType(changePercent: number): 'positive' | 'negative' | 'neutral' {
    if (changePercent > 0) {
      return 'positive';
    }
    if (changePercent < 0) {
      return 'negative';
    }
    return 'neutral';
  }

  addSpecialty(): void {
    if (this.newSpecialty.trim()) {
      this.specialties.push({
        name: this.newSpecialty,
        professionals: 0
      });
      this.newSpecialty = '';
    }
  }

  deleteSpecialty(name: string): void {
    this.specialties = this.specialties.filter((s) => s.name !== name);
  }

  viewDocument(id: number): void {
    console.log('Viewing document for registration:', id);
  }

  validateRegistration(id: number, name: string): void {
    console.log('Validating registration:', id, name);
    // Implémenter la logique de validation
  }

  rejectRegistration(id: number, name: string): void {
    console.log('Rejecting registration:', id, name);
    // Implémenter la logique de rejet
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
}
