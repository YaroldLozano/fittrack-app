import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MyAchievements } from '../models/achievement.model';

@Injectable({ providedIn: 'root' })
export class AchievementService {
  constructor(private http: HttpClient) {}

  me(): Observable<{ success: boolean } & MyAchievements> {
    return this.http.get<{ success: boolean } & MyAchievements>(`${environment.apiUrl}/achievements/me`);
  }
}
