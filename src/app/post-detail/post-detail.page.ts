import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../core/services/post.service';
import { AuthService } from '../core/services/auth.service';
import { Post, PostComment, PostVisibility } from '../core/models/post.model';
import { withCd } from '../core/utils/with-cd';

@Component({
  selector: 'app-post-detail',
  templateUrl: 'post-detail.page.html',
  styleUrls: ['post-detail.page.scss'],
  standalone: false,
})
export class PostDetailPage implements OnInit {
  post: Post | null = null;
  comments: PostComment[] = [];
  isLoading = true;
  myUserId: number | null = null;
  draftComment = '';
  isSendingComment = false;

  isEditing = false;
  editCaption = '';
  editVisibility: PostVisibility = 'friends';
  isSaving = false;
  error = '';

  constructor(
    private postService: PostService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.myUserId = this.authService.currentUserValue?.id ?? null;
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.load(id);
  }

  private load(id: number): void {
    this.isLoading = true;
    this.postService.get(id).subscribe({
      next: withCd(this.cdr, (res) => {
        this.isLoading = false;
        this.post = res.post;
      }),
      error: withCd(this.cdr, () => {
        this.isLoading = false;
      }),
    });
    this.postService.comments(id).subscribe(withCd(this.cdr, (res) => (this.comments = res.comments)));
  }

  get isMine(): boolean {
    return this.post?.author.id === this.myUserId;
  }

  toggleLike(): void {
    if (!this.post) {
      return;
    }
    this.post.liked_by_me = !this.post.liked_by_me;
    this.post.like_count += this.post.liked_by_me ? 1 : -1;
    const action = this.post.liked_by_me ? this.postService.like(this.post.id) : this.postService.unlike(this.post.id);
    action.subscribe();
  }

  sendComment(): void {
    const text = this.draftComment.trim();
    if (!text || !this.post || this.isSendingComment) {
      return;
    }
    this.isSendingComment = true;
    this.postService.addComment(this.post.id, text).subscribe({
      next: withCd(this.cdr, (res) => {
        this.isSendingComment = false;
        this.draftComment = '';
        this.comments = [...this.comments, res.comment];
        if (this.post) {
          this.post.comment_count++;
        }
      }),
      error: withCd(this.cdr, () => {
        this.isSendingComment = false;
      }),
    });
  }

  deleteComment(comment: PostComment): void {
    this.postService.deleteComment(comment.id).subscribe(
      withCd(this.cdr, () => {
        this.comments = this.comments.filter((c) => c.id !== comment.id);
        if (this.post) {
          this.post.comment_count--;
        }
      })
    );
  }

  openAuthor(userId: number): void {
    if (userId === this.myUserId) {
      this.router.navigate(['/app/profile']);
    } else {
      this.router.navigate(['/app/friends', userId]);
    }
  }

  startEdit(): void {
    if (!this.post) {
      return;
    }
    this.editCaption = this.post.caption ?? '';
    this.editVisibility = this.post.visibility;
    this.isEditing = true;
  }

  saveEdit(): void {
    if (!this.post) {
      return;
    }
    this.isSaving = true;
    this.postService.update(this.post.id, { caption: this.editCaption, visibility: this.editVisibility }).subscribe({
      next: withCd(this.cdr, (res) => {
        this.isSaving = false;
        this.isEditing = false;
        this.post = res.post;
      }),
      error: withCd(this.cdr, (err) => {
        this.isSaving = false;
        this.error = err.error?.message || 'No se pudo guardar';
      }),
    });
  }

  deletePost(): void {
    if (!this.post) {
      return;
    }
    this.postService.delete(this.post.id).subscribe(withCd(this.cdr, () => this.router.navigateByUrl('/app/feed')));
  }

  goBack(): void {
    this.router.navigateByUrl('/app/feed');
  }
}
