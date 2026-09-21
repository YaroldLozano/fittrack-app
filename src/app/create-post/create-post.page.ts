import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MediaService } from '../core/services/media.service';
import { PostService } from '../core/services/post.service';
import { PostVisibility } from '../core/models/post.model';
import { withCd } from '../core/utils/with-cd';

interface PendingMedia {
  previewUrl: string;
  mediaId: number | null;
  isUploading: boolean;
  failed: boolean;
  file: File;
}

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_VIDEO_BYTES = 30 * 1024 * 1024;
const MAX_ITEMS = 6;

@Component({
  selector: 'app-create-post',
  templateUrl: 'create-post.page.html',
  styleUrls: ['create-post.page.scss'],
  standalone: false,
})
export class CreatePostPage implements OnDestroy {
  caption = '';
  visibility: PostVisibility = 'friends';
  items: PendingMedia[] = [];
  isPublishing = false;
  error = '';

  constructor(private mediaService: MediaService, private postService: PostService, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnDestroy(): void {
    this.items.forEach((i) => URL.revokeObjectURL(i.previewUrl));
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    input.value = '';

    for (const file of files) {
      if (this.items.length >= MAX_ITEMS) {
        break;
      }
      const isVideo = file.type.startsWith('video/');
      const maxSize = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
      if (file.size > maxSize) {
        this.error = isVideo ? 'El video supera el tamaño máximo (30MB)' : 'La imagen supera el tamaño máximo (10MB)';
        continue;
      }

      const item: PendingMedia = {
        previewUrl: URL.createObjectURL(file),
        mediaId: null,
        isUploading: true,
        failed: false,
        file,
      };
      this.items.push(item);
      this.upload(item);
    }
  }

  private upload(item: PendingMedia): void {
    this.mediaService.upload(item.file).subscribe({
      next: withCd(this.cdr, (res) => {
        item.isUploading = false;
        item.mediaId = res.media.id;
      }),
      error: withCd(this.cdr, () => {
        item.isUploading = false;
        item.failed = true;
      }),
    });
  }

  removeItem(item: PendingMedia): void {
    URL.revokeObjectURL(item.previewUrl);
    this.items = this.items.filter((i) => i !== item);
  }

  get canPublish(): boolean {
    if (this.isPublishing) {
      return false;
    }
    const hasUploading = this.items.some((i) => i.isUploading);
    const hasCaption = this.caption.trim().length > 0;
    const hasMedia = this.items.some((i) => i.mediaId !== null);
    return !hasUploading && (hasCaption || hasMedia);
  }

  publish(): void {
    if (!this.canPublish) {
      return;
    }
    this.isPublishing = true;
    this.error = '';

    const mediaIds = this.items.filter((i) => i.mediaId !== null).map((i) => i.mediaId!) as number[];

    this.postService
      .create({
        caption: this.caption.trim() || null,
        visibility: this.visibility,
        media_ids: mediaIds,
      })
      .subscribe({
        next: withCd(this.cdr, () => {
          this.isPublishing = false;
          this.router.navigateByUrl('/app/feed');
        }),
        error: withCd(this.cdr, (err) => {
          this.isPublishing = false;
          this.error = err.error?.message || 'No se pudo publicar';
        }),
      });
  }

  cancel(): void {
    this.router.navigateByUrl('/app/feed');
  }
}
