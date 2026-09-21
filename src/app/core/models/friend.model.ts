export type FriendRelation = 'none' | 'pending_outgoing' | 'pending_incoming' | 'friends' | 'self';

export interface FriendSearchResult {
  id: number;
  username: string;
  name: string | null;
  bio: string | null;
  avatar_media_id: number | null;
  level: number;
  level_name: string;
  badge: string;
  xp_total: number;
  current_streak_days: number;
  relation: FriendRelation;
}

export interface Friend {
  id: number;
  username: string;
  name: string | null;
  avatar_media_id: number | null;
  level: number;
  level_name: string;
  badge: string;
  xp_total: number;
  current_streak_days: number;
  friends_since: string;
}

export interface FriendRequest {
  id: number;
  requester_id: number;
  addressee_id: number;
  status: string;
  created_at: string;
  from_id?: number;
  from_username?: string;
  from_name?: string | null;
  to_id?: number;
  to_username?: string;
  to_name?: string | null;
}

export interface PublicProfile {
  id: number;
  username: string;
  name: string | null;
  bio: string | null;
  avatar_media_id: number | null;
  level: number;
  level_name: string;
  badge: string;
  xp_total: number;
  current_streak_days: number;
  relation: FriendRelation;
  workouts_completed: number;
  personal_records: number;
  achievements_count: number;
  top_exercises: { exercise_id: number; exercise_name: string; level: number; level_name: string; badge: string }[];
}

export interface ComparisonExercise {
  exercise_id: number;
  exercise_name: string;
  viewer_weight: number;
  target_weight: number;
}

export interface Comparison {
  viewer: PublicProfile;
  target: PublicProfile;
  exercises: ComparisonExercise[];
  viewer_wins: number;
  target_wins: number;
  summary: string;
}
