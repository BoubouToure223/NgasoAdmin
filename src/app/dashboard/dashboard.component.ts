import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
export class DashboardComponent {
  searchQuery = '';
  newSpecialty = '';

  stats = [
    {
      title: 'Utilisateurs totaux',
      value: '1,245',
      change: '+12%',
      changeLabel: 'vs mois précédent',
      iconClass: 'users',
      iconColor: 'blue',
      changeType: 'positive'
    },
    {
      title: 'Projets actifs',
      value: '328',
      change: '+5%',
      changeLabel: 'vs mois précédent',
      iconClass: 'folder',
      iconColor: 'yellow',
      changeType: 'positive'
    },
    {
      title: 'Projets ce mois',
      value: '87',
      change: '+18%',
      changeLabel: 'vs mois précédent',
      iconClass: 'file',
      iconColor: 'purple',
      changeType: 'positive'
    },
    {
      title: "Taux d'achèvement",
      value: '67%',
      change: '+3%',
      changeLabel: 'vs mois précédent',
      iconClass: 'trending',
      iconColor: 'orange',
      changeType: 'positive'
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
