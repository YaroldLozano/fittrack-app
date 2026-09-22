import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { FriendService } from '../core/services/friend.service';
import { NotificationService } from '../core/services/notification.service';
import { withCd } from '../core/utils/with-cd';

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

interface MenuLink {
  path: string;
  label: string;
  icon: string;
}

interface MenuSection {
  title: string;
  links: MenuLink[];
}

@Component({
  selector: 'app-shell',
  templateUrl: 'shell.page.html',
  styleUrls: ['shell.page.scss'],
  standalone: false,
})
export class ShellPage implements OnInit {
  readonly navItems: NavItem[] = [
    { path: '/app/dashboard', label: 'Inicio', icon: 'home-outline' },
    { path: '/app/workout', label: 'Entrenar', icon: 'barbell-outline' },
    { path: '/app/progress', label: 'Progreso', icon: 'trending-up-outline' },
    { path: '/app/feed', label: 'Social', icon: 'people-outline' },
    { path: '/app/profile', label: 'Perfil', icon: 'person-circle-outline' },
  ];

  readonly menuSections: MenuSection[] = [
    {
      title: 'Perfil',
      links: [
        { path: '/app/profile', label: 'Mi perfil', icon: 'person-outline' },
      ],
    },
    {
      title: 'Herramientas',
      links: [
        { path: '/app/notes', label: 'Notas', icon: 'document-text-outline' },
      ],
    },
    {
      title: 'Social',
      links: [
        { path: '/app/feed', label: 'Feed', icon: 'newspaper-outline' },
        { path: '/app/friends', label: 'Amigos', icon: 'people-outline' },
        { path: '/app/ranking', label: 'Ranking', icon: 'podium-outline' },
        { path: '/app/challenges', label: 'Retos', icon: 'flash-outline' },
        { path: '/app/group-workouts', label: 'Entrenamientos grupales', icon: 'people-circle-outline' },
        { path: '/app/messages', label: 'Mensajes', icon: 'chatbubble-ellipses-outline' },
        { path: '/app/notifications', label: 'Notificaciones', icon: 'notifications-outline' },
        { path: '/app/achievements', label: 'Logros', icon: 'ribbon-outline' },
      ],
    },
  ];

  username: string | null = null;
  myAvatarMediaId: number | null = null;
  unreadNotifications = 0;
  menuOpen = false;

  constructor(
    private authService: AuthService,
    private friendService: FriendService,
    private notificationService: NotificationService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.username = this.authService.currentUserValue?.username ?? null;
  }

  ngOnInit(): void {
    const myId = this.authService.currentUserValue?.id;
    if (myId) {
      this.friendService.profile(myId).subscribe({
        next: withCd(this.cdr, (res) => (this.myAvatarMediaId = res.profile.avatar_media_id)),
        error: withCd(this.cdr, (err) => console.error(err)),
      });
    }
    this.notificationService.list().subscribe({
      next: withCd(this.cdr, (res) => (this.unreadNotifications = res.unread_count)),
      error: withCd(this.cdr, (err) => console.error(err)),
    });
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  async onLogout() {
    await this.authService.logout();
    this.router.navigateByUrl('/auth');
  }
}
