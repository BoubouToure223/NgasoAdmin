import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersService, UtilisateurSummaryResponse, PagedUtilisateurResponse } from '../services/users.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  private readonly usersService = inject(UsersService);

  // Onglet actif: 'particuliers' ou 'professionnels'
  activeTab: 'particuliers' | 'professionnels' = 'particuliers';

  // Données chargées depuis l'API
  // Listes par rôle (données brutes)
  novices: UtilisateurSummaryResponse[] = [];
  professionnels: UtilisateurSummaryResponse[] = [];

  // Listes filtrées pour l'affichage
  filteredNovices: UtilisateurSummaryResponse[] = [];
  filteredProfessionnels: UtilisateurSummaryResponse[] = [];

  // Recherche
  searchText = '';

  // Pagination particuliers (Novice)
  currentPageNovice = 0; // index basé sur 0 pour l'API
  totalNovice = 0;
  totalPagesNovice = 0;

  // Pagination professionnels
  currentPagePro = 0;
  totalPro = 0;
  totalPagesPro = 0;

  // Taille de page commune
  pageSize = 10;

  // Confirmation de désactivation
  showDeactivateConfirm = false;
  userPendingDeactivate: UtilisateurSummaryResponse | null = null;

  ngOnInit(): void {
    this.loadNovices();
    this.loadProfessionnels();
  }

  selectTab(tab: 'particuliers' | 'professionnels'): void {
    this.activeTab = tab;
  }

  private loadNovices(): void {
    this.usersService.list(this.currentPageNovice, this.pageSize, 'Novice')
      .subscribe((page: PagedUtilisateurResponse) => {
        this.novices = page.items;
        this.applyFilter();
        this.currentPageNovice = page.page;
        this.pageSize = page.size;
        this.totalNovice = page.total;
        this.totalPagesNovice = page.totalPages;
      });
  }

  private loadProfessionnels(): void {
    this.usersService.list(this.currentPagePro, this.pageSize, 'Professionnel')
      .subscribe((page: PagedUtilisateurResponse) => {
        this.professionnels = page.items;
        this.applyFilter();
        this.currentPagePro = page.page;
        this.pageSize = page.size;
        this.totalPro = page.total;
        this.totalPagesPro = page.totalPages;
      });
  }

  onSearch(): void {
    this.applyFilter();
  }

  private applyFilter(): void {
    const term = this.searchText.trim().toLowerCase();

    if (!term) {
      this.filteredNovices = [...this.novices];
      this.filteredProfessionnels = [...this.professionnels];
      return;
    }

    const matches = (u: UtilisateurSummaryResponse): boolean => {
      return (
        (!!u.prenom && u.prenom.toLowerCase().includes(term)) ||
        (!!u.nom && u.nom.toLowerCase().includes(term)) ||
        (!!u.email && u.email.toLowerCase().includes(term)) ||
        (!!u.telephone && u.telephone.toLowerCase().includes(term)) ||
        (!!u.adresse && u.adresse.toLowerCase().includes(term))
      );
    };

    this.filteredNovices = this.novices.filter(matches);
    this.filteredProfessionnels = this.professionnels.filter(matches);
  }

  // Helpers de pagination liés à l'onglet actif
  get currentPage(): number {
    return this.activeTab === 'particuliers' ? this.currentPageNovice : this.currentPagePro;
  }

  get totalPages(): number {
    return this.activeTab === 'particuliers' ? this.totalPagesNovice : this.totalPagesPro;
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index);
  }

  goToPreviousPage(): void {
    if (this.activeTab === 'particuliers') {
      if (this.currentPageNovice > 0) {
        this.currentPageNovice -= 1;
        this.loadNovices();
      }
    } else {
      if (this.currentPagePro > 0) {
        this.currentPagePro -= 1;
        this.loadProfessionnels();
      }
    }
  }

  goToNextPage(): void {
    if (this.activeTab === 'particuliers') {
      if (this.currentPageNovice + 1 < this.totalPagesNovice) {
        this.currentPageNovice += 1;
        this.loadNovices();
      }
    } else {
      if (this.currentPagePro + 1 < this.totalPagesPro) {
        this.currentPagePro += 1;
        this.loadProfessionnels();
      }
    }
  }

  goToPage(pageIndex: number): void {
    if (this.activeTab === 'particuliers') {
      if (pageIndex === this.currentPageNovice || pageIndex < 0 || pageIndex >= this.totalPagesNovice) {
        return;
      }
      this.currentPageNovice = pageIndex;
      this.loadNovices();
    } else {
      if (pageIndex === this.currentPagePro || pageIndex < 0 || pageIndex >= this.totalPagesPro) {
        return;
      }
      this.currentPagePro = pageIndex;
      this.loadProfessionnels();
    }
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
    // Après une activation/désactivation, on recharge simplement la page courante
    if (updated.role === 'Novice') {
      this.loadNovices();
    } else if (updated.role === 'Professionnel') {
      this.loadProfessionnels();
    } else {
      // Par sécurité, on recharge les deux
      this.loadNovices();
      this.loadProfessionnels();
    }
  }
}
