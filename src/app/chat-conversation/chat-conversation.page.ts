import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, interval } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { ChatService } from '../core/services/chat.service';
import { AuthService } from '../core/services/auth.service';
import { Conversation, Message } from '../core/models/chat.model';
import { withCd } from '../core/utils/with-cd';

const POLL_INTERVAL_MS = 4000;
const NEAR_BOTTOM_THRESHOLD_PX = 120;
const MAX_MESSAGE_LENGTH = 2000;

@Component({
  selector: 'app-chat-conversation',
  templateUrl: 'chat-conversation.page.html',
  styleUrls: ['chat-conversation.page.scss'],
  standalone: false,
})
export class ChatConversationPage implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('content', { read: ElementRef }) ionContentRef!: ElementRef<HTMLIonContentElement>;
  @ViewChild('scrollAnchor') scrollAnchor!: ElementRef<HTMLElement>;

  conversationId!: number;
  conversation: Conversation | null = null;
  messages: Message[] = [];
  currentUserId: number | null = null;

  isLoading = true;
  isLoadingMore = false;
  hasMore = false;

  draft = '';
  isSending = false;
  sendFailed = false;
  showNewMessageBanner = false;

  readonly maxLength = MAX_MESSAGE_LENGTH;

  private scrollEl: HTMLElement | null = null;
  private destroy$ = new Subject<void>();
  private lastMessageId = 0;

  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.currentUserId = this.authService.currentUserValue?.id ?? null;
  }

  ngOnInit(): void {
    this.conversationId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadInitial();
  }

  ngAfterViewInit(): void {
    this.ionContentRef.nativeElement.getScrollElement().then((el) => (this.scrollEl = el));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadInitial(): void {
    this.isLoading = true;
    this.chatService.getMessages(this.conversationId).subscribe({
      next: withCd(this.cdr, (res) => {
        this.isLoading = false;
        this.conversation = res.conversation;
        this.messages = res.messages;
        this.hasMore = res.has_more;
        this.lastMessageId = this.messages.length > 0 ? this.messages[this.messages.length - 1].id : 0;
        setTimeout(() => this.scrollToBottom(false), 0);
        this.markReadIfNeeded();
        this.startPolling();
      }),
      error: withCd(this.cdr, () => {
        this.isLoading = false;
      }),
    });
  }

  private startPolling(): void {
    interval(POLL_INTERVAL_MS)
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() => this.chatService.getMessages(this.conversationId, undefined, 50))
      )
      .subscribe(
        withCd(this.cdr, (res) => {
          if (document.hidden) {
            return;
          }
          this.conversation = res.conversation;
          const newest = res.messages;
          const latestId = newest.length > 0 ? newest[newest.length - 1].id : this.lastMessageId;

          if (latestId > this.lastMessageId) {
            const nearBottom = this.isNearBottom();
            const existingIds = new Set(this.messages.map((m) => m.id));
            const toAppend = newest.filter((m) => !existingIds.has(m.id));
            this.messages = [...this.messages, ...toAppend];
            this.lastMessageId = latestId;

            if (nearBottom) {
              setTimeout(() => this.scrollToBottom(true), 0);
              this.markReadIfNeeded();
            } else {
              this.showNewMessageBanner = true;
            }
          }
        })
      );
  }

  loadMore(): void {
    if (this.isLoadingMore || !this.hasMore || this.messages.length === 0) {
      return;
    }
    this.isLoadingMore = true;
    const oldestId = this.messages[0].id;
    const previousScrollHeight = this.scrollEl?.scrollHeight ?? 0;

    this.chatService.getMessages(this.conversationId, oldestId, 50).subscribe(
      withCd(this.cdr, (res) => {
        this.isLoadingMore = false;
        this.hasMore = res.has_more;
        this.messages = [...res.messages, ...this.messages];

        setTimeout(() => {
          if (this.scrollEl) {
            const newScrollHeight = this.scrollEl.scrollHeight;
            this.scrollEl.scrollTop = newScrollHeight - previousScrollHeight;
          }
        }, 0);
      })
    );
  }

  onScroll(): void {
    if (!this.scrollEl) {
      return;
    }
    if (this.scrollEl.scrollTop < 60) {
      this.loadMore();
    }
    if (this.isNearBottom()) {
      this.showNewMessageBanner = false;
    }
  }

  send(): void {
    const text = this.draft.trim();
    if (text === '' || this.isSending || text.length > this.maxLength) {
      return;
    }
    this.isSending = true;
    this.sendFailed = false;

    this.chatService.sendMessage(this.conversationId, text).subscribe({
      next: withCd(this.cdr, (res) => {
        this.isSending = false;
        this.draft = '';
        this.messages = [...this.messages, res.message_data];
        this.lastMessageId = res.message_data.id;
        setTimeout(() => this.scrollToBottom(true), 0);
      }),
      error: withCd(this.cdr, () => {
        this.isSending = false;
        this.sendFailed = true;
      }),
    });
  }

  onComposerKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.send();
    }
  }

  retrySend(): void {
    this.sendFailed = false;
    this.send();
  }

  private markReadIfNeeded(): void {
    if (this.conversation && this.conversation.unread_count > 0) {
      this.chatService.markRead(this.conversationId).subscribe(
        withCd(this.cdr, () => {
          if (this.conversation) {
            this.conversation = { ...this.conversation, unread_count: 0 };
          }
        })
      );
    }
  }

  scrollToBottom(smooth: boolean): void {
    this.showNewMessageBanner = false;
    this.ionContentRef?.nativeElement?.scrollToBottom(smooth ? 200 : 0);
  }

  private isNearBottom(): boolean {
    if (!this.scrollEl) {
      return true;
    }
    const { scrollTop, scrollHeight, clientHeight } = this.scrollEl;
    return scrollHeight - (scrollTop + clientHeight) < NEAR_BOTTOM_THRESHOLD_PX;
  }

  isMine(message: Message): boolean {
    return message.sender_id === this.currentUserId;
  }

  formatTime(iso: string): string {
    return new Date(iso.replace(' ', 'T')).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });
  }

  goBack(): void {
    this.router.navigate(['/app/messages']);
  }

  onFriendProfile(): void {
    if (this.conversation) {
      this.router.navigate(['/app/friends', this.conversation.friend.id]);
    }
  }
}
