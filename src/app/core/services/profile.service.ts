import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ProfileUser {
  id: number;
  username: string;
  email: string | null;
  name: string | null;
  bio: string | null;
  avatar_media_id: number | null;
}

@Injectable({ providedIn: 'root' })
export class ProfileService {
  constructor(private http: HttpClient) {}

  update(fields: { name?: string; bio?: string }): Observable<{ success: boolean; user: ProfileUser }> {
    return this.http.patch<{ success: boolean; user: ProfileUser }>(`${environment.apiUrl}/users/profile`, fields);
  }

  setAvatar(mediaId: number): Observable<{ success: boolean; user: ProfileUser }> {
    return this.http.post<{ success: boolean; user: ProfileUser }>(`${environment.apiUrl}/users/profile/avatar`, {
      media_id: mediaId,
    });
  }

  removeAvatar(): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${environment.apiUrl}/users/profile/avatar`);
  }
}
