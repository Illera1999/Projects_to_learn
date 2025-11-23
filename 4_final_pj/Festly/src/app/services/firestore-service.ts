import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';

import { PostDataService as DataService } from './data.abstract';
import { PostEntity } from '../interfaces/models/post/post.entity';
import { PostDTO } from '../interfaces/models/post/post.dto';
import { mapPostEntityToDTO, mapPostsDTOtoEntities } from '../interfaces/mapper/post.mapper';

import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  updateDoc,
  increment,
  setDoc,
  deleteDoc,
  doc,
} from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
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

  /// [getUserLikes] return id of post that the user gives likes.
  override getUserLikes(userId: string): Observable<string[]> {
    const likesRef = collection(this.firestore, 'postLikes');

    return collectionData(likesRef, { idField: 'id' }).pipe(
      map((docs: any[]) =>
        docs
          .filter(doc => doc.userId === userId)
          .map(doc => doc.postId as string)
      )
    );
  }

    override toggleLike(postId: string, userId: string, like: boolean): Observable<void> {
    if (!postId || !userId) {
      return of(void 0);
    }

    const postDocRef = doc(this.firestore, 'posts', postId);
    const likeDocId = `${postId}_${userId}`;
    const likeDocRef = doc(this.firestore, 'postLikes', likeDocId);

    if (like) {
      return from(
        Promise.all([
          setDoc(likeDocRef, {
            postId,
            userId,
            createdAt: new Date(),
          }),
          updateDoc(postDocRef, {
            likes: increment(1),
          }),
        ])
      ).pipe(map(() => void 0));
    } else {
      return from(
        Promise.all([
          deleteDoc(likeDocRef),
          updateDoc(postDocRef, {
            likes: increment(-1),
          }),
        ])
      ).pipe(map(() => void 0));
    }
  }
}