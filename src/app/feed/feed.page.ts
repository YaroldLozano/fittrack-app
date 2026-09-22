import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostService } from '../core/services/post.service';
import { StoryService } from '../core/services/story.service';
import { AuthService } from '../core/services/auth.service';
import { Post } from '../core/models/post.model';
import { StoryGroup } from '../core/models/story.model';
import { withCd } from '../core/utils/with-cd';

@Component({
  selector: 'app-feed',
  templateUrl: 'feed.page.html',
  styleUrls: ['feed.page.scss'],
  standalone: false,
})
export class FeedPage implements OnInit {
  storyGroups: StoryGroup[] = [];
  posts: Post[] = [];
  isLoading = true;
  isLoadingMore = false;
  hasMore = false;
  myUserId: number | null = null;

  constructor(
    private postService: PostService,
    private storyService: StoryService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.myUserId = this.authService.currentUserValue?.id ?? null;
  }

  ngOnInit(): void {
    this.load();
  }

  ionViewWillEnter(): void {
    this.load();
  }

  private load(): void {
    this.isLoading = true;
    this.storyService.listActive().subscribe({
      next: withCd(this.cdr, (res) => (this.storyGroups = res.groups)),
      error: withCd(this.cdr, (err) => console.error(err)),
    });
    this.postService.feed().subscribe({
      next: withCd(this.cdr, (res) => {
        this.isLoading = false;
        this.posts = res.posts;
        this.hasMore = res.has_more;
      }),
      error: withCd(this.cdr, (err) => {
        this.isLoading = false;
        console.error(err);
      }),
    });
  }

  loadMore(): void {
    if (this.isLoadingMore || !this.hasMore || this.posts.length === 0) {
      return;
    }
    this.isLoadingMore = true;
    const oldestId = this.posts[this.posts.length - 1].id;
    this.postService.feed(oldestId).subscribe({
      next: withCd(this.cdr, (res) => {
        this.isLoadingMore = false;
        this.posts = [...this.posts, ...res.posts];
        this.hasMore = res.has_more;
      }),
      error: withCd(this.cdr, (err) => {
        this.isLoadingMore = false;
        console.error(err);
      }),
    });
  }

  get myStoryGroup(): StoryGroup | undefined {
    return this.storyGroups.find((g) => g.author.id === this.myUserId);
  }

  get friendStoryGroups(): StoryGroup[] {
    return this.storyGroups.filter((g) => g.author.id !== this.myUserId);
  }

  openStories(authorId: number): void {
    this.router.navigate(['/app/stories', authorId]);
  }

  toggleLike(post: Post): void {
    post.liked_by_me = !post.liked_by_me;
    post.like_count += post.liked_by_me ? 1 : -1;
    const action = post.liked_by_me ? this.postService.like(post.id) : this.postService.unlike(post.id);
    action.subscribe();
  }

  openPost(postId: number): void {
    this.router.navigate(['/app/posts', postId]);
  }

  openAuthor(authorId: number): void {
    if (authorId === this.myUserId) {
      this.router.navigate(['/app/profile']);
    } else {
      this.router.navigate(['/app/friends', authorId]);
    }
  }

  createPost(): void {
    this.router.navigate(['/app/create-post']);
  }

  createStory(): void {
    this.router.navigate(['/app/create-story']);
  }
}
