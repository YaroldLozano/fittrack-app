import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { ProgressService } from '../core/services/progress.service';
import { ExerciseService } from '../core/services/exercise.service';
import { GeneralProgress, ExerciseProgress } from '../core/models/progress.model';
import { Exercise } from '../core/models/exercise.model';
import { withCd } from '../core/utils/with-cd';

@Component({
  selector: 'app-progress',
  templateUrl: 'progress.page.html',
  styleUrls: ['progress.page.scss'],
  standalone: false,
})
export class ProgressPage implements OnInit {
  general: GeneralProgress | null = null;
  exercises: Exercise[] = [];
  selectedExerciseId: number | null = null;
  exerciseProgress: ExerciseProgress | null = null;

  chartData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };
  chartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { ticks: { color: 'rgba(255,255,255,0.6)' }, grid: { color: 'rgba(255,255,255,0.05)' } },
      y: { ticks: { color: 'rgba(255,255,255,0.6)' }, grid: { color: 'rgba(255,255,255,0.05)' } },
    },
    plugins: {
      legend: { labels: { color: 'rgba(255,255,255,0.8)' } },
    },
  };

  constructor(
    private progressService: ProgressService,
    private exerciseService: ExerciseService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.progressService.general().subscribe({
      next: withCd(this.cdr, (res) => (this.general = res.progress)),
      error: withCd(this.cdr, (err) => console.error(err)),
    });
    this.exerciseService.list().subscribe({
      next: withCd(this.cdr, (res) => (this.exercises = res.exercises)),
      error: withCd(this.cdr, (err) => console.error(err)),
    });
  }

  onSelectExercise(): void {
    if (!this.selectedExerciseId) {
      this.exerciseProgress = null;
      return;
    }

    this.progressService.forExercise(this.selectedExerciseId).subscribe({
      next: withCd(this.cdr, (res) => {
        this.exerciseProgress = res.progress;
        this.chartData = {
          labels: res.progress.evolution.map((p) => p.date),
          datasets: [
            {
              label: 'Peso máximo (kg)',
              data: res.progress.evolution.map((p) => Number(p.max_weight)),
              borderColor: '#F94144',
              backgroundColor: 'rgba(249, 65, 68, 0.15)',
              tension: 0.3,
              fill: true,
            },
          ],
        };
      }),
      error: withCd(this.cdr, (err) => console.error(err)),
    });
  }
}
