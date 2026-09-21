export interface PostAuthor {
  id: number;
  username: string;
  name: string | null;
  bio: string | null;
  avatar_media_id: number | null;
  level: number;
  level_name: string;
  badge: string;
}

export interface PostMediaItem {
  id: number;
  type: 'image' | 'video';
  mime_type: string;
  width: number | null;
  height: number | null;
}

export type PostVisibility = 'public' | 'friends' | 'private';
export type PostType = 'text' | 'workout' | 'pr';

export interface Post {
  id: number;
  author: PostAuthor;
  caption: string | null;
  post_type: PostType;
  context: Record<string, unknown> | null;
  visibility: PostVisibility;
  media: PostMediaItem[];
  like_count: number;
  comment_count: number;
  liked_by_me: boolean;
  created_at: string;
  updated_at: string;
}

export interface PostComment {
  id: number;
  post_id: number;
  user_id: number;
  username: string;
  avatar_media_id: number | null;
  comment: string;
  created_at: string;
}
