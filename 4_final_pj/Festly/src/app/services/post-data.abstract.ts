
import { Observable } from 'rxjs';
import { PostEntity } from '../interfaces/models/post.entity';
export abstract class PostDataService {
    abstract getPosts(): Observable<PostEntity[]>;
    abstract getPage(page: number, pageSize: number): Observable<PostEntity[]>;
}