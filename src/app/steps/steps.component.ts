import { Component, HostListener, ElementRef, ViewChild, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepsService, ModeleEtapeResponse, ModeleEtapeCreateRequest, IllustrationResponse } from '../services/steps.service';
import { environment } from '../../environments/environment';
import { SpecialiteResponse, SpecialtiesService } from '../services/specialties.service';

interface StepViewModel {
  id: number;
  order: number;
  name: string;
  specialties: string;
  description: string;
  illustrationsCount: number;
}

@Component({
  selector: 'app-steps',
  standalone: true,
  templateUrl: './steps.component.html',
  styleUrl: './steps.component.css',
  imports: [CommonModule]
})
export class StepsComponent implements OnInit, OnDestroy {
  isCreateOpen = false;
  @ViewChild('modalContainer') modalContainer?: ElementRef<HTMLElement>;
  isIllustrationsOpen = false;
  currentStepName = '';
  currentStepId: number | null = null;
  showAddIllustrationForm = false;
  @ViewChild('fileInput') fileInput?: ElementRef<HTMLInputElement>;

  private readonly stepsService = inject(StepsService);
  private readonly specialtiesService = inject(SpecialtiesService);

  steps: StepViewModel[] = [];
  loading = false;
  errorMessage: string | null = null;

  specialties: SpecialiteResponse[] = [];

  illustrations: IllustrationResponse[] = [];
  illustrationsLoading = false;

  showDeleteIllustrationConfirm = false;
  illustrationPendingDelete: IllustrationResponse | null = null;

   // Delete modele etape confirmation
  showDeleteStepConfirm = false;
  stepPendingDelete: StepViewModel | null = null;

  imageBaseUrl = `${environment.apiBaseUrl}/api/v1`;

  createForm = {
    nom: '',
    ordre: 0,
    description: '',
    specialiteIds: [] as number[],
    submitting: false
  };

  specialtyDropdownOpen = false;

  illustrationForm = {
    titre: '',
    description: '',
    file: null as File | null,
    submitting: false
  };

  profileForm = {
    file: null as File | null,
    submitting: false
  };

  showProfileUploadForm = false;

  currentProfileUrl: string | null = null;

  ngOnInit(): void {
    this.loadSteps();
    this.loadSpecialties();
  }

  private loadSteps(): void {
    this.loading = true;
    this.errorMessage = null;

    this.stepsService.list().subscribe({
      next: (items: ModeleEtapeResponse[]) => {
        this.steps = items.map((m) => ({
          id: m.id,
          order: m.ordre,
          name: m.nom,
          specialties: (m.specialiteLibelles ?? []).join(', '),
          description: m.description,
          illustrationsCount: m.nombreIllustrations
        }));
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = "Erreur lors du chargement des modèles d'étapes";
      }
    });
  }

  private loadSpecialties(): void {
    this.specialtiesService.list().subscribe({
      next: (items) => {
        this.specialties = items;
      },
      error: () => {
        // On ne bloque pas la page si les spécialités échouent à charger
      }
    });
  }

  openCreate() {
    this.isCreateOpen = true;
    this.setBodyScrollLock(true);
    // focus first input after modal opens
    setTimeout(() => {
      const root = this.modalContainer?.nativeElement;
      const first = root?.querySelector<HTMLElement>('input, select, textarea, button');
      first?.focus();
    }, 0);
  }

  // Body scroll locking helpers
  private setBodyScrollLock(lock: boolean) {
    const body = document.body;
    if (lock) {
      body.style.overflow = 'hidden';
    } else {
      body.style.overflow = '';
    }
  }

  private updateBodyScrollLock() {
    if (this.isCreateOpen || this.isIllustrationsOpen) {
      this.setBodyScrollLock(true);
    } else {
      this.setBodyScrollLock(false);
    }
  }

  ngOnDestroy(): void {
    // Ensure body scroll is restored
    this.setBodyScrollLock(false);
  }

  closeCreate() {
    this.isCreateOpen = false;
    this.resetCreateForm();
    this.updateBodyScrollLock();
  }

