import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { PostEntity } from 'src/app/interfaces/models/post/post.entity';
import { EventEntity } from 'src/app/interfaces/models/event/event.entity';
import { PostDataService } from 'src/app/services/data.abstract';
import { take } from 'rxjs';

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
  private readonly initialFormState: { title: string; selectedEventId: string | null } = {
    title: '',
    selectedEventId: null,
  };

  formModel: { title: string; selectedEventId: string | null } = { ...this.initialFormState };


  events: EventEntity[] = [];

  constructor(
    private readonly dataService: PostDataService,
    private readonly router: Router
  ) { }

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

  onSubmit(form: NgForm): void {
    const selectedEvent = this.events.find(
      (e) => String(e.id) === String(this.formModel.selectedEventId)
    );

    const eventName = selectedEvent ? selectedEvent.eventName : '';
    const maxId = this.events.length;
    const newId = maxId + 1;

    const post: PostEntity = {
      id: newId.toString(),
      title: this.formModel.title,
      likes: 0,
      eventName,
      createdAt: new Date() as any,
      author: 'aux',
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
          this.router.navigateByUrl('/tabs/home');
        },
        error: (err) => {
          console.error('[NewPost] Error al enviar el post a Firestore', err);
        },
      });
  }
}