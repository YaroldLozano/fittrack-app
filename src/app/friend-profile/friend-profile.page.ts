import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FriendService } from '../core/services/friend.service';
import { ChatService } from '../core/services/chat.service';
import { PostService } from '../core/services/post.service';
import { PublicProfile, Comparison } from '../core/models/friend.model';
import { Post } from '../core/models/post.model';
import { withCd } from '../core/utils/with-cd';

@Component({
  selector: 'app-friend-profile',
  templateUrl: 'friend-profile.page.html',
  styleUrls: ['friend-profile.page.scss'],
  standalone: false,
})
export class FriendProfilePage implements OnInit {
  userId!: number;
  profile: PublicProfile | null = null;
  comparison: Comparison | null = null;
  showComparison = false;
  isLoading = true;
  isOpeningChat = false;
  posts: Post[] = [];

  constructor(
    private friendService: FriendService,
    private chatService: ChatService,
    private postService: PostService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    this.load();
  }

  private load(): void {
    this.isLoading = true;
    this.friendService.profile(this.userId).subscribe(
      withCd(this.cdr, (res) => {
        this.isLoading = false;
        this.profile = res.profile;
      })
    );
    this.postService.forUser(this.userId).subscribe(withCd(this.cdr, (res) => (this.posts = res.posts)));
  }

  openPost(postId: number): void {
    this.router.navigate(['/app/posts', postId]);
  }

  toggleCompare(): void {
    this.showComparison = !this.showComparison;
    if (this.showComparison && !this.comparison) {
      this.friendService.compare(this.userId).subscribe(withCd(this.cdr, (res) => (this.comparison = res.comparison)));
    }
  }

  goToChallenges(): void {
    this.router.navigate(['/app/challenges']);
  }

  goToGroupWorkouts(): void {
    this.router.navigate(['/app/group-workouts']);
  }

  openChat(): void {
    if (this.isOpeningChat) {
      return;
    }
    this.isOpeningChat = true;
    this.chatService.createConversation(this.userId).subscribe({
      next: withCd(this.cdr, (res) => {
        this.isOpeningChat = false;
        this.router.navigate(['/app/messages', res.conversation.id]);
      }),
      error: withCd(this.cdr, () => {
        this.isOpeningChat = false;
      }),
    });
  }
}
