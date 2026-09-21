export type AchievementCategory = 'fuerza' | 'constancia' | 'social' | 'competencia' | 'progreso';
export type AchievementRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface Achievement {
  id: number;
  code: string;
  category: AchievementCategory;
  name: string;
  description: string;
  icon: string;
  rarity: AchievementRarity;
  requirement_type: string;
  requirement_value: number;
  current_value?: number | null;
  unlocked: boolean;
  unlocked_at?: string;
}

export interface MyAchievements {
  unlocked: Achievement[];
  locked: Achievement[];
}
