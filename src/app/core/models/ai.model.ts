export interface AiWorkoutExercise {
  exercise_id: number;
  exercise_name: string;
  sets: number;
  reps: number;
  target_weight: number | null;
  rest_seconds: number;
}

export interface AiWorkoutSuggestion {
  name: string;
  note: string;
  exercises: AiWorkoutExercise[];
}
