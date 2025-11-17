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
  IonAvatar,
  IonLabel,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  InfiniteScrollCustomEvent,
  IonRefresher,
  IonRefresherContent
} from '@ionic/angular/standalone';
import { PostEntity } from 'src/app/interfaces/models/post.entity';
import { PostDataService } from 'src/app/services/post-data.abstract';

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
    IonAvatar,
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

  constructor(private postService: PostDataService) { }

  @ViewChild(IonContent, { static: true }) content!: IonContent;

  ngOnInit() {
    this.postService.getPosts().subscribe({
      next: (data) => {
        this.allPosts.set(data);

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
    this.page = 1;
    this.noMorePost.set(false);
    this.rebuildVisiblePosts(event as any);
  }
}
