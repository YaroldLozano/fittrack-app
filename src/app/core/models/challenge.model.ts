export type ChallengeType = 'strength' | 'volume' | 'progress' | 'consistency' | 'streak';
export type ChallengeStatus = 'pending' | 'active' | 'completed' | 'cancelled' | 'expired';

export interface ChallengeParticipant {
  id: number;
  challenge_id: number;
  user_id: number;
  status: string;
  progress_value: number;
  username: string;
  name: string | null;
}

export interface Challenge {
  id: number;
  creator_id: number;
  type: ChallengeType;
  title: string;
  exercise_id: number | null;
  starts_at: string;
  ends_at: string;
  status: ChallengeStatus;
  winner_user_id: number | null;
  my_status?: string;
  my_progress?: number;
  participants: ChallengeParticipant[];
}
