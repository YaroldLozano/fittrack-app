import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { GroupWorkout } from '../models/group-workout.model';

@Injectable({ providedIn: 'root' })
export class GroupWorkoutService {
  constructor(private http: HttpClient) {}

  list(): Observable<{ success: boolean; group_workouts: GroupWorkout[] }> {
    return this.http.get<{ success: boolean; group_workouts: GroupWorkout[] }>(`${environment.apiUrl}/workouts/group`);
  }

  create(data: Partial<GroupWorkout> & { participant_ids: number[] }): Observable<{ success: boolean; group_workout: GroupWorkout }> {
    return this.http.post<{ success: boolean; group_workout: GroupWorkout }>(`${environment.apiUrl}/workouts/group`, data);
  }

  respond(id: number, accept: boolean): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(`${environment.apiUrl}/workouts/group/${id}/respond`, { accept });
  }

  complete(id: number): Observable<{ success: boolean; group_workout: GroupWorkout }> {
    return this.http.post<{ success: boolean; group_workout: GroupWorkout }>(`${environment.apiUrl}/workouts/group/${id}/complete`, {});
  }
}
