import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonText,
  IonList,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service';

/**
 * RegisterPage
 *
 * Screen responsible for user account creation. It displays a registration form with email,
 * password and repeat password fields, performs basic client-side validation and, if valid,
 * calls `AuthService` to register the user. On success it redirects to the login screen using
 * the Angular router.
 */
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonText,
    IonList,
    CommonModule,
    FormsModule,
  ],
})
export class RegisterPage {
  formModel = {
    email: '',
    password: '',
    repeatPassword: '',
  };

  loading = false;
  errorMessage = '';

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  onSubmit(form: NgForm): void {
    if (form.invalid || this.loading) {
      return;
    }

    this.errorMessage = '';

    if (this.formModel.password !== this.formModel.repeatPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }

    if (this.formModel.password.length < 6) {
      this.errorMessage = 'La contraseña debe tener al menos 6 caracteres.';
      return;
    }

    this.loading = true;

    const { email, password } = this.formModel;
    this.authService
      .register(email, password)
      .subscribe({
        next: () => {
          this.loading = false;
          // Después de registrar, lo más simple es mandar al login
          this.router.navigateByUrl('/login', { replaceUrl: true });
        },
        error: (err) => {
          console.warn('[Register] Error creando usuario', err);
          this.loading = false;
          this.errorMessage =
            'No se ha podido crear la cuenta. Revisa los datos o inténtalo de nuevo.';
        },
      });
  }

  goToLogin(): void {
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}
