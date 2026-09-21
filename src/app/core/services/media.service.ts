import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface UploadedMedia {
  id: number;
  type: 'image' | 'video';
  mime_type: string;
  width: number | null;
  height: number | null;
}

@Injectable({ providedIn: 'root' })
export class MediaService {
  constructor(private http: HttpClient) {}

  upload(file: File): Observable<{ success: boolean; media: UploadedMedia }> {
    const form = new FormData();
    form.append('file', file);
    return this.http.post<{ success: boolean; media: UploadedMedia }>(`${environment.apiUrl}/media`, form);
  }

  delete(mediaId: number): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${environment.apiUrl}/media/${mediaId}`);
  }
}
