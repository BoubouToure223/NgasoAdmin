import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Registration {
  id: number;
  name: string;
  specialty: string;
  date: string;
  telephone: string;
  email: string;
  status: string;
}

@Component({
  selector: 'app-professional-requests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './professional-requests.component.html',
  styleUrls: ['./professional-requests.component.css']
})
export class ProfessionalRequestsComponent {
  registrations: Registration[] = [
    {
      id: 1,
      name: 'Jean Dupont',
      specialty: 'Plomberie',
      date: '12/05/2023',
      telephone: '+33 6 12 34 56 78',
      email: 'jean.dupont@example.com',
      status: 'En attente'
    },
    {
      id: 2,
      name: 'Marie Laurent',
      specialty: 'Électricité',
      date: '14/05/2023',
      telephone: '+33 6 23 45 67 89',
      email: 'marie.laurent@example.com',
      status: 'En attente'
    },
    {
      id: 3,
      name: 'Thomas Mercier',
      specialty: 'Maçonnerie',
      date: '15/05/2023',
      telephone: '+33 6 34 56 78 90',
      email: 'thomas.mercier@example.com',
      status: 'En attente'
    },
    {
      id: 4,
      name: 'Sophie Leroy',
      specialty: 'Plomberie',
      date: '16/05/2023',
      telephone: '+33 6 45 67 89 01',
      email: 'sophie.leroy@example.com',
      status: 'En attente'
    }
  ];

  currentPage = 1;
  totalPages = 2;

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
