export interface MuscleGroup {
  id: number;
  name: string;
}

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface Exercise {
  id: number;
  user_id: number | null;
  muscle_group_id: number;
  muscle_group_name?: string;
  name: string;
  description: string | null;
  instructions: string | null;
  image_url: string | null;
  video_url: string | null;
  equipment: string | null;
  difficulty_level: DifficultyLevel | null;
  is_active: number;
  created_at: string;
  updated_at: string;
}
