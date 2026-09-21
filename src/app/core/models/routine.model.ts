export type RoutineStatus = 'active' | 'paused' | 'completed';

export interface RoutineExercise {
  id?: number;
  routine_day_id?: number;
  exercise_id: number;
  exercise_name?: string;
  sets: number;
  reps: number;
  target_weight: number | null;
  rest_seconds: number | null;
  order_index?: number;
  notes: string | null;
}

export interface RoutineDay {
  id?: number;
  routine_id?: number;
  day_of_week: number; // 0=Lunes ... 6=Domingo
  label: string | null;
  is_rest_day: boolean;
  order_index?: number;
  exercises: RoutineExercise[];
}

export interface Routine {
  id: number;
  user_id: number;
  name: string;
  description: string | null;
  goal: string | null;
  start_date: string | null;
  end_date: string | null;
  status: RoutineStatus;
  created_at: string;
  updated_at: string;
  days: RoutineDay[];
}
