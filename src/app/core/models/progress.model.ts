export interface GeneralProgress {
  workouts_this_week: number;
  workouts_this_month: number;
  total_workouts_completed: number;
  total_time_trained_seconds: number;
  total_sets: number;
  total_reps: number;
  total_volume: number;
}

export interface ExerciseEvolutionPoint {
  date: string;
  max_weight: number;
  max_reps: number;
}

export interface ExerciseProgress {
  exercise_id: number;
  max_weight: number | null;
  max_reps: number | null;
  total_volume: number;
  total_sets: number;
  best_set: {
    weight: number;
    reps: number;
    completed_at: string;
  } | null;
  evolution: ExerciseEvolutionPoint[];
}
