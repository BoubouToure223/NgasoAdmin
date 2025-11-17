import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersService, UtilisateurSummaryResponse } from '../services/users.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  private readonly usersService = inject(UsersService);

  // Onglet actif: 'particuliers' ou 'professionnels'
  activeTab: 'particuliers' | 'professionnels' = 'particuliers';

  // Données chargées depuis l'API
  allUsers: UtilisateurSummaryResponse[] = [];
  novices: UtilisateurSummaryResponse[] = [];
  professionnels: UtilisateurSummaryResponse[] = [];

  // Confirmation de désactivation
  showDeactivateConfirm = false;
  userPendingDeactivate: UtilisateurSummaryResponse | null = null;

  ngOnInit(): void {
    this.loadUsers();
  }

  selectTab(tab: 'particuliers' | 'professionnels'): void {
    this.activeTab = tab;
  }

  private loadUsers(): void {
    this.usersService.list().subscribe(users => {
      this.allUsers = users;
      this.novices = users.filter(u => u.role === 'Novice');
      this.professionnels = users.filter(u => u.role === 'Professionnel');
    });
  }

  toggleUserActive(user: UtilisateurSummaryResponse): void {
    if (user.actif) {
      this.requestDeactivateUser(user);
      return;
    }

    // Activation directe sans confirmation
    this.usersService.enableUser(user.id).subscribe(updated => {
      this.updateUserLists(updated);
    });
  }

  requestDeactivateUser(user: UtilisateurSummaryResponse): void {
    this.userPendingDeactivate = user;
    this.showDeactivateConfirm = true;
  }

  cancelDeactivateUser(): void {
    this.showDeactivateConfirm = false;
    this.userPendingDeactivate = null;
  }

  confirmDeactivateUser(): void {
    if (!this.userPendingDeactivate) {
      return;
    }

    const target = this.userPendingDeactivate;
    this.usersService.disableUser(target.id).subscribe(updated => {
      this.updateUserLists(updated);
      this.showDeactivateConfirm = false;
      this.userPendingDeactivate = null;
    });
  }

  private updateUserLists(updated: UtilisateurSummaryResponse): void {
    this.allUsers = this.allUsers.map(u => (u.id === updated.id ? updated : u));
    this.novices = this.allUsers.filter(u => u.role === 'Novice');
    this.professionnels = this.allUsers.filter(u => u.role === 'Professionnel');
  }
}
