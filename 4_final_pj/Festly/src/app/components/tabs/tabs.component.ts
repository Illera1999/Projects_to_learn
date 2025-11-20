import { Component, OnInit } from '@angular/core';
import { User } from '@angular/fire/auth';
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  homeOutline,
  musicalNotesOutline,
  cameraOutline,
  personOutline,
} from 'ionicons/icons';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth-service';
import { AsyncPipe } from '@angular/common';  

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, AsyncPipe],
})
export class TabsComponent {

  user$: Observable<User | null>;

  constructor(
    private authService: AuthService,
  ) {
    this.user$ = this.authService.user$;
    addIcons({ homeOutline, musicalNotesOutline, cameraOutline, personOutline });
  }
}
