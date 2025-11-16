import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Specialty {
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
export class SpecialtiesComponent {
  newSpecialty = '';

  specialties: Specialty[] = [
    { name: 'Peinture', professionals: 42 },
    { name: 'Électricité', professionals: 36 },
    { name: 'Maçonnerie', professionals: 28 }
  ];

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
}
