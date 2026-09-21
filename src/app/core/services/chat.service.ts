import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Conversation, Message } from '../models/chat.model';

@Injectable({ providedIn: 'root' })
export class ChatService {
  constructor(private http: HttpClient) {}

  getConversations(): Observable<{ success: boolean; conversations: Conversation[] }> {
    return this.http.get<{ success: boolean; conversations: Conversation[] }>(
      `${environment.apiUrl}/messages/conversations`
    );
  }

  createConversation(friendId: number): Observable<{ success: boolean; conversation: Conversation }> {
    return this.http.post<{ success: boolean; conversation: Conversation }>(
      `${environment.apiUrl}/messages/conversations`,
      { friend_id: friendId }
    );
  }

  getMessages(
    conversationId: number,
    before?: number,
    limit = 50
  ): Observable<{ success: boolean; conversation: Conversation; messages: Message[]; has_more: boolean }> {
    let url = `${environment.apiUrl}/messages/conversations/${conversationId}?limit=${limit}`;
    if (before) {
      url += `&before=${before}`;
    }
    return this.http.get<{ success: boolean; conversation: Conversation; messages: Message[]; has_more: boolean }>(url);
  }

  sendMessage(conversationId: number, message: string): Observable<{ success: boolean; message_data: Message }> {
    return this.http.post<{ success: boolean; message_data: Message }>(
      `${environment.apiUrl}/messages/conversations/${conversationId}/messages`,
      { message }
    );
  }

  markRead(conversationId: number): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(`${environment.apiUrl}/messages/conversations/${conversationId}/read`, {});
  }

  deleteMessage(messageId: number): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${environment.apiUrl}/messages/${messageId}`);
  }
}
