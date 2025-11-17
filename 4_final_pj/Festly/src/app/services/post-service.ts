import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PostEntity } from '../interfaces/models/post.entity';
import { PostDTO } from '../interfaces/models/post.dto';
import { Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { mapPostsDTOtoEntities } from '../interfaces/mapper/post.mapper';
import { PostDataService } from './post-data.abstract';

@Injectable({
  providedIn: 'root',
})
export class PostService extends PostDataService {
  private jsonUrl = 'assets/data/posts.json'
  
  constructor(private http: HttpClient) {
    super();
  }

  getPosts(): Observable<PostEntity[]>{
    return this.http.get<PostDTO[]>(this.jsonUrl).pipe(
      map(mapPostsDTOtoEntities)
    );
  }

  /**
   * Get a paginated slice of posts by fetching all posts and slicing client-side.
   * @param page The page number (1-based).
   * @param pageSize Number of posts per page.
   * We have added a delay to simulate a delay in the call.
   */
  getPage(page: number, pageSize: number): Observable<PostEntity[]> {
    return this.getPosts().pipe(
      delay(500),
      map(posts => {
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        return posts.slice(start, end);
      })
    );
  }
}
