import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BodyMetric } from '../models/body-metric.model';

@Injectable({ providedIn: 'root' })
export class BodyMetricService {
  constructor(private http: HttpClient) {}

  list(): Observable<{ success: boolean; body_metrics: BodyMetric[] }> {
    return this.http.get<{ success: boolean; body_metrics: BodyMetric[] }>(`${environment.apiUrl}/body-metrics`);
  }

  upsert(data: Partial<BodyMetric>): Observable<{ success: boolean; body_metric: BodyMetric }> {
    return this.http.post<{ success: boolean; body_metric: BodyMetric }>(`${environment.apiUrl}/body-metrics`, data);
  }
}
