import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from '../core/services/chat.service';
import { FriendService } from '../core/services/friend.service';
import { Conversation } from '../core/models/chat.model';
import { withCd } from '../core/utils/with-cd';

@Component({
  selector: 'app-messages',
  templateUrl: 'messages.page.html',
  styleUrls: ['messages.page.scss'],
  standalone: false,
})
export class MessagesPage implements OnInit {
  conversations: Conversation[] = [];
  isLoading = true;
  hasFriends = true;
  query = '';

  constructor(
    private chatService: ChatService,
    private friendService: FriendService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.load();
  }

  ionViewWillEnter(): void {
    this.load();
  }

  private load(): void {
    this.isLoading = true;
    this.chatService.getConversations().subscribe(
      withCd(this.cdr, (res) => {
        this.isLoading = false;
        this.conversations = res.conversations;
        if (this.conversations.length === 0) {
          this.friendService.list().subscribe(
            withCd(this.cdr, (friendsRes) => (this.hasFriends = friendsRes.friends.length > 0))
          );
        }
      })
    );
  }

  get filtered(): Conversation[] {
    const q = this.query.trim().toLowerCase();
    if (!q) {
      return this.conversations;
    }
    return this.conversations.filter((c) => c.friend.username.toLowerCase().includes(q));
  }

  openConversation(id: number): void {
    this.router.navigate(['/app/messages', id]);
  }

  initials(username: string): string {
    return username.charAt(0).toUpperCase();
  }

  formatTimestamp(iso: string): string {
    const date = new Date(iso.replace(' ', 'T'));
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    if (isToday) {
      return date.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });
    }
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Ayer';
    }
    const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000);
    if (diffDays < 7) {
      return date.toLocaleDateString('es', { weekday: 'short' });
    }
    return date.toLocaleDateString('es', { day: '2-digit', month: '2-digit' });
  }
}