  onCreateSubmit(event: SubmitEvent) {
    event.preventDefault();
    if (!this.createForm.nom?.trim() || !this.createForm.specialiteIds.length) {
      return;
    }

    const payload: ModeleEtapeCreateRequest = {
      nom: this.createForm.nom.trim(),
      description: this.createForm.description?.trim() || undefined,
      ordre: this.createForm.ordre,
      specialiteIds: this.createForm.specialiteIds
    };

    this.createForm.submitting = true;
    this.stepsService.create(payload).subscribe({
      next: () => {
        this.createForm.submitting = false;
        this.closeCreate();
        this.loadSteps();
      },
      error: () => {
        this.createForm.submitting = false;
      }
    });
  }

  onCreateFieldChange(field: 'nom' | 'ordre' | 'description', value: string | number) {
    if (field === 'ordre') {
      this.createForm.ordre = Number(value) || 0;
    } else if (field === 'nom') {
      this.createForm.nom = String(value);
    } else {
      this.createForm.description = String(value);
    }
  }

  onToggleSpecialite(id: number, checked: boolean) {
    const current = this.createForm.specialiteIds;
    if (checked) {
      if (!current.includes(id)) {
        this.createForm.specialiteIds = [...current, id];
      }
    } else {
      this.createForm.specialiteIds = current.filter(x => x !== id);
    }
  }

  isSpecialiteSelected(id: number): boolean {
    return this.createForm.specialiteIds.includes(id);
  }

  private resetCreateForm() {
    this.createForm = {
      nom: '',
      ordre: 0,
      description: '',
      specialiteIds: [],
      submitting: false
    };
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscKey(event: Event) {
    // Some Angular versions type this event as generic Event
    if (this.isCreateOpen) this.closeCreate();
    if (this.isIllustrationsOpen) this.closeIllustrations();
  }

  onModalKeydown(event: KeyboardEvent) {
    if (event.key !== 'Tab') return;
    const root = this.modalContainer?.nativeElement;
    if (!root) return;
    const focusables = Array.from(root.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    )).filter(el => !el.hasAttribute('disabled') && el.tabIndex !== -1);
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement as HTMLElement | null;
    if (event.shiftKey) {
      if (active === first || !root.contains(active)) {
        last.focus();
        event.preventDefault();
      }
    } else {
      if (active === last) {
        first.focus();
        event.preventDefault();
      }
    }
  }

  // Illustrations modal controls
  openIllustrations(step: StepViewModel) {
    this.currentStepId = step.id;
    this.currentStepName = step.name;
    this.isIllustrationsOpen = true;
    this.showAddIllustrationForm = false;
    this.showProfileUploadForm = false;
    this.illustrations = [];
    this.loadIllustrations(step.id);
    this.loadProfileImage(step.id);
    this.resetIllustrationForm();
    this.setBodyScrollLock(true);
  }

  closeIllustrations() {
    this.isIllustrationsOpen = false;
    this.showAddIllustrationForm = false;
    this.showProfileUploadForm = false;
    this.currentStepId = null;
    this.updateBodyScrollLock();
  }

  toggleAddIllustration(show: boolean) {
    this.showAddIllustrationForm = show;
  }

  toggleProfileUpload(show: boolean) {
    this.showProfileUploadForm = show;
    if (!show) {
      this.resetProfileForm();
    }
  }

