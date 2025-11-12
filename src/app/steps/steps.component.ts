import { Component, HostListener, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-steps',
  standalone: true,
  templateUrl: './steps.component.html',
  styleUrl: './steps.component.css',
  imports: [CommonModule]
})
export class StepsComponent implements OnDestroy {
  isCreateOpen = false;
  @ViewChild('modalContainer') modalContainer?: ElementRef<HTMLElement>;
  isIllustrationsOpen = false;
  currentStepName = '';
  showAddIllustrationForm = false;
  @ViewChild('fileInput') fileInput?: ElementRef<HTMLInputElement>;

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
    this.updateBodyScrollLock();
  }

  onCreateSubmit(event: SubmitEvent) {
    event.preventDefault();
    // TODO: persist the new step
    this.closeCreate();
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
  openIllustrations(stepName: string) {
    this.currentStepName = stepName;
    this.isIllustrationsOpen = true;
    this.showAddIllustrationForm = false;
    this.setBodyScrollLock(true);
  }

  closeIllustrations() {
    this.isIllustrationsOpen = false;
    this.showAddIllustrationForm = false;
    this.updateBodyScrollLock();
  }

  toggleAddIllustration(show: boolean) {
    this.showAddIllustrationForm = show;
  }

  onUploadAreaClick() {
    this.fileInput?.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      // Placeholder: you could preview the image here
      // console.log('Fichier sélectionné:', input.files[0].name);
    }
  }
}
