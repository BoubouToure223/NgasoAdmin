import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  passwordVisible = false;

  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  loading = false;
  errorMessage: string | null = null;

  readonly loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    remember: [false]
  });

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  submit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.getRawValue();

    this.loading = true;
    this.errorMessage = null;

    this.authService.loginAdmin(email, password).subscribe({
      next: (res) => {
        localStorage.setItem('ngaso_token', res.token);
        localStorage.setItem('ngaso_role', res.role);
        localStorage.setItem('ngaso_user_id', String(res.userId));
        localStorage.setItem('ngaso_refresh_token', res.refreshToken);

        this.loading = false;
        this.router.navigateByUrl('/dashboard');
      },
      error: (err) => {
        this.loading = false;

        if (err.status === 400 || err.status === 401) {
          this.errorMessage = 'Identifiants invalides';
        } else if (err.status === 403) {
          this.errorMessage = 'Accès refusé';
        } else {
          this.errorMessage = 'Erreur serveur, veuillez réessayer plus tard';
        }
      }
    });
  }
}

