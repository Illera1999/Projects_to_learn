import { Component, OnInit, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  InfiniteScrollCustomEvent,
  IonRefresher,
  IonRefresherContent
} from '@ionic/angular/standalone';
import { PostEntity } from 'src/app/interfaces/models/post/post.entity';
import { PostDataService } from 'src/app/services/data.abstract';

import { take } from 'rxjs';
import { AuthService } from 'src/app/services/auth-service';
import { User } from '@angular/fire/auth';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonList,
    IonItem,
    IonLabel,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonRefresher,
    IonRefresherContent
  ]
})
export class HomePage implements OnInit {

  posts = signal<PostEntity[]>([]);
  allPosts = signal<PostEntity[]>([]);
  page = 1;
  pageSize = 5;
  noMorePost = signal<boolean>(false);

  currentUserId: string | null = null;
  currentUserEmail: string | null = null;
  likedPostIds = signal<Set<string>>(new Set<string>());

  constructor(
    private postService: PostDataService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
    this.authService.user$.subscribe((user: User | null) => {
      if (user) {
        this.currentUserId = user.uid;
        this.currentUserEmail = user.email;
        this.loadUserLikes(user.uid);
      } else {
        this.currentUserId = null;
        this.currentUserEmail = null;
        this.likedPostIds.set(new Set());
      }
    });
  }

  @ViewChild(IonContent, { static: true }) content!: IonContent;

  ngOnInit() {
    this.loadPost()
    this.route.queryParamMap.subscribe((params) => {
      const refresh = params.get('refreshPosts');
      if (refresh === 'true') {
        console.log('[Home] Refresh solicitado por navegación desde NewPost');
        this.loadPost();
      }
    });
  }

  private loadPost() {
    this.postService.getPosts()
      .pipe(take(1))                     // 👈 snapshot único, no stream en tiempo real
      .subscribe({
        next: (data) => {
          const sorted = [...data].sort((a, b) => {
            const aTime = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
            const bTime = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
            return bTime - aTime;
          });

          const normalized = sorted.map(post => ({
            ...post,
            imageUrl: post.imageUrl && post.imageUrl.startsWith('blob:')
              ? null
              : post.imageUrl,
          }));

          this.allPosts.set(normalized);

          this.page = 1;
          this.noMorePost.set(false);
          this.rebuildVisiblePosts();

          setTimeout(() => this.checkScrollable(), 0);
        },
        error: (err) => {
          console.error('Error loading posts from Firestore', err);
        }
      });
  }


  private rebuildVisiblePosts(event?: InfiniteScrollCustomEvent) {
    const all = this.allPosts();
    const end = this.page * this.pageSize;
    const slice = all.slice(0, end);

    this.posts.set(slice);

    const noMore = slice.length >= all.length;
    this.noMorePost.set(noMore);

    if (event) {
      event.target.complete();
    }
  }

  private async checkScrollable(event?: InfiniteScrollCustomEvent) {
    const scrollElement = await this.content.getScrollElement();
    const hasScroll = scrollElement.scrollHeight > scrollElement.clientHeight + 1;

    console.log('%c[Scroll Check]', 'color: #0b84f3; font-weight: bold;');
    console.log('📜 Scroll height:', scrollElement.scrollHeight);
    console.log('🪟 Client height:', scrollElement.clientHeight);
    console.log('🎯 Hay scroll:', hasScroll);
    console.log('🚀 Infinite event triggered:', !!event);

    if (!hasScroll && !this.noMorePost()) {
      // No hay scroll todavía y aún quedan posts en memoria: avanzamos de página
      this.page++;
      this.rebuildVisiblePosts(event);
    } else {
      if (this.noMorePost()) {
        console.log('%c[No More Posts]', 'color: #ef4444; font-weight: bold;');
        console.log('🛑 No additional posts available. Stopping infinite scroll.');
      }
      if (event) {
        event.target.complete();
      }
    }
  }

  getMorePost(event: InfiniteScrollCustomEvent) {
    console.log('%c[Infinite Scroll Triggered]', 'color: #16a34a; font-weight: bold;');
    console.log('📄 Current page:', this.page, '| Page size:', this.pageSize);

    if (this.noMorePost()) {
      event.target.complete();
      return;
    }

    this.page++;
    this.rebuildVisiblePosts(event);
  }

  handleRefresh(event: CustomEvent) {
    this.postService.getPosts()
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          const sorted = [...data].sort((a, b) => {
            const aTime = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
            const bTime = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
            return bTime - aTime;
          });
          const normalized = sorted.map(post => ({
            ...post,
            imageUrl: post.imageUrl && post.imageUrl.startsWith('blob:')
              ? null
              : post.imageUrl,
          }));

          this.allPosts.set(normalized);
          this.page = 1;
          this.noMorePost.set(false);
          this.rebuildVisiblePosts();

          setTimeout(() => this.checkScrollable(), 0);
          (event.target as HTMLIonRefresherElement).complete();
        },
        error: (err) => {
          console.error('Error refreshing posts from Firestore', err);
          (event.target as HTMLIonRefresherElement).complete();
        }
      });
  }

  private loadUserLikes(userId: string): void {
    this.postService.getUserLikes(userId)
      .pipe(take(1))
      .subscribe({
        next: (postIds) => {
          console.log('[Likes] Posts likeados por el usuario:', postIds);
          this.likedPostIds.set(new Set(postIds));
        },
        error: (err) => {
          console.error('[Likes] Error cargando likes del usuario', err);
        }
      });
  }

  isPostLiked(postId: string): boolean {
    return this.likedPostIds().has(postId);
  }

  onToggleLike(post: PostEntity): void {
    if (!this.currentUserId) {
      console.warn('[Likes] Usuario no logeado, no se puede dar like');
      return;
    }

    const alreadyLiked = this.isPostLiked(post.id);
    const likeNow = !alreadyLiked;

    this.postService.toggleLike(post.id, this.currentUserId, likeNow)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.likedPostIds.update(prev => {
            const next = new Set(prev);
            if (likeNow) {
              next.add(post.id);
            } else {
              next.delete(post.id);
            }
            return next;
          });

          const delta = likeNow ? 1 : -1;

          this.allPosts.update(list =>
            list.map(p =>
              p.id === post.id
                ? { ...p, likes: Math.max(0, (p.likes || 0) + delta) }
                : p
            )
          );

          this.posts.update(list =>
            list.map(p =>
              p.id === post.id
                ? { ...p, likes: Math.max(0, (p.likes || 0) + delta) }
                : p
            )
          );
        },
        error: (err) => {
          console.error('[Likes] Error al hacer toggle del like', err);
        }
      });
  }
}
