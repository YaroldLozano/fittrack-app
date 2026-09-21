import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AiWorkoutSuggestion } from '../models/ai.model';

interface SuggestWorkoutResponse {
  success: boolean;
  suggestion: AiWorkoutSuggestion;
}

@Injectable({ providedIn: 'root' })
export class AiService {
  constructor(private http: HttpClient) {}

  suggestWorkout(prompt: string, currentExercises: unknown[] = []): Observable<SuggestWorkoutResponse> {
    return this.http.post<SuggestWorkoutResponse>(`${environment.apiUrl}/ai/suggest-workout`, {
      prompt,
      current_exercises: currentExercises,
    });
  }
}
