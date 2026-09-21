import { Component, Input } from '@angular/core';

/** Avatar reutilizado en toda la app: foto real si existe, iniciales si no. */
@Component({
  selector: 'app-avatar',
  standalone: false,
  template: `
    <img *ngIf="mediaId" [secureSrc]="mediaId" [thumb]="true" alt="" class="app-avatar-img" [class]="sizeClass" />
    <span *ngIf="!mediaId" class="avatar-initials" [class]="sizeClass">{{ initial }}</span>
  `,
  styles: [
    `
      :host {
        display: inline-flex;
      }
      .app-avatar-img {
        border-radius: 50%;
        object-fit: cover;
        width: 42px;
        height: 42px;
        flex-shrink: 0;
      }
      .app-avatar-img.sm {
        width: 32px;
        height: 32px;
      }
      .app-avatar-img.lg {
        width: 56px;
        height: 56px;
      }
      .app-avatar-img.xl {
        width: 72px;
        height: 72px;
      }
    `,
  ],
})
export class AppAvatarComponent {
  @Input() mediaId: number | null = null;
  @Input() username = '';
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md';

  get initial(): string {
    return (this.username || '?').charAt(0).toUpperCase();
  }

  get sizeClass(): string {
    return this.size === 'md' ? '' : this.size;
  }
}
