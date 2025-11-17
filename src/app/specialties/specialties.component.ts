import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpecialtiesService, SpecialiteResponse } from '../services/specialties.service';

interface Specialty {
  id: number;
  name: string;
  professionals: number;
}

@Component({
  selector: 'app-specialties',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './specialties.component.html',
  styleUrls: ['./specialties.component.css']
})
export class SpecialtiesComponent implements OnInit {
  newSpecialty = '';

  specialties: Specialty[] = [];

  showDeleteConfirm = false;
  specialtyPendingDelete: Specialty | null = null;

  private readonly service = inject(SpecialtiesService);

  loading = false;
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.loadSpecialties();
  }

  private loadSpecialties(): void {
    this.loading = true;
    this.errorMessage = null;

    this.service.list().subscribe({
      next: (items) => {
        this.specialties = items.map((s: SpecialiteResponse) => ({
          id: s.id,
          name: s.libelle,
          professionals: s.nombreProfessionnels ?? 0
        }));
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Erreur lors du chargement des spécialités';
      }
    });
  }

  addSpecialty(): void {
    if (this.newSpecialty.trim()) {
      const libelle = this.newSpecialty.trim();
      this.loading = true;
      this.errorMessage = null;

      this.service.create(libelle).subscribe({
        next: (created: SpecialiteResponse) => {
          this.specialties.push({
            id: created.id,
            name: created.libelle,
            professionals: created.nombreProfessionnels ?? 0
          });
          this.newSpecialty = '';
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.errorMessage = "Erreur lors de la création de la spécialité";
        }
      });
    }
  }

  requestDeleteSpecialty(specialty: Specialty): void {
    this.specialtyPendingDelete = specialty;
    this.showDeleteConfirm = true;
  }

  cancelDeleteSpecialty(): void {
    this.showDeleteConfirm = false;
    this.specialtyPendingDelete = null;
  }

  confirmDeleteSpecialty(): void {
    if (!this.specialtyPendingDelete) {
      return;
    }

    const { id, name } = this.specialtyPendingDelete;

    this.loading = true;
    this.errorMessage = null;

    this.service.delete(id).subscribe({
      next: () => {
        this.specialties = this.specialties.filter((s) => s.id !== id);
        this.loading = false;
        this.showDeleteConfirm = false;
        this.specialtyPendingDelete = null;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = `Erreur lors de la suppression de la spécialité "${name}"`;
      }
    });
  }
}
