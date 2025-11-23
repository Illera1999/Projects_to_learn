
import { Observable } from 'rxjs';
import { PostEntity } from '../interfaces/models/post/post.entity';
import { EventEntity } from '../interfaces/models/event/event.entity';
export abstract class PostDataService {
    abstract getPosts(): Observable<PostEntity[]>;
    abstract getPage(page: number, pageSize: number): Observable<PostEntity[]>;
    abstract getEvent(): Observable<EventEntity[]>;
    abstract sendEvent(post: PostEntity): Observable<void>;

    abstract toggleLike(postId: string, userId: string, like: boolean): Observable<void>;
    abstract getUserLikes(userId: string): Observable<string[]>;
}