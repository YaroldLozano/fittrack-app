import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { RoutineService } from '../core/services/routine.service';
import { WorkoutService } from '../core/services/workout.service';
import { BodyMetricService } from '../core/services/body-metric.service';
import { ProgressService } from '../core/services/progress.service';
import { AuthService } from '../core/services/auth.service';
import { RankingService } from '../core/services/ranking.service';
import { Routine } from '../core/models/routine.model';
import { WorkoutSession } from '../core/models/workout.model';
import { BodyMetric } from '../core/models/body-metric.model';
import { GeneralProgress } from '../core/models/progress.model';
import { MyGamification } from '../core/models/gamification.model';
import { withCd } from '../core/utils/with-cd';
import { today } from '../core/utils/date.util';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.page.html',
  styleUrls: ['dashboard.page.scss'],
  standalone: false,
})
export class DashboardPage implements OnInit {
  username: string | null = null;
  isLoading = true;

  activeRoutine: Routine | null = null;
  todayWorkout: WorkoutSession | null = null;
  nextWorkout: WorkoutSession | null = null;
  recentWorkout: WorkoutSession | null = null;

  currentWeight: number | null = null;
  weightTrend: number | null = null;

  progress: GeneralProgress | null = null;
  personalRecords: { exercise_name: string; weight: number; reps: number }[] = [];
  me: MyGamification | null = null;

  constructor(
    private routineService: RoutineService,
    private workoutService: WorkoutService,
    private bodyMetricService: BodyMetricService,
    private progressService: ProgressService,
    private authService: AuthService,
    private rankingService: RankingService,
    private cdr: ChangeDetectorRef
  ) {
    this.username = this.authService.currentUserValue?.username ?? null;
  }

  ngOnInit(): void {
    forkJoin({
      routines: this.routineService.list(),
      workouts: this.workoutService.list(),
      bodyMetrics: this.bodyMetricService.list(),
      progress: this.progressService.general(),
      me: this.rankingService.me(),
    }).subscribe({
      next: withCd(this.cdr, ({ routines, workouts, bodyMetrics, progress, me }) => {
        this.isLoading = false;

        this.activeRoutine = routines.routines.find((r) => r.status === 'active') ?? null;
        this.progress = progress.progress;
        this.me = me.me;

        const sorted = [...workouts.workouts].sort((a, b) => a.scheduled_date.localeCompare(b.scheduled_date));

        this.todayWorkout =
          sorted.find((w) => w.scheduled_date === today() && w.status !== 'completed') ?? null;
        this.nextWorkout =
          sorted.find((w) => w.scheduled_date > today() && w.status === 'scheduled') ?? null;

        const completed = [...workouts.workouts]
          .filter((w) => w.status === 'completed')
          .sort((a, b) => b.scheduled_date.localeCompare(a.scheduled_date));

        if (completed.length > 0) {
          this.workoutService.get(completed[0].id).subscribe({
            next: withCd(this.cdr, (res) => {
              this.recentWorkout = res.workout;
              this.personalRecords = res.workout.exercises.flatMap((ex) =>
                ex.sets
                  .filter((s) => s.is_personal_record)
                  .map((s) => ({ exercise_name: ex.exercise_name, weight: s.weight, reps: s.reps }))
              );
            }),
            error: withCd(this.cdr, (err) => console.error(err)),
          });
        }

        const metrics = [...bodyMetrics.body_metrics].sort((a, b) =>
          b.recorded_date.localeCompare(a.recorded_date)
        );
        if (metrics.length > 0) {
          this.currentWeight = metrics[0].weight;
          if (metrics.length > 1 && metrics[0].weight !== null && metrics[1].weight !== null) {
            this.weightTrend = Math.round((metrics[0].weight - metrics[1].weight) * 10) / 10;
          }
        }
      }),
      error: withCd(this.cdr, (err) => {
        this.isLoading = false;
        console.error(err);
      }),
    });
  }
}
