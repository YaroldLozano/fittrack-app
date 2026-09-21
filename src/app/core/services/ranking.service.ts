import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ExerciseRanking,
  FriendsRanking,
  GlobalRanking,
  MyGamification,
  SeasonRanking,
  WeeklyRanking,
} from '../models/gamification.model';

@Injectable({ providedIn: 'root' })
export class RankingService {
  constructor(private http: HttpClient) {}

  me(): Observable<{ success: boolean; me: MyGamification }> {
    return this.http.get<{ success: boolean; me: MyGamification }>(`${environment.apiUrl}/ranking/me`);
  }

  global(mode: 'page' | 'nearby', page: number): Observable<{ success: boolean; ranking: GlobalRanking }> {
    return this.http.get<{ success: boolean; ranking: GlobalRanking }>(
      `${environment.apiUrl}/ranking/global?mode=${mode}&page=${page}&limit=20`
    );
  }

  friends(): Observable<{ success: boolean; ranking: FriendsRanking }> {
    return this.http.get<{ success: boolean; ranking: FriendsRanking }>(`${environment.apiUrl}/ranking/friends`);
  }

  weekly(scope: 'global' | 'friends'): Observable<{ success: boolean; ranking: WeeklyRanking }> {
    return this.http.get<{ success: boolean; ranking: WeeklyRanking }>(`${environment.apiUrl}/ranking/weekly?scope=${scope}`);
  }

  season(scope: 'global' | 'friends'): Observable<{ success: boolean; ranking: SeasonRanking }> {
    return this.http.get<{ success: boolean; ranking: SeasonRanking }>(`${environment.apiUrl}/ranking/season?scope=${scope}`);
  }

  byExercise(exerciseId: number, scope: 'global' | 'friends'): Observable<{ success: boolean; ranking: ExerciseRanking }> {
    return this.http.get<{ success: boolean; ranking: ExerciseRanking }>(
      `${environment.apiUrl}/ranking/exercise/${exerciseId}?scope=${scope}`
    );
  }
}
