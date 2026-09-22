import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Exercise, MuscleGroup } from '../models/exercise.model';
import { ExternalExercise, ExternalExerciseCategory } from '../models/external-exercise.model';

interface ExercisesResponse {
  success: boolean;
  exercises: Exercise[];
}

interface ExerciseResponse {
  success: boolean;
  exercise: Exercise;
}

interface MuscleGroupsResponse {
  success: boolean;
  muscle_groups: MuscleGroup[];
}

@Injectable({ providedIn: 'root' })
export class ExerciseService {
  constructor(private http: HttpClient) {}

  getMuscleGroups(): Observable<MuscleGroupsResponse> {
    return this.http.get<MuscleGroupsResponse>(`${environment.apiUrl}/muscle-groups`);
  }

  list(muscleGroupId?: number): Observable<ExercisesResponse> {
    const params: Record<string, string> = {};
    if (muscleGroupId !== undefined) {
      params['muscle_group_id'] = String(muscleGroupId);
    }
    return this.http.get<ExercisesResponse>(`${environment.apiUrl}/exercises`, { params });
  }

  create(data: Partial<Exercise>): Observable<ExerciseResponse> {
    return this.http.post<ExerciseResponse>(`${environment.apiUrl}/exercises`, data);
  }

  update(id: number, data: Partial<Exercise>): Observable<ExerciseResponse> {
    return this.http.put<ExerciseResponse>(`${environment.apiUrl}/exercises/${id}`, data);
  }

  delete(id: number): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${environment.apiUrl}/exercises/${id}`);
  }

  /** Catálogo externo (wger.de) para explorar e importar ejercicios que no están en el propio. */
  externalCategories(): Observable<{ success: boolean; categories: ExternalExerciseCategory[] }> {
    return this.http.get<{ success: boolean; categories: ExternalExerciseCategory[] }>(
      `${environment.apiUrl}/exercises/external/categories`
    );
  }

  searchExternal(query: {
    category?: number;
    search?: string;
    page?: number;
  }): Observable<{ success: boolean; exercises: ExternalExercise[]; total: number; page: number }> {
    const params: Record<string, string> = {};
    if (query.category !== undefined) {
      params['category'] = String(query.category);
    }
    if (query.search) {
      params['search'] = query.search;
    }
    if (query.page !== undefined) {
      params['page'] = String(query.page);
    }
    return this.http.get<{ success: boolean; exercises: ExternalExercise[]; total: number; page: number }>(
      `${environment.apiUrl}/exercises/external`,
      { params }
    );
  }
}
