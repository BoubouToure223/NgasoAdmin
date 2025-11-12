import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

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
export class ProjectsComponent {
  searchText = '';

  projects: Project[] = [
    {
      id: 1,
      nom: 'Villa Émeraude',
      proprietaire: 'Jean Kofi',
      localisation: 'Abidjan, Cocody',
      budget: '50M FCFA',
      etape: 'Fondation',
      progression: 25,
      miseAJour: '10/05/2023'
    },
    {
      id: 2,
      nom: 'Résidence Azur',
      proprietaire: 'Marie Touré',
      localisation: 'Abidjan, Plateau',
      budget: '120M FCFA',
      etape: 'Gros œuvre',
      progression: 60,
      miseAJour: '18/05/2023'
    },
    {
      id: 3,
      nom: 'Complexe Harmonie',
      proprietaire: 'Amadou Diallo',
      localisation: 'Abidjan, Marcory',
      budget: '200M FCFA',
      etape: 'Finitions',
      progression: 85,
      miseAJour: '22/05/2023'
    },
    {
      id: 4,
      nom: 'Immeuble Soleil',
      proprietaire: 'Fatou Cissé',
      localisation: 'Abidjan, Yopougon',
      budget: '80M FCFA',
      etape: 'Études',
      progression: 10,
      miseAJour: '05/05/2023'
    },
    {
      id: 5,
      nom: "Centre Commercial Étoile",
      proprietaire: "Konan N'Guessan",
      localisation: 'Abidjan, Abobo',
      budget: '350M FCFA',
      etape: 'Livré',
      progression: 100,
      miseAJour: '01/05/2023'
    }
  ];

  filteredProjects: Project[] = [...this.projects];

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
