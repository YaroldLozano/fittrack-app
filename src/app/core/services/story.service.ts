import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Story, StoryGroup, StoryViewer } from '../models/story.model';

@Injectable({ providedIn: 'root' })
export class StoryService {
  constructor(private http: HttpClient) {}

  listActive(): Observable<{ success: boolean; groups: StoryGroup[] }> {
    return this.http.get<{ success: boolean; groups: StoryGroup[] }>(`${environment.apiUrl}/stories`);
  }

  create(mediaId: number, caption: string | null, visibility: 'public' | 'friends'): Observable<{ success: boolean; story: Story }> {
    return this.http.post<{ success: boolean; story: Story }>(`${environment.apiUrl}/stories`, {
      media_id: mediaId,
      caption,
      visibility,
    });
  }

  view(id: number): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(`${environment.apiUrl}/stories/${id}/view`, {});
  }

  viewers(id: number): Observable<{ success: boolean; viewers: StoryViewer[] }> {
    return this.http.get<{ success: boolean; viewers: StoryViewer[] }>(`${environment.apiUrl}/stories/${id}/viewers`);
  }

  delete(id: number): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${environment.apiUrl}/stories/${id}`);
  }
}
