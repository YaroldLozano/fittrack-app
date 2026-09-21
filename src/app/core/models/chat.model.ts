export interface ChatFriend {
  id: number;
  username: string;
  name: string | null;
  avatar_media_id: number | null;
  level: number;
  level_name: string;
  badge: string;
}

export interface ConversationLastMessage {
  id: number;
  message: string;
  sender_id: number;
  created_at: string;
}

export interface Conversation {
  id: number;
  friend: ChatFriend;
  last_message: ConversationLastMessage | null;
  unread_count: number;
  updated_at: string;
  blocked: boolean;
}

export interface Message {
  id: number;
  conversation_id: number;
  sender_id: number;
  message: string;
  created_at: string;
  read_at: string | null;
}
