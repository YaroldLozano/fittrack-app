import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from '../core/services/notification.service';
import { AppNotification } from '../core/models/notification.model';
import { withCd } from '../core/utils/with-cd';

@Component({
  selector: 'app-notifications',
  templateUrl: 'notifications.page.html',
  styleUrls: ['notifications.page.scss'],
  standalone: false,
})
export class NotificationsPage implements OnInit {
  notifications: AppNotification[] = [];
  isLoading = true;

  constructor(private notificationService: NotificationService, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.isLoading = true;
    this.notificationService.list().subscribe({
      next: withCd(this.cdr, (res) => {
        this.isLoading = false;
        this.notifications = res.notifications;
      }),
      error: withCd(this.cdr, (err) => {
        this.isLoading = false;
        console.error(err);
      }),
    });
  }

  text(n: AppNotification): string {
    switch (n.type) {
      case 'post_like':
        return `${n.actor.username} dio me gusta a tu publicación`;
      case 'post_comment':
        return `${n.actor.username} comentó tu publicación`;
      case 'friend_request':
        return `${n.actor.username} te envió una solicitud de amistad`;
      default:
        return `${n.actor.username} interactuó contigo`;
    }
  }

  open(n: AppNotification): void {
    if (!n.is_read) {
      this.notificationService.markRead(n.id).subscribe();
      n.is_read = true;
    }
    if (n.subject_type === 'post') {
      this.router.navigate(['/app/posts', n.subject_id]);
    } else if (n.type === 'friend_request') {
      this.router.navigate(['/app/friends']);
    }
  }

  markAllRead(): void {
    this.notificationService.markAllRead().subscribe({
      next: withCd(this.cdr, () => this.notifications.forEach((n) => (n.is_read = true))),
      error: withCd(this.cdr, (err) => console.error(err)),
    });
  }

  get hasUnread(): boolean {
    return this.notifications.some((n) => !n.is_read);
  }
}
