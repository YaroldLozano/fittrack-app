import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Goal } from '../models/goal.model';

@Injectable({ providedIn: 'root' })
export class GoalService {
  constructor(private http: HttpClient) {}

  list(): Observable<{ success: boolean; goals: Goal[] }> {
    return this.http.get<{ success: boolean; goals: Goal[] }>(`${environment.apiUrl}/goals`);
  }

  create(data: Partial<Goal>): Observable<{ success: boolean; goal: Goal }> {
    return this.http.post<{ success: boolean; goal: Goal }>(`${environment.apiUrl}/goals`, data);
  }

  update(id: number, data: Partial<Goal>): Observable<{ success: boolean; goal: Goal }> {
    return this.http.put<{ success: boolean; goal: Goal }>(`${environment.apiUrl}/goals/${id}`, data);
  }
}
