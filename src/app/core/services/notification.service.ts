import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AppNotification } from '../models/notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private http: HttpClient) {}

  list(): Observable<{ success: boolean; notifications: AppNotification[]; unread_count: number }> {
    return this.http.get<{ success: boolean; notifications: AppNotification[]; unread_count: number }>(
      `${environment.apiUrl}/notifications`
    );
  }

  markRead(id: number): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(`${environment.apiUrl}/notifications/${id}/read`, {});
  }

  markAllRead(): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(`${environment.apiUrl}/notifications/read-all`, {});
  }
}
