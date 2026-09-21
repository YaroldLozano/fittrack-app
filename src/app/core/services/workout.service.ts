import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { WorkoutSession } from '../models/workout.model';

interface WorkoutsResponse {
  success: boolean;
  workouts: WorkoutSession[];
}

interface WorkoutResponse {
  success: boolean;
  workout: WorkoutSession;
}

@Injectable({ providedIn: 'root' })
export class WorkoutService {
  constructor(private http: HttpClient) {}

  list(from?: string, to?: string): Observable<WorkoutsResponse> {
    const params: Record<string, string> = {};
    if (from) params['from'] = from;
    if (to) params['to'] = to;
    return this.http.get<WorkoutsResponse>(`${environment.apiUrl}/workouts`, { params });
  }

  get(id: number): Observable<WorkoutResponse> {
    return this.http.get<WorkoutResponse>(`${environment.apiUrl}/workouts/${id}`);
  }

  create(data: {
    name: string;
    scheduled_date: string;
    routine_id?: number;
    routine_day_id?: number;
    exercises?: {
      exercise_id: number;
      sets?: number;
      reps?: number;
      target_weight?: number | null;
      rest_seconds?: number | null;
    }[];
  }): Observable<WorkoutResponse> {
    return this.http.post<WorkoutResponse>(`${environment.apiUrl}/workouts`, data);
  }

  start(id: number): Observable<WorkoutResponse> {
    return this.http.post<WorkoutResponse>(`${environment.apiUrl}/workouts/${id}/start`, {});
  }

  complete(id: number): Observable<WorkoutResponse> {
    return this.http.post<WorkoutResponse>(`${environment.apiUrl}/workouts/${id}/complete`, {});
  }

  addSet(
    id: number,
    data: { exercise_id: number; reps: number; weight: number; rest_seconds?: number }
  ): Observable<WorkoutResponse> {
    return this.http.post<WorkoutResponse>(`${environment.apiUrl}/workouts/${id}/sets`, data);
  }

  delete(id: number): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${environment.apiUrl}/workouts/${id}`);
  }
}
