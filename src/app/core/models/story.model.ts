import { PostAuthor } from './post.model';

export interface Story {
  id: number;
  media_id: number;
  media_type: 'image' | 'video' | null;
  caption: string | null;
  visibility: 'public' | 'friends';
  created_at: string;
  expires_at: string;
  viewed_by_me: boolean;
}

export interface StoryGroup {
  author: PostAuthor;
  stories: Story[];
  has_unseen: boolean;
}

export interface StoryViewer {
  id: number;
  username: string;
  avatar_media_id: number | null;
  viewed_at: string;
}
