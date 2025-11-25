import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonButton, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardContent, IonLabel, IonCardTitle } from '@ionic/angular/standalone';
import { User } from '@angular/fire/auth';
import { AuthService } from 'src/app/services/auth-service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';


/**
 * ProfilePage
 *
 * Screen that displays information about the currently authenticated user. It shows basic
 * profile data (email and user id) and provides actions related to the account, such as
 * logging out or navigating to the login screen when there is no active session.
 */
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonLabel,
    IonItem,
    IonCardTitle,
    IonButton]
})

export class ProfilePage implements OnInit {
  user$: Observable<User | null>;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.user$ = this.authService.user$;
  }

  ngOnInit() { }


  onLogout(): void {
    this.authService.logout().subscribe({
      next: () => {
        console.log('[Profile] Sesión cerrada, navegando a /login');
        this.router.navigateByUrl('/login', { replaceUrl: true });
      },
      error: (err) => {
        console.error('[Profile] Error al cerrar sesión', err);
        this.router.navigateByUrl('/login', { replaceUrl: true });
      }
    });
  }
  
  goToLogin(): void {
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}
