import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Comparison, Friend, FriendRequest, FriendSearchResult, PublicProfile } from '../models/friend.model';

@Injectable({ providedIn: 'root' })
export class FriendService {
  constructor(private http: HttpClient) {}

  search(q: string): Observable<{ success: boolean; users: FriendSearchResult[] }> {
    return this.http.get<{ success: boolean; users: FriendSearchResult[] }>(
      `${environment.apiUrl}/users/search?q=${encodeURIComponent(q)}`
    );
  }

  list(): Observable<{ success: boolean; friends: Friend[] }> {
    return this.http.get<{ success: boolean; friends: Friend[] }>(`${environment.apiUrl}/friends`);
  }

  incoming(): Observable<{ success: boolean; requests: FriendRequest[] }> {
    return this.http.get<{ success: boolean; requests: FriendRequest[] }>(`${environment.apiUrl}/friends/incoming`);
  }

  outgoing(): Observable<{ success: boolean; requests: FriendRequest[] }> {
    return this.http.get<{ success: boolean; requests: FriendRequest[] }>(`${environment.apiUrl}/friends/outgoing`);
  }

  sendRequest(userId: number): Observable<{ success: boolean; message?: string }> {
    return this.http.post<{ success: boolean; message?: string }>(`${environment.apiUrl}/friends/request`, { user_id: userId });
  }

  accept(requestId: number): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(`${environment.apiUrl}/friends/${requestId}/accept`, {});
  }

  reject(requestId: number): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(`${environment.apiUrl}/friends/${requestId}/reject`, {});
  }

  cancel(requestId: number): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(`${environment.apiUrl}/friends/${requestId}/cancel`, {});
  }

  remove(friendId: number): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${environment.apiUrl}/friends/${friendId}`);
  }

  block(userId: number): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(`${environment.apiUrl}/users/${userId}/block`, {});
  }

  profile(userId: number): Observable<{ success: boolean; profile: PublicProfile }> {
    return this.http.get<{ success: boolean; profile: PublicProfile }>(`${environment.apiUrl}/users/${userId}/profile`);
  }

  compare(userId: number): Observable<{ success: boolean; comparison: Comparison }> {
    return this.http.get<{ success: boolean; comparison: Comparison }>(`${environment.apiUrl}/users/${userId}/compare`);
  }
}
