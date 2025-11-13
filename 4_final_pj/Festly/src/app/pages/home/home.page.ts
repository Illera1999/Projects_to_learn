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
import { PostService } from 'src/app/services/post-service';

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
  page = 1;
  pageSize = 5;
  noMorePost = signal<boolean>(false);

  constructor(private postService: PostService) { }

  @ViewChild(IonContent, { static: true }) content!: IonContent;

  ngOnInit() {
    this.loadMore();
  }

  private loadMore(event?: InfiniteScrollCustomEvent) {
    if (this.noMorePost()) {
      event?.target.complete();
      return;
    }

    this.postService.getPage(this.page, this.pageSize).subscribe({
      next: (data) => {
        if (data.length === 0) {
          this.noMorePost.set(true);
          console.log('%c[No More Posts]', 'color: #ef4444; font-weight: bold;');
          console.log('🛑 No additional posts available. Stopping infinite scroll.');
          event?.target.complete();
          return;
        }

        this.posts.update(p => [...p, ...data]);
        this.page++;

        setTimeout(() => this.checkScrollable(event), 0);
      },
      error: (err) => {
        console.error('Error loading posts', err);
        event?.target.complete();
      }
    });
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
      this.loadMore(event);
    } else {
      if (this.noMorePost()) {
        console.log('%c[No More Posts]', 'color: #ef4444; font-weight: bold;');
        console.log('🛑 No additional posts available. Stopping infinite scroll.');
      }
      event?.target.complete();
    }
  }

  getMorePost(event: InfiniteScrollCustomEvent) {
    console.log('%c[Infinite Scroll Triggered]', 'color: #16a34a; font-weight: bold;');
    console.log('📄 Current page:', this.page, '| Page size:', this.pageSize);
    this.loadMore(event);
  }

  handleRefresh(event: CustomEvent) {
    this.page = 1
    this.noMorePost.set(false);
    this.posts.set([]);
    this.loadMore(event as any);
  }
}
