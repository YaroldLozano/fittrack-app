import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StoryService } from '../core/services/story.service';
import { AuthService } from '../core/services/auth.service';
import { StoryGroup, StoryViewer } from '../core/models/story.model';
import { withCd } from '../core/utils/with-cd';

const IMAGE_DURATION_MS = 5000;

@Component({
  selector: 'app-story-viewer',
  templateUrl: 'story-viewer.page.html',
  styleUrls: ['story-viewer.page.scss'],
  standalone: false,
})
export class StoryViewerPage implements OnInit, OnDestroy {
  group: StoryGroup | null = null;
  index = 0;
  progress = 0;
  isLoading = true;
  isMine = false;
  showViewers = false;
  viewers: StoryViewer[] = [];

  private timer: ReturnType<typeof setInterval> | null = null;
  private authorId!: number;
  private myUserId: number | null = null;

  constructor(
    private storyService: StoryService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.myUserId = this.authService.currentUserValue?.id ?? null;
  }

  ngOnInit(): void {
    this.authorId = Number(this.route.snapshot.paramMap.get('userId'));
    this.storyService.listActive().subscribe({
      next: withCd(this.cdr, (res) => {
        this.isLoading = false;
        this.group = res.groups.find((g) => g.author.id === this.authorId) ?? null;
        this.isMine = this.authorId === this.myUserId;
        if (!this.group || this.group.stories.length === 0) {
          this.router.navigateByUrl('/app/feed');
          return;
        }
        this.playCurrent();
      }),
      error: withCd(this.cdr, (err) => {
        this.isLoading = false;
        console.error(err);
      }),
    });
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  get current() {
    return this.group?.stories[this.index] ?? null;
  }

  private playCurrent(): void {
    this.stopTimer();
    this.progress = 0;
    const story = this.current;
    if (!story || !this.group) {
      return;
    }

    if (this.authorId !== this.myUserId) {
      this.storyService.view(story.id).subscribe();
    }

    if (story.media_type === 'video') {
      return; // el avance lo dispara (ended) en el template
    }

    const stepMs = 60;
    let elapsed = 0;
    this.timer = setInterval(() => {
      elapsed += stepMs;
      this.progress = Math.min(100, (elapsed / IMAGE_DURATION_MS) * 100);
      this.cdr.detectChanges();
      if (elapsed >= IMAGE_DURATION_MS) {
        this.next();
      }
    }, stepMs);
  }

  private stopTimer(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  onVideoTimeUpdate(event: Event): void {
    const video = event.target as HTMLVideoElement;
    if (video.duration > 0) {
      this.progress = (video.currentTime / video.duration) * 100;
    }
  }

  next(): void {
    if (!this.group) {
      return;
    }
    if (this.index < this.group.stories.length - 1) {
      this.index++;
      this.playCurrent();
    } else {
      this.close();
    }
  }

  prev(): void {
    if (!this.group) {
      return;
    }
    if (this.index > 0) {
      this.index--;
      this.playCurrent();
    }
  }

  close(): void {
    this.stopTimer();
    this.router.navigateByUrl('/app/feed');
  }

  toggleViewers(): void {
    this.showViewers = !this.showViewers;
    if (this.showViewers && this.current) {
      this.stopTimer();
      this.storyService.viewers(this.current.id).subscribe({
        next: withCd(this.cdr, (res) => (this.viewers = res.viewers)),
        error: withCd(this.cdr, (err) => console.error(err)),
      });
    } else {
      this.playCurrent();
    }
  }

  deleteCurrent(): void {
    if (!this.current) {
      return;
    }
    this.storyService.delete(this.current.id).subscribe({
      next: withCd(this.cdr, () => this.close()),
      error: withCd(this.cdr, (err) => console.error(err)),
    });
  }
}
