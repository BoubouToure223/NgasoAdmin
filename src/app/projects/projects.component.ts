import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProjectsService, ProjetAdminItemResponse } from '../services/projects.service';

interface Project {
  id: number;
  nom: string;
  proprietaire: string;
  localisation: string;
  budget: string;
  etape: string;
  progression: number;
  miseAJour: string;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  searchText = '';
  projects: Project[] = [];
  filteredProjects: Project[] = [];

  private readonly projectsService = inject(ProjectsService);

  page = 0;
  size = 10;
  total = 0;
  totalPages = 0;
  loading = false;
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.loadPage(0);
  }

  private mapProjet(item: ProjetAdminItemResponse): Project {
    const proprietaire = [item.proprietairePrenom, item.proprietaireNom]
      .filter((v) => !!v)
      .join(' ') || 'Inconnu';

    const budget = `${item.budget} FCFA`;

    const miseAJour = new Date(item.dateCreation).toLocaleDateString();

    return {
      id: item.id,
      nom: item.titre,
      proprietaire,
      localisation: item.localisation,
      budget,
      etape: item.currentEtape ?? 'Non démarré',
      progression: item.progressPercent,
      miseAJour
    };
  }

  private loadPage(page: number): void {
    this.loading = true;
    this.errorMessage = null;

    this.projectsService.list(page, this.size).subscribe({
      next: (res) => {
        this.page = res.page;
        this.size = res.size;
        this.total = res.total;
        this.totalPages = res.totalPages;

        this.projects = res.items.map((item) => this.mapProjet(item));
        this.filteredProjects = [...this.projects];

        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Erreur lors du chargement des projets';
      }
    });
  }

  onSearch(): void {
    if (!this.searchText.trim()) {
      this.filteredProjects = [...this.projects];
      return;
    }

    const search = this.searchText.toLowerCase();
    this.filteredProjects = this.projects.filter(
      (project) =>
        project.nom.toLowerCase().includes(search) ||
        project.proprietaire.toLowerCase().includes(search) ||
        project.localisation.toLowerCase().includes(search)
    );
  }

  onFilter(): void {
    console.log('Filtrer clicked');
  }

  onExport(): void {
    console.log('Exporter clicked');
  }

  onEdit(project: Project): void {
    console.log('Edit project:', project);
  }

  onDelete(project: Project): void {
    console.log('Delete project:', project);
  }

  goToPage(page: number): void {
    if (page < 0 || (this.totalPages && page >= this.totalPages)) {
      return;
    }
    this.loadPage(page);
  }

  getEtapeClass(etape: string): string {
    const etapeMap: Record<string, string> = {
      Études: 'etape-etudes',
      Fondation: 'etape-fondation',
      'Gros œuvre': 'etape-gros-oeuvre',
      Finitions: 'etape-finitions',
      Livré: 'etape-livre'
    };

    return etapeMap[etape] || '';
  }
}
