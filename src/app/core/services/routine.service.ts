import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Routine } from '../models/routine.model';

interface RoutinesResponse {
  success: boolean;
  routines: Routine[];
}

interface RoutineResponse {
  success: boolean;
  routine: Routine;
}

@Injectable({ providedIn: 'root' })
export class RoutineService {
  constructor(private http: HttpClient) {}

  list(): Observable<RoutinesResponse> {
    return this.http.get<RoutinesResponse>(`${environment.apiUrl}/routines`);
  }

  get(id: number): Observable<RoutineResponse> {
    return this.http.get<RoutineResponse>(`${environment.apiUrl}/routines/${id}`);
  }

  create(data: Partial<Routine>): Observable<RoutineResponse> {
    return this.http.post<RoutineResponse>(`${environment.apiUrl}/routines`, data);
  }

  update(id: number, data: Partial<Routine>): Observable<RoutineResponse> {
    return this.http.put<RoutineResponse>(`${environment.apiUrl}/routines/${id}`, data);
  }

  updateStatus(id: number, status: string): Observable<RoutineResponse> {
    return this.http.put<RoutineResponse>(`${environment.apiUrl}/routines/${id}/status`, { status });
  }

  duplicate(id: number): Observable<RoutineResponse> {
    return this.http.post<RoutineResponse>(`${environment.apiUrl}/routines/${id}/duplicate`, {});
  }

  delete(id: number): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${environment.apiUrl}/routines/${id}`);
  }
}
