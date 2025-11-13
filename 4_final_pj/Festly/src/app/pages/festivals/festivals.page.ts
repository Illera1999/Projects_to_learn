import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { GoogleMap } from '@capacitor/google-maps';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ENV_KEYS } from 'src/app/config/keys';

@Component({
  selector: 'app-festivals',
  templateUrl: './festivals.page.html',
  styleUrls: ['./festivals.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FestivalsPage implements OnInit, AfterViewInit {
  map: GoogleMap | undefined;
  private apiKey = ENV_KEYS.googleMapsApiKey;
  @ViewChild('map', { static: false }) mapRef!: ElementRef<HTMLElement>;

  constructor() { }



  ngOnInit() { }

  async ngAfterViewInit() {
    await this.initMap();
  }

  async initMap() {
    this.map = await GoogleMap.create({
      id: 'my-map',
      apiKey: this.apiKey,
      element: this.mapRef.nativeElement,
      config: {
        center: {
          lat: 37.7749,
          lng: -122.4194,
        },
        zoom: 12,
      },
    });
  }


}
