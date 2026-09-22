export interface ExternalExerciseCategory {
  id: number;
  name: string;
}

export interface ExternalExercise {
  external_id: number;
  name: string;
  description: string;
  category: string | null;
  muscles: string[];
  equipment: string[];
  image_url: string | null;
}
