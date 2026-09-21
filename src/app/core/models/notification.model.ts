export type NotificationType = 'post_like' | 'post_comment' | 'friend_request';

export interface AppNotification {
  id: number;
  type: NotificationType;
  actor: {
    id: number;
    username: string;
    avatar_media_id: number | null;
  };
  subject_type: string;
  subject_id: number;
  is_read: boolean;
  created_at: string;
}
