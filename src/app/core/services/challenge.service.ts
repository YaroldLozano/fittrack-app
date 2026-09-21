import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Challenge } from '../models/challenge.model';

@Injectable({ providedIn: 'root' })
export class ChallengeService {
  constructor(private http: HttpClient) {}

  list(): Observable<{ success: boolean; challenges: Challenge[] }> {
    return this.http.get<{ success: boolean; challenges: Challenge[] }>(`${environment.apiUrl}/challenges`);
  }

  create(data: Partial<Challenge> & { participant_ids: number[] }): Observable<{ success: boolean; challenge: Challenge }> {
    return this.http.post<{ success: boolean; challenge: Challenge }>(`${environment.apiUrl}/challenges`, data);
  }

  accept(id: number): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(`${environment.apiUrl}/challenges/${id}/accept`, {});
  }

  decline(id: number): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(`${environment.apiUrl}/challenges/${id}/decline`, {});
  }
}
