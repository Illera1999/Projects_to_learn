import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonSpinner, IonFab, IonFabButton, IonAlert } from '@ionic/angular/standalone';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ENV_KEYS } from 'src/app/config/keys';
import { Geolocation } from '@capacitor/geolocation';
import { EventEntity } from 'src/app/interfaces/models/event/event.entity';
import { PostDataService } from 'src/app/services/data.abstract';
import { take } from 'rxjs';

import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { navigateOutline } from 'ionicons/icons';

declare const google: any;

/**
 * FestivalsPage
 *
 * This page is responsible for displaying the festivals map.
 * It loads events from Firestore, renders them as markers on a Google Map,
 * allows the user to filter by genre, and shows directions from the user's
 * current location to a selected event.
 */
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
    IonIcon,
    IonFab,
    IonFabButton,
    IonAlert,
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

  events = signal<EventEntity[]>([]);
  selectedEvent = signal<EventEntity | null>(null);
  showNoLocationModal = signal(false);
  showNoLocationToast = signal(false);
  refresherDisabled = signal(false);

  private AdvancedMarkerElement: any | null = null;
  private PinElement: any | null = null;
  private directionsService: any | null = null;
  private directionsRenderer: any | null = null;
  private eventMarkers: any[] = [];

  filteredEvents = signal<EventEntity[]>([]);

  selectedGenre = signal<'all' | string>('all');

  showGenreFilter = signal(false);
  
  genreAlertInputs: any[] = [
    { label: 'Todos', type: 'radio', value: 'all' },
    { label: 'Pop', type: 'radio', value: 'pop' },
    { label: 'Rock', type: 'radio', value: 'rock' },
    { label: 'Indie', type: 'radio', value: 'indie' },
    { label: 'Electrónica', type: 'radio', value: 'electronic' },
  ];
  
  genreAlertButtons: any[] = [
    { text: 'Cancelar', role: 'cancel' },
    {
      text: 'Aplicar',
      role: 'confirm',
      handler: (value: any) => {
        const selected = (value ?? 'all') as string;
        this.onGenreSelected(selected);
        return true;
      },
    },
  ];


  constructor(private readonly dataService: PostDataService) {
    addIcons({
      'navigate-outline': navigateOutline,
    });
  }

  ngOnInit() {
    this.loadEvents();
  }

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


  private loadEvents(done?: () => void): void {
    this.dataService.getEvent().pipe(
      take(1)
    ).subscribe({
      next: (events) => {
        console.log('[Events] Eventos cargados para Festivales:', events);

        this.events.set(events);
        this.applyGenreFilter();

        done?.();
      },
      error: (err) => {
        console.error('[Events] Error cargando eventos desde Firestore', err);
        done?.();
      },
    });
  }

  private addEventMarkers(): void {
    if (!this.map || !this.AdvancedMarkerElement || !this.PinElement) {
      console.warn('[Events] Mapa o librerías de marcadores no listas. No se añaden marcadores de eventos.');
      return;
    }

    if (this.eventMarkers.length) {
      console.log('[Events] Limpiando', this.eventMarkers.length, 'marcadores existentes');
      for (const marker of this.eventMarkers) {
        try {
          if (marker) {
            marker.map = null;
          }
        } catch (err) {
          console.warn('[Events] Error eliminando marcador de evento', err);
        }
      }
      this.eventMarkers = [];
    }

    const events = this.filteredEvents();
    console.log('[Events] Pintando marcadores para', events.length, 'eventos');

    for (const event of events) {
      if (!event.place || typeof event.place.lat !== 'number' || typeof event.place.lng !== 'number') {
        console.warn('[Events] Evento sin coordenadas válidas, se omite:', event);
        continue;
      }

      const position = {
        lat: event.place.lat,
        lng: event.place.lng,
      };

      const eventPin = new this.PinElement({
        background: '#f97316',
        borderColor: '#111827',
        glyphColor: '#ffffff',
        glyphText: '🎵',
      });

      const marker = new this.AdvancedMarkerElement({
        map: this.map,
        position,
        title: event.eventName,
        content: eventPin.element,
      });

      this.eventMarkers.push(marker);

      if (typeof marker.addListener === 'function') {
        marker.addListener('click', () => {
          console.log('[Events] Marker de evento clicado:', event);
          this.selectedEvent.set(event);
        });
      }
    }
  }

  openDirectionsToEvent(event: EventEntity | null): void {
    if (!this.userLocation) {
      console.warn('[Directions] No tenemos ubicación del usuario.');
      this.showNoLocationToast.set(true);
      return;
    }
    if (!event || !event.place || typeof event.place.lat !== 'number' || typeof event.place.lng !== 'number') {
      console.warn('[Directions] Evento sin coordenadas válidas:', event);
      return;
    }

    if (!this.userLocation) {
      console.warn('[Directions] No tenemos ubicación del usuario.');
      this.showNoLocationModal.set(true);
      return;
    }

    if (!this.map || !this.directionsService || !this.directionsRenderer) {
      console.warn('[Directions] El mapa o los servicios de direcciones no están listos.');
      return;
    }

    const origin = this.userLocation;
    const destination = {
      lat: event.place.lat,
      lng: event.place.lng,
    };

    console.log('[Directions] Calculando ruta desde', origin, 'hasta', destination);

    this.directionsService
      .route({
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
      })
      .then((response: any) => {
        this.directionsRenderer!.setDirections(response);
      })
      .catch((err: any) => {
        console.error('[Directions] Error al calcular ruta', err);
      });
  }

  async handleRefresh(event: any): Promise<void> {
    console.log('[Refresh] Refrescando festivales (reinicializando mapa y eventos)...');

    this.selectedEvent.set(null);
    this.events.set([]);
    this.userLocation = null;

    this.map = null;
    this.AdvancedMarkerElement = null;
    this.PinElement = null;
    this.directionsService = null;
    this.directionsRenderer = null;

    try {
      await this.initMap();
      await this.loadEvents();
    } catch (err) {
      console.error('[Refresh] Error al reinicializar mapa y eventos', err);
    } finally {
      event.target.complete();
    }
  }

  onNoLocationToastDismiss(): void {
    this.showNoLocationToast.set(false);
  }

  onMapTouchStart(): void {
    this.refresherDisabled.set(true);
  }

  onMapTouchEnd(): void {
    this.refresherDisabled.set(false);
  }

  openGenreFilter(): void {
    this.showGenreFilter.set(true);
  }
  
  closeGenreFilter(): void {
    this.showGenreFilter.set(false);
  }
  
  onGenreSelected(value: string | 'all'): void {
    this.applyGenreFilter(value);
    this.showGenreFilter.set(false);
  }

  private applyGenreFilter(genre?: string): void {
    const currentGenre = (genre ?? this.selectedGenre() ?? 'all') as 'all' | string;
    this.selectedGenre.set(currentGenre);

    const allEvents = this.events();
    const filtered =
      currentGenre === 'all'
        ? allEvents
        : allEvents.filter((e) => e.genre === currentGenre);

    console.log('[GenreFilter] género actual:', currentGenre);
    console.log(
      '[GenreFilter] eventos filtrados:',
      filtered.map(e => ({ name: e.eventName, genre: e.genre }))
    );

    this.filteredEvents.set(filtered);
    this.addEventMarkers();
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
    const markerLib = (await google.maps.importLibrary('marker')) as any;
    this.AdvancedMarkerElement = markerLib.AdvancedMarkerElement;
    this.PinElement = markerLib.PinElement;

    this.map = new Map(this.mapRef.nativeElement, {
      center,
      zoom,
      mapId: 'DEMO_MAP_ID',
    });

    console.log('[Maps] Mapa inicializado en', center);

    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer({
      map: this.map,
    });

    if (userCoords && this.AdvancedMarkerElement && this.PinElement) {
      const pin = new this.PinElement({
        background: '#2563eb',
        borderColor: '#ffffff',
        glyphColor: '#ffffff',
      });

      new this.AdvancedMarkerElement({
        map: this.map,
        position: userCoords,
        title: 'Tu ubicación',
        content: pin.element,
      });
    }

    this.addEventMarkers();
  }
}