  onUploadAreaClick() {
    this.fileInput?.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.illustrationForm.file = input.files[0];
    }
  }

  onProfileFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.profileForm.file = input.files[0];
    }
  }

  onIllustrationFieldChange(field: 'titre' | 'description', value: string) {
    if (field === 'titre') {
      this.illustrationForm.titre = value;
    } else {
      this.illustrationForm.description = value;
    }
  }

  submitIllustration() {
    if (!this.currentStepId || !this.illustrationForm.file) {
      return;
    }

    const data = {
      titre: (this.illustrationForm.titre || '').trim(),
      description: (this.illustrationForm.description || '').trim() || undefined
    };

    this.illustrationForm.submitting = true;
    this.stepsService.addIllustration(this.currentStepId, data, this.illustrationForm.file).subscribe({
      next: () => {
        this.illustrationForm.submitting = false;
        this.showAddIllustrationForm = false;
        this.resetIllustrationForm();

        // Met à jour le compteur localement pour l'étape concernée
        this.steps = this.steps.map((s) =>
          s.id === this.currentStepId
            ? { ...s, illustrationsCount: (s.illustrationsCount || 0) + 1 }
            : s
        );

        // Recharge la liste des illustrations pour refléter l'ajout
        if (this.currentStepId) {
          this.loadIllustrations(this.currentStepId);
        }
      },
      error: () => {
        this.illustrationForm.submitting = false;
      }
    });
  }

  submitProfileImage() {
    if (!this.currentStepId || !this.profileForm.file) {
      return;
    }

    this.profileForm.submitting = true;
    this.stepsService.uploadProfileImage(this.currentStepId, this.profileForm.file).subscribe({
      next: () => {
        this.profileForm.submitting = false;
        this.toggleProfileUpload(false);
        if (this.currentStepId) {
          this.loadProfileImage(this.currentStepId);
        }
      },
      error: () => {
        this.profileForm.submitting = false;
      }
    });
  }

  requestDeleteIllustration(illustration: IllustrationResponse) {
    this.illustrationPendingDelete = illustration;
    this.showDeleteIllustrationConfirm = true;
  }

  cancelDeleteIllustration() {
    this.showDeleteIllustrationConfirm = false;
    this.illustrationPendingDelete = null;
  }

  confirmDeleteIllustration() {
    if (!this.illustrationPendingDelete) {
      return;
    }

    const illustration = this.illustrationPendingDelete;
    this.stepsService.deleteIllustration(illustration.id).subscribe({
      next: () => {
        this.showDeleteIllustrationConfirm = false;
        this.illustrationPendingDelete = null;

        // Met à jour la liste locale
        this.illustrations = this.illustrations.filter(ill => ill.id !== illustration.id);

        // Met à jour le compteur sur l'étape courante
        if (this.currentStepId) {
          this.steps = this.steps.map((s) =>
            s.id === this.currentStepId
              ? { ...s, illustrationsCount: Math.max((s.illustrationsCount || 0) - 1, 0) }
              : s
          );
        }
      },
      error: () => {
        // Optionnel: gérer une notification d'erreur plus tard
      }
    });
  }

  private resetIllustrationForm() {
    this.illustrationForm = {
      titre: '',
      description: '',
      file: null,
      submitting: false
    };
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
  }

  private resetProfileForm() {
    this.profileForm = {
      file: null,
      submitting: false
    };
  }

  private loadProfileImage(modeleId: number) {
    this.currentProfileUrl = null;
    this.stepsService.getProfileImage(modeleId).subscribe({
      next: (url) => {
        this.currentProfileUrl = url;
      },
      error: () => {
        this.currentProfileUrl = null;
      }
    });
  }

  private loadIllustrations(modeleId: number) {
    this.illustrationsLoading = true;
    this.stepsService.listIllustrations(modeleId).subscribe({
      next: (items) => {
        this.illustrations = items;
        this.illustrationsLoading = false;
      },
      error: () => {
        this.illustrationsLoading = false;
      }
    });
  }

  // Delete modele etape (step) with confirmation
  requestDeleteStep(step: StepViewModel) {
    this.stepPendingDelete = step;
    this.showDeleteStepConfirm = true;
  }

  cancelDeleteStep() {
    this.showDeleteStepConfirm = false;
    this.stepPendingDelete = null;
  }

  confirmDeleteStep() {
    if (!this.stepPendingDelete) {
      return;
    }

    const stepToDelete = this.stepPendingDelete;

    this.stepsService.deleteModeleEtape(stepToDelete.id).subscribe({
      next: () => {
        this.steps = this.steps.filter(s => s.id !== stepToDelete.id);
        this.showDeleteStepConfirm = false;
        this.stepPendingDelete = null;
      },
      error: () => {
        // Optionnel : gérer une notification d'erreur plus tard
      }
    });
  }
}
