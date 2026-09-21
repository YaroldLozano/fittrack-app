import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Post, PostComment, PostType, PostVisibility } from '../models/post.model';

export interface CreatePostPayload {
  caption?: string | null;
  post_type?: PostType;
  visibility?: PostVisibility;
  media_ids?: number[];
  context?: Record<string, unknown> | null;
}

@Injectable({ providedIn: 'root' })
export class PostService {
  constructor(private http: HttpClient) {}

  feed(before?: number, limit = 20): Observable<{ success: boolean; posts: Post[]; has_more: boolean }> {
    let url = `${environment.apiUrl}/social/feed?limit=${limit}`;
    if (before) {
      url += `&before=${before}`;
    }
    return this.http.get<{ success: boolean; posts: Post[]; has_more: boolean }>(url);
  }

  forUser(
    userId: number,
    before?: number,
    limit = 20
  ): Observable<{ success: boolean; posts: Post[]; has_more: boolean }> {
    let url = `${environment.apiUrl}/users/${userId}/posts?limit=${limit}`;
    if (before) {
      url += `&before=${before}`;
    }
    return this.http.get<{ success: boolean; posts: Post[]; has_more: boolean }>(url);
  }

  create(payload: CreatePostPayload): Observable<{ success: boolean; post: Post }> {
    return this.http.post<{ success: boolean; post: Post }>(`${environment.apiUrl}/posts`, payload);
  }

  get(id: number): Observable<{ success: boolean; post: Post }> {
    return this.http.get<{ success: boolean; post: Post }>(`${environment.apiUrl}/posts/${id}`);
  }

  update(id: number, fields: { caption?: string; visibility?: PostVisibility }): Observable<{ success: boolean; post: Post }> {
    return this.http.patch<{ success: boolean; post: Post }>(`${environment.apiUrl}/posts/${id}`, fields);
  }

  delete(id: number): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${environment.apiUrl}/posts/${id}`);
  }

  like(id: number): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(`${environment.apiUrl}/posts/${id}/like`, {});
  }

  unlike(id: number): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${environment.apiUrl}/posts/${id}/like`);
  }

  comments(id: number): Observable<{ success: boolean; comments: PostComment[] }> {
    return this.http.get<{ success: boolean; comments: PostComment[] }>(`${environment.apiUrl}/posts/${id}/comments`);
  }

  addComment(id: number, comment: string): Observable<{ success: boolean; comment: PostComment }> {
    return this.http.post<{ success: boolean; comment: PostComment }>(`${environment.apiUrl}/posts/${id}/comments`, {
      comment,
    });
  }

  deleteComment(commentId: number): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${environment.apiUrl}/comments/${commentId}`);
  }
}
