import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { WorkoutService } from '../core/services/workout.service';
import { WorkoutSession } from '../core/models/workout.model';
import { withCd } from '../core/utils/with-cd';

@Component({
  selector: 'app-history',
  templateUrl: 'history.page.html',
  styleUrls: ['history.page.scss'],
  standalone: false,
})
export class HistoryPage implements OnInit {
  completedWorkouts: WorkoutSession[] = [];
  selected: WorkoutSession | null = null;

  constructor(private workoutService: WorkoutService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.workoutService.list().subscribe(
      withCd(this.cdr, (res) => {
        this.completedWorkouts = res.workouts
          .filter((w) => w.status === 'completed')
          .sort((a, b) => b.scheduled_date.localeCompare(a.scheduled_date));
      })
    );
  }

  open(workout: WorkoutSession): void {
    this.workoutService.get(workout.id).subscribe(withCd(this.cdr, (res) => (this.selected = res.workout)));
  }

  close(): void {
    this.selected = null;
  }

  totalSets(workout: WorkoutSession): number {
    return workout.set_count ?? workout.exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
  }

  formatDuration(seconds: number | null): string {
    if (!seconds) return '—';
    return `${Math.round(seconds / 60)} min`;
  }
}
