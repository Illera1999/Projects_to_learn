import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';

import { PostDataService } from './post-data.abstract';
import { PostEntity } from '../interfaces/models/post.entity';
import { PostDTO } from '../interfaces/models/post.dto';
import { mapPostEntityToDTO, mapPostsDTOtoEntities, mapPostsEntitiesToDTOs } from '../interfaces/mapper/post.mapper';

import {
  Firestore,
  collection,
  collectionData,
  addDoc,
} from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})

export class PostFirestoreService extends PostDataService {

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

  addPost(PostEntity: PostEntity): Observable<string> {
    const postsRef = collection(this.firestore, 'posts');
    return from(addDoc(postsRef, mapPostEntityToDTO(PostEntity))).pipe(
      map((docRef) => docRef.id)
    );
  }

}
