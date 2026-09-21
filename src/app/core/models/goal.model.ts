export type GoalType = 'exercise_weight' | 'workout_frequency' | 'body_weight' | 'routine_completion' | 'custom';
export type GoalStatus = 'in_progress' | 'completed';

export interface Goal {
  id: number;
  user_id: number;
  title: string;
  type: GoalType;
  exercise_id: number | null;
  target_value: number | null;
  current_value: number;
  unit: string | null;
  start_date: string;
  target_date: string | null;
  status: GoalStatus;
  completed_at: string | null;
  progress_percent: number;
}
