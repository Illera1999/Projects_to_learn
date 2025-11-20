import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';

import { PostDataService as DataService } from './data.abstract';
import { PostEntity } from '../interfaces/models/post/post.entity';
import { PostDTO } from '../interfaces/models/post/post.dto';
import { mapPostEntityToDTO, mapPostsDTOtoEntities, mapPostsEntitiesToDTOs } from '../interfaces/mapper/post.mapper';

import {
  Firestore,
  collection,
  collectionData,
  addDoc,
} from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { EventEntity } from '../interfaces/models/event/event.entity';
import { mapEventsDTOtoEntities } from '../interfaces/mapper/event.mapper';
import { EventDto } from '../interfaces/models/event/event.dto';

@Injectable({
  providedIn: 'root',
})

export class FirestoreService extends DataService {

  constructor(private firestore: Firestore) {
    super();
  }

  override getPosts(): Observable<PostEntity[]> {
    const postsRef = collection(this.firestore, 'posts');
    return collectionData(postsRef, { idField: 'id' }).pipe(
      map((postsDTO) => mapPostsDTOtoEntities(postsDTO as PostDTO[]))
    );
  }
  override getPage(page: number, pageSize: number): Observable<PostEntity[]> {
    return this.getPosts().pipe(
      map((posts) => {
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        return posts.slice(start, end);
      })
    );
  }

  override getEvent(): Observable<EventEntity[]> {
    const eventsRef = collection(this.firestore, 'events');
    return collectionData(eventsRef, { idField: 'id' }).pipe(
      map((eventsDTO) =>
        mapEventsDTOtoEntities(eventsDTO as EventDto[])
      )
    );
  }

  override sendEvent(post: PostEntity): Observable<void> {
    const postsRef = collection(this.firestore, 'posts');
    const dto: PostDTO = mapPostEntityToDTO(post);
  
    return from(addDoc(postsRef, dto)).pipe(
      map(() => void 0)
    );
  }
}