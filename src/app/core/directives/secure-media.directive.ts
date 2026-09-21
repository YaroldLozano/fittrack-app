import { Directive, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * Todo medio (avatar, foto de post, story) se sirve por GET /media/:id con el
 * JWT en el header Authorization — un <img src="..."> normal no puede mandar
 * ese header. Esta directiva pide el archivo vía HttpClient (el interceptor ya
 * le adjunta el token) como blob y lo pone como object URL. Nunca se pone el
 * JWT en la URL. Uso: <img [secureSrc]="mediaId" [thumb]="true" />
 */
@Directive({
  selector: 'img[secureSrc], video[secureSrc]',
  standalone: false,
})
export class SecureMediaDirective implements OnChanges, OnDestroy {
  @Input() secureSrc: number | null = null;
  @Input() thumb = false;

  private objectUrl: string | null = null;
  private sub: Subscription | null = null;

  constructor(
    private el: ElementRef<HTMLImageElement | HTMLVideoElement>,
    private http: HttpClient
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ('secureSrc' in changes || 'thumb' in changes) {
      this.load();
    }
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.revoke();
  }

  private load(): void {
    this.sub?.unsubscribe();
    this.revoke();

    if (!this.secureSrc) {
      this.el.nativeElement.removeAttribute('src');
      return;
    }

    const url = `${environment.apiUrl}/media/${this.secureSrc}${this.thumb ? '?thumb=1' : ''}`;
    this.sub = this.http.get(url, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        this.objectUrl = URL.createObjectURL(blob);
        this.el.nativeElement.src = this.objectUrl;
      },
      error: () => {
        this.el.nativeElement.removeAttribute('src');
      },
    });
  }

  private revoke(): void {
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = null;
    }
  }
}
