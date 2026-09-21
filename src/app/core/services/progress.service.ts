import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ExerciseProgress, GeneralProgress } from '../models/progress.model';

@Injectable({ providedIn: 'root' })
export class ProgressService {
  constructor(private http: HttpClient) {}

  general(): Observable<{ success: boolean; progress: GeneralProgress }> {
    return this.http.get<{ success: boolean; progress: GeneralProgress }>(`${environment.apiUrl}/progress`);
  }

  forExercise(exerciseId: number): Observable<{ success: boolean; progress: ExerciseProgress }> {
    return this.http.get<{ success: boolean; progress: ExerciseProgress }>(
      `${environment.apiUrl}/progress/exercise/${exerciseId}`
    );
  }
}
