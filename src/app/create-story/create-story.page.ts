import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MediaService } from '../core/services/media.service';
import { StoryService } from '../core/services/story.service';
import { withCd } from '../core/utils/with-cd';

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_VIDEO_BYTES = 30 * 1024 * 1024;

@Component({
  selector: 'app-create-story',
  templateUrl: 'create-story.page.html',
  styleUrls: ['create-story.page.scss'],
  standalone: false,
})
export class CreateStoryPage implements OnDestroy {
  caption = '';
  visibility: 'public' | 'friends' = 'friends';
  previewUrl: string | null = null;
  isVideo = false;
  mediaId: number | null = null;
  isUploading = false;
  isPublishing = false;
  error = '';
  private selectedFile: File | null = null;

  constructor(
    private mediaService: MediaService,
    private storyService: StoryService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnDestroy(): void {
    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) {
      return;
    }

    const video = file.type.startsWith('video/');
    const maxSize = video ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
    if (file.size > maxSize) {
      this.error = video ? 'El video supera el tamaño máximo (30MB)' : 'La imagen supera el tamaño máximo (10MB)';
      return;
    }

    this.error = '';
    this.selectedFile = file;
    this.isVideo = video;
    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl);
    }
    this.previewUrl = URL.createObjectURL(file);
    this.mediaId = null;
    this.isUploading = true;

    this.mediaService.upload(file).subscribe({
      next: withCd(this.cdr, (res) => {
        this.isUploading = false;
        this.mediaId = res.media.id;
      }),
      error: withCd(this.cdr, () => {
        this.isUploading = false;
        this.error = 'No pudimos subir el archivo.';
      }),
    });
  }

  get canPublish(): boolean {
    return !this.isUploading && !this.isPublishing && this.mediaId !== null;
  }

  publish(): void {
    if (!this.canPublish || this.mediaId === null) {
      return;
    }
    this.isPublishing = true;
    this.storyService.create(this.mediaId, this.caption.trim() || null, this.visibility).subscribe({
      next: withCd(this.cdr, () => {
        this.isPublishing = false;
        this.router.navigateByUrl('/app/feed');
      }),
      error: withCd(this.cdr, (err) => {
        this.isPublishing = false;
        this.error = err.error?.message || 'No se pudo publicar la historia';
      }),
    });
  }

  cancel(): void {
    this.router.navigateByUrl('/app/feed');
  }
}
