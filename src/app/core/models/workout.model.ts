export type WorkoutStatus = 'scheduled' | 'in_progress' | 'completed' | 'skipped';

export interface WorkoutSet {
  id: number;
  session_exercise_id: number;
  user_id: number;
  exercise_id: number;
  set_number: number;
  reps: number;
  weight: number;
  rest_seconds: number | null;
  completed_at: string;
  is_personal_record: number;
  previous_best_weight: number | null;
}

export interface WorkoutSessionExercise {
  id: number;
  session_id: number;
  exercise_id: number;
  exercise_name: string;
  muscle_group_id: number;
  order_index: number;
  notes: string | null;
  planned_sets: number | null;
  planned_reps: number | null;
  planned_weight: number | null;
  planned_rest_seconds: number | null;
  sets: WorkoutSet[];
}

export interface WorkoutSession {
  id: number;
  user_id: number;
  routine_id: number | null;
  routine_day_id: number | null;
  name: string;
  scheduled_date: string;
  status: WorkoutStatus;
  started_at: string | null;
  completed_at: string | null;
  duration_seconds: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  exercises: WorkoutSessionExercise[];
  exercise_count?: number;
  set_count?: number;
}
