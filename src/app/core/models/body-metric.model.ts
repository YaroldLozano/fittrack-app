export interface BodyMetric {
  id: number;
  user_id: number;
  recorded_date: string;
  weight: number | null;
  height: number | null;
  body_fat_percentage: number | null;
  chest: number | null;
  waist: number | null;
  arm: number | null;
  leg: number | null;
  hip: number | null;
  created_at: string;
}
