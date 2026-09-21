import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FriendService } from '../core/services/friend.service';
import { ChatService } from '../core/services/chat.service';
import { Friend, FriendRequest, FriendSearchResult } from '../core/models/friend.model';
import { withCd } from '../core/utils/with-cd';

type FriendsTab = 'buscar' | 'solicitudes' | 'amigos';

@Component({
  selector: 'app-friends',
  templateUrl: 'friends.page.html',
  styleUrls: ['friends.page.scss'],
  standalone: false,
})
export class FriendsPage implements OnInit {
  tab: FriendsTab = 'amigos';

  query = '';
  searchResults: FriendSearchResult[] = [];
  isSearching = false;

  incoming: FriendRequest[] = [];
  outgoing: FriendRequest[] = [];
  friends: Friend[] = [];

  isLoading = true;

  isOpeningChat = false;

  constructor(
    private friendService: FriendService,
    private chatService: ChatService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadFriends();
    this.loadRequests();
  }

  setTab(tab: FriendsTab): void {
    this.tab = tab;
  }

  private loadFriends(): void {
    this.isLoading = true;
    this.friendService.list().subscribe(
      withCd(this.cdr, (res) => {
        this.isLoading = false;
        this.friends = res.friends;
      })
    );
  }

  private loadRequests(): void {
    this.friendService.incoming().subscribe(withCd(this.cdr, (res) => (this.incoming = res.requests)));
    this.friendService.outgoing().subscribe(withCd(this.cdr, (res) => (this.outgoing = res.requests)));
  }

  search(): void {
    if (!this.query.trim()) {
      this.searchResults = [];
      return;
    }
    this.isSearching = true;
    this.friendService.search(this.query).subscribe(
      withCd(this.cdr, (res) => {
        this.isSearching = false;
        this.searchResults = res.users;
      })
    );
  }

  sendRequest(userId: number): void {
    this.friendService.sendRequest(userId).subscribe(
      withCd(this.cdr, () => {
        this.search();
        this.loadRequests();
      })
    );
  }

  accept(requestId: number): void {
    this.friendService.accept(requestId).subscribe(
      withCd(this.cdr, () => {
        this.loadFriends();
        this.loadRequests();
      })
    );
  }

  reject(requestId: number): void {
    this.friendService.reject(requestId).subscribe(withCd(this.cdr, () => this.loadRequests()));
  }

  cancel(requestId: number): void {
    this.friendService.cancel(requestId).subscribe(withCd(this.cdr, () => this.loadRequests()));
  }

  openProfile(userId: number): void {
    this.router.navigate(['/app/friends', userId]);
  }

  openChat(event: Event, friendId: number): void {
    event.stopPropagation();
    if (this.isOpeningChat) {
      return;
    }
    this.isOpeningChat = true;
    this.chatService.createConversation(friendId).subscribe({
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
