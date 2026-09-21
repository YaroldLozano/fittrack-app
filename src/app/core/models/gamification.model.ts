export interface MyGamification {
  level: number;
  level_name: string;
  badge: string;
  xp_total: number;
  xp_to_next_level: number | null;
  next_level_name: string | null;
  current_streak_days: number;
  longest_streak_days: number;
  rank_by_xp: number;
}

export interface RankedEntry {
  id: number;
  username: string;
  name: string | null;
  bio?: string | null;
  avatar_media_id?: number | null;
  level: number;
  level_name: string;
  badge: string;
  xp_total: number;
  current_streak_days: number;
  rank?: number;
  rank_change?: number | null;
  ranking_score?: number;
  is_me: boolean;
}

export interface GlobalRanking {
  mode: string;
  page: number;
  limit: number;
  total: number;
  entries: RankedEntry[];
}

export interface FriendsRanking {
  entries: RankedEntry[];
}

export interface PeriodRankingEntry {
  id: number;
  username: string;
  name: string | null;
  rank: number;
  xp_period: number;
  is_me: boolean;
}

export interface WeeklyRanking {
  period_start: string;
  period_end: string;
  seconds_remaining: number;
  entries: PeriodRankingEntry[];
}

export interface SeasonRanking {
  season: { id: number; name: string; starts_at: string; ends_at: string };
  entries: PeriodRankingEntry[];
}

export interface ExerciseRankingEntry {
  id: number;
  username: string;
  name: string | null;
  best_weight: number | null;
  reps_at_best: number | null;
  is_me: boolean;
}

export interface ExerciseRanking {
  exercise_id: number;
  scope: string;
  entries: ExerciseRankingEntry[];
}
