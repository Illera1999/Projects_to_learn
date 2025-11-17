import { AfterViewInit, Component, ElementRef, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonIcon,
  IonFab,
  IonFabButton,
} from '@ionic/angular/standalone';
import { GoogleMap } from '@capacitor/google-maps';
import { Geolocation } from '@capacitor/geolocation';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ENV_KEYS } from 'src/app/config/keys';
import { addIcons } from 'ionicons'
import { filterOutline } from 'ionicons/icons';
import { locateOutline } from 'ionicons/icons';
import { Capacitor } from '@capacitor/core';

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
    IonIcon,
    IonFab,
    IonFabButton
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FestivalsPage implements OnInit, AfterViewInit {
  map: GoogleMap | undefined;
  private apiKey = ENV_KEYS.googleMapsApiKey;
  @ViewChild('map', { static: false }) mapRef!: ElementRef<HTMLElement>;
  locationDenied = signal<boolean>(false);

  readonly isNative = Capacitor.isNativePlatform();



  constructor() {
    addIcons({ filterOutline, locateOutline });
  }



  ngOnInit() { }

  async ngAfterViewInit() {
    await this.initMap();
  }

  async initMap() {
    const defaultCenter = { lat: 35.5, lng: -9.2 };
    let center = defaultCenter;
    let zoom = 4;

    const userPosition = await this.getCurrentPosition();
    if (userPosition) {
      center = userPosition;
      zoom = 10;
    }

    this.map = await GoogleMap.create({
      id: 'my-map',
      apiKey: this.apiKey,
      element: this.mapRef.nativeElement,
      config: {
        center,
        zoom,
      }
    });

    if (userPosition) {
      await this.map.addMarker({
        coordinate: userPosition,
        title: 'Tu ubicación',
        snippet: 'Estás aquí',
        iconUrl: 'https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png',
      });
    }
  }


  async getCurrentPosition(): Promise<{ lat: number, lng: number } | null> {
    try {
      const position = await Geolocation.getCurrentPosition();

      const { latitude, longitude } = position.coords;
      console.log('[Geo] Usuario permitió la ubicación:', latitude, longitude);


      this.locationDenied.set(false);
      return { lat: latitude, lng: longitude };
    } catch (error) {
      console.warn('[Geo] No se pudo obtener la ubicación del usuario. Usando centro por defecto.', error);
      this.locationDenied.set(true);
      return null;
    }
  }

  async refreshLocation() {
    console.log('[Geo] Reintentando obtener ubicación del usuario…');
    try {
      const currentPerms = await Geolocation.checkPermissions();

      if (currentPerms.location !== 'granted') {
        const requested = await Geolocation.requestPermissions();

        if (requested.location !== 'granted') {
          console.warn('[Geo] El usuario sigue sin conceder permisos de ubicación.');
          this.locationDenied.set(true);
          return;
        }
      }

      const position = await this.getCurrentPosition();

      console.log('[Geo] Ubicación actual tras reintento:', position);

      this.locationDenied.set(false);

      if (this.map) {
        await this.map.setCamera({
          coordinate: position || { lat: 35.5, lng: -9.2 },
          zoom: 10,
        });
      }
    } catch (error) {
      console.error('[Geo] Error al reintentar obtener la ubicación del usuario.', error);
      this.locationDenied.set(true);
    }
  }

  get showRetryButton(): boolean {
    return this.isNative && this.locationDenied();
  }

}