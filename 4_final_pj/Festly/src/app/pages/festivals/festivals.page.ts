import { AfterViewInit, Component, ElementRef, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonFab, IonFabButton, IonSpinner } from '@ionic/angular/standalone';
import { GoogleMap } from '@capacitor/google-maps';
import { Geolocation } from '@capacitor/geolocation';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ENV_KEYS } from 'src/app/config/keys';
import { addIcons } from 'ionicons'
import { filterOutline } from 'ionicons/icons';
import { locateOutline } from 'ionicons/icons';
import { Capacitor } from '@capacitor/core';
import { PostDataService } from 'src/app/services/data.abstract';
import { EventEntity } from 'src/app/interfaces/models/event/event.entity';

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
    IonFabButton,
    IonSpinner,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FestivalsPage implements OnInit, AfterViewInit {
  map: GoogleMap | undefined;
  private apiKey = ENV_KEYS.googleMapsApiKey;
  @ViewChild('map', { static: false }) mapRef!: ElementRef<HTMLElement>;
  locationDenied = signal<boolean>(false);
  isMapLoading = signal<boolean>(true);
  filteredEvents = signal<EventEntity[]>([]);
  selectedEvent = signal<EventEntity | null>(null);
  private markerEventMap = new Map<string, EventEntity>();
  userLocation: { lat: number; lng: number } | null = null;
  private currentRoutePolylineIds: string[] = [];

  readonly isNative = Capacitor.isNativePlatform();



  constructor(private postService: PostDataService) {
    addIcons({ filterOutline, locateOutline });
  }



  ngOnInit() {
    this.loadEvents();
  }


  async ngAfterViewInit() {
    await this.initMap();
  }

  async initMap() {
    this.isMapLoading.set(true);
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

    const events = this.filteredEvents();
    if (events && events.length > 0) {
      await this.addEventMarkers(events);
    }

    if (this.map) {
      this.map.setOnMarkerClickListener((value: any) => {
        console.log('[Marker click] Objeto COMPLETO recibido al pulsar el marcador:', value);

        const markerId = value.markerId as string;
        console.log('[Marker click] markerId recibido:', markerId);

        const event = this.markerEventMap.get(markerId);

        if (event) {
          console.log('[Marker click → EventEntity]', event);
          this.selectedEvent.set(event);
        } else {
          console.warn(
            '[Marker click] No se encontró EventEntity para markerId',
            markerId,
            'Mapa actual:',
            this.markerEventMap
          );
        }
      });
    }

    this.isMapLoading.set(false);
  }

  async getCurrentPosition(): Promise<{ lat: number, lng: number } | null> {
    try {
      const position = await Geolocation.getCurrentPosition();
      const { latitude, longitude } = position.coords;

      console.log('[Geo] Usuario permitió la ubicación:', latitude, longitude);

      this.userLocation = { lat: latitude, lng: longitude };   // 👈 guardar
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

  private loadEvents() {
    this.postService.getEvent().subscribe({
      next: (events) => {

        this.filteredEvents.set(events);
      },
      error: (err) => {
        console.error('[Events] Error cargando eventos desde Firestore', err);
      },
    });
  }

  private async addEventMarkers(events: EventEntity[]) {
    if (!this.map) return;

    for (const e of events) {
      if (!e.place || typeof e.place.lat !== 'number' || typeof e.place.lng !== 'number') {
        continue;
      }

      const markerDef = {
        coordinate: {
          lat: e.place.lat,
          lng: e.place.lng,
        },
        title: e.eventName,
        snippet: `${e.id}`,
        iconUrl: 'https://maps.gstatic.com/mapfiles/ms2/micons/blue-dot.png',
      };

      console.log('[Markers] Objeto marcador ANTES de añadirlo al mapa para evento', e.id, markerDef);

      const markerId = await this.map.addMarker(markerDef);

      console.log('[Markers] markerId devuelto para evento', e.id, '=>', markerId);
      this.markerEventMap.set(markerId, e);
    }
  }

  openDirectionsToEvent(event: EventEntity | null) {
    if (!this.map) {
      console.warn('[Directions] No hay instancia de mapa');
      return;
    }

    if (!event || !event.place || typeof event.place.lat !== 'number' || typeof event.place.lng !== 'number') {
      console.warn('[Directions] Evento sin coordenadas válidas:', event);
      return;
    }

    if (!this.userLocation) {
      console.warn('[Directions] No tenemos ubicación del usuario todavía');
      return;
    }

    const origin = this.userLocation;
    const destination = {
      lat: event.place.lat,
      lng: event.place.lng,
    };

    console.log('[Directions] Dibujando ruta de', origin, 'a', destination);

    // 1. Borrar la ruta anterior si existe
    if (this.currentRoutePolylineIds.length) {
      this.map.removePolylines(this.currentRoutePolylineIds).catch(err =>
        console.warn('[Directions] Error al borrar polylines anteriores', err)
      );
      this.currentRoutePolylineIds = [];
    }

    // 2. Añadir una polilínea simple usuario → evento
    this.map.addPolylines([
      {
        // En web es la misma opción que google.maps.PolylineOptions: usamos 'path'
        path: [origin, destination],
        strokeColor: '#3b82f6',
        strokeWeight: 5,
        geodesic: true,
      } as any, // el "as any" es para que no se pelee el typing de TS
    ]).then(ids => {
      this.currentRoutePolylineIds = ids;
    }).catch(err => {
      console.error('[Directions] Error al añadir polyline', err);
    });

    // 3. Ajustar la cámara para que se vean origen y destino
    const boundsLiteral = {
      north: Math.max(origin.lat, destination.lat),
      south: Math.min(origin.lat, destination.lat),
      east: Math.max(origin.lng, destination.lng),
      west: Math.min(origin.lng, destination.lng),
    };

    // El typing de @capacitor/google-maps espera LatLngBounds (clase),
    // pero en runtime acepta perfectamente el literal { north, south, east, west }.
    // Forzamos el tipo a any para evitar el error de TypeScript.
    (this.map as any).fitBounds(boundsLiteral, 80).catch((err: any) =>
      console.warn('[Directions] Error al hacer fitBounds', err)
    );
  }
}