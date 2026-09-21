export interface GroupWorkoutParticipant {
  id: number;
  group_workout_id: number;
  user_id: number;
  status: string;
  username: string;
  name: string | null;
}

export interface GroupWorkout {
  id: number;
  creator_id: number;
  name: string;
  scheduled_date: string;
  scheduled_time: string | null;
  routine_id: number | null;
  status: 'scheduled' | 'completed' | 'cancelled';
  my_status?: string;
  participants: GroupWorkoutParticipant[];
}
