import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { PostEntity } from 'src/app/interfaces/models/post/post.entity';
import { EventEntity } from 'src/app/interfaces/models/event/event.entity';
import { PostDataService } from 'src/app/services/data.abstract';
import { take } from 'rxjs';

import { User } from '@angular/fire/auth';
import { AuthService } from 'src/app/services/auth-service';

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonInput,
  IonButton,
  IonSelect,
  IonSelectOption,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { CameraSource } from '@capacitor/camera';
import { PhotoService, PostPhoto } from 'src/app/services/photo-service';

import { addIcons } from 'ionicons';
import { camera, images } from 'ionicons/icons';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.page.html',
  styleUrls: ['./new-post.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonList,
    IonItem,
    IonInput,
    IonButton,
    IonSelect,
    IonSelectOption,
    CommonModule,
    FormsModule,
  ],
})
export class NewPostPage implements OnInit {
  readonly maxTitleLength = 64;

  private readonly initialFormState: { title: string; selectedEventId: string | null } = {
    title: '',
    selectedEventId: null,
  };

  formModel: { title: string; selectedEventId: string | null } = { ...this.initialFormState };

  events: EventEntity[] = [];

  photoPreview: string | null = null;
  private selectedPhoto: PostPhoto | null = null;

  currentEmail: string | null = null;

  nextPostId: number = 1;
  

  constructor(
    private readonly dataService: PostDataService,
    private readonly router: Router,
    private readonly photoService: PhotoService,
    private readonly authService: AuthService,
    private readonly actionSheetCtrl: ActionSheetController,
  ) {
    this.authService.user$.subscribe((user: User | null) => {
      this.currentEmail = user?.email ?? null;
    });
    addIcons({
      camera,
      images,
    });
        this.dataService
      .getPosts()
      .subscribe({
        next: (posts) => {
          this.nextPostId = posts.length + 1;
          console.log('[NewPost] nextPostId calculado:', this.nextPostId);
        },
        error: (err) => {
          console.error('[NewPost] Error cargando posts para calcular nextPostId', err);
        },
      });
  }

  ngOnInit() {
    this.loadEvents();
  }

  private loadEvents(): void {
    this.dataService
      .getEvent()
      .pipe(take(1))
      .subscribe({
        next: (events) => {
          console.log('[NewPost] Eventos cargados para el selector:', events);
          this.events = events;
        },
        error: (err) => {
          console.error('[NewPost] Error cargando eventos para el selector', err);
        },
      });
  }

  async onAddPhoto(): Promise<void> {
    console.log('[NewPost] onAddPhoto pulsado');

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Añadir foto',
      buttons: [
        {
          text: 'Hacer foto',
          icon: 'camera',
          handler: () => {
            this.handlePickPhoto(CameraSource.Camera);
          },
        },
        {
          text: 'Elegir de la galería',
          icon: 'images',
          handler: () => {
            this.handlePickPhoto(CameraSource.Photos);
          },
        },
        {
          text: 'Cancelar',
          role: 'cancel',
        },
      ],
    });

    await actionSheet.present();
  }

  private async handlePickPhoto(source: CameraSource): Promise<void> {
    const photo = await this.photoService.getPhotoFromSource(source);
    if (!photo) {
      console.log('[NewPost] No se seleccionó ninguna foto');
      return;
    }

    this.selectedPhoto = photo;
    this.photoPreview = photo.webPath;
    console.log('[NewPost] Foto seleccionada para previsualización:', this.photoPreview);
  }

  onSubmit(form: NgForm): void {
    const selectedEvent = this.events.find(
      (e) => String(e.id) === String(this.formModel.selectedEventId)
    );

    const eventName = selectedEvent ? selectedEvent.eventName : '';

    const imageUrl = this.selectedPhoto ? this.selectedPhoto.webPath : null;

    if (this.currentEmail) {
      const post: PostEntity = {
        id: this.nextPostId.toString(),
        title: this.formModel.title,
        likes: 0,
        eventName,
        createdAt: new Date() as any,
        author: this.currentEmail,
        imageUrl,
      };

      console.log('[NewPost] PostEntity desde formulario (antes de enviar):', post);

      this.dataService
        .sendEvent(post)
        .pipe(take(1))
        .subscribe({
          next: () => {
            console.log('[NewPost] Post enviado a Firestore correctamente');
            form.resetForm(this.initialFormState);
            this.formModel = { ...this.initialFormState };
            this.photoPreview = null;
            this.selectedPhoto = null;
            this.router.navigateByUrl('/tabs/home?refreshPosts=true');
          },
          error: (err) => {
            console.error('[NewPost] Error al enviar el post a Firestore', err);
          },
        });
    }
  }
}