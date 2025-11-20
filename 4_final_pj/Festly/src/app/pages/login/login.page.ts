import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonButton, 
  IonLabel, 
  IonList, 
  IonItem ,
  IonSpinner,
  IonInput
} from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    CommonModule, 
    FormsModule, 
    IonButton, 
    IonLabel, 
    IonList, 
    IonItem,
    IonSpinner,
    FormsModule,  
    IonInput
  ]
})
export class LoginPage implements OnInit {
  formModel = {
    email: '',
    password: '',
  };

  loading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  onSubmit(form: NgForm): void {
    if (form.invalid || this.loading) {
      return;
    }

    this.errorMessage = '';
    this.loading = true;

    this.authService.login(this.formModel.email, this.formModel.password).subscribe({
      next: () => {
        console.log('[Login] Login correcto, redirigiendo a /tabs/home');
        this.loading = false;
        this.router.navigateByUrl('/tabs/home', { replaceUrl: true });
      },
      error: (err) => {
        console.error('[Login] Error en login', err);
        this.loading = false;
        this.errorMessage = 'Credenciales incorrectas o error al iniciar sesión.';
      },
    });
  }

  skipLogin(): void {
    // Entrar en la app sin autenticación
    this.router.navigateByUrl('/tabs/home', { replaceUrl: true });
  }
}
