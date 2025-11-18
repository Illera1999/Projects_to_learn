import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonSpinner } from '@ionic/angular/standalone';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ENV_KEYS } from 'src/app/config/keys';
import { Geolocation } from '@capacitor/geolocation';

declare const google: any;

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
    IonSpinner,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class FestivalsPage implements OnInit, AfterViewInit {
  apiKey = ENV_KEYS.googleMapsApiKey;

  @ViewChild('map', { static: false }) mapRef!: ElementRef<HTMLDivElement>;
  map: any | null = null;
  userLocation: { lat: number; lng: number } | null = null;

  isMapLoading = signal(true);
  private mapsLoaded = false;

  constructor() { }

  ngOnInit() { }

  async ngAfterViewInit() {
    this.isMapLoading.set(true);
    try {
      await this.loadGoogleMapsScript();
      await this.initMap();
    } catch (err) {
      console.error('[Maps] No se pudo inicializar el mapa', err);
    } finally {
      this.isMapLoading.set(false);
    }
  }

  private loadGoogleMapsScript(): Promise<void> {
    if (this.mapsLoaded) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      if ((window as any).google && (window as any).google.maps) {
        this.mapsLoaded = true;
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&loading=async`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        this.mapsLoaded = true;
        resolve();
      };

      script.onerror = (err) => {
        console.error('[Maps] Error cargando Google Maps JS API', err);
        reject(err);
      };

      document.head.appendChild(script);
    });
  }



  private async loadUserLocation(): Promise<{ lat: number; lng: number } | null> {
    try {
      const position = await Geolocation.getCurrentPosition();
      const { latitude, longitude } = position.coords;

      const coords = { lat: latitude, lng: longitude };
      console.log('[Geo] Ubicación del usuario obtenida:', coords);
      this.userLocation = coords;
      return coords;
    } catch (err) {
      console.warn('[Geo] Error obteniendo la ubicación del usuario', err);
      return null;
    }
  }

  private async initMap() {
    const defaultCenter = { lat: 34, lng: -8 };
    let center = defaultCenter;
    let zoom = 4;

    const userCoords = await this.loadUserLocation();
    if (userCoords) {
      center = userCoords;
      zoom = 10;
    }

  const { Map } = (await google.maps.importLibrary('maps')) as any;
  const { AdvancedMarkerElement, PinElement } =
    (await google.maps.importLibrary('marker')) as any;

    this.map = new Map(this.mapRef.nativeElement, {
      center,
      zoom,
      mapId: 'DEMO_MAP_ID',
    });

    if (userCoords) {
      const pin = new PinElement({
        background: '#2563eb',
        borderColor: '#ffffff',
        glyphColor: '#ffffff',
      });

      new AdvancedMarkerElement({
        map: this.map,
        position: userCoords,
        title: 'Tu ubicación',
        content: pin.element, 
      });
    }
  }
}
