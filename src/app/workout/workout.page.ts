import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkoutService } from '../core/services/workout.service';
import { ExerciseService } from '../core/services/exercise.service';
import { WorkoutSession } from '../core/models/workout.model';
import { Exercise } from '../core/models/exercise.model';
import { withCd } from '../core/utils/with-cd';

@Component({
  selector: 'app-workout',
  templateUrl: 'workout.page.html',
  styleUrls: ['workout.page.scss'],
  standalone: false,
})
export class WorkoutPage implements OnInit {
  todaysWorkouts: WorkoutSession[] = [];
  exercises: Exercise[] = [];
  session: WorkoutSession | null = null;

  newExerciseId: number | null = null;
  setDrafts: Record<number, { reps: number; weight: number }> = {};
  /** Exercises added to the session locally but with no logged set yet (no backend row until the first set is logged). */
  pendingExerciseIds: number[] = [];

  isLoading = true;
  isCreating = false;

  constructor(
    private workoutService: WorkoutService,
    private exerciseService: ExerciseService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.exerciseService.list().subscribe(withCd(this.cdr, (res) => (this.exercises = res.exercises)));

    const id = this.route.snapshot.queryParamMap.get('id');
    if (id) {
      this.loadSession(Number(id));
    } else {
      this.loadTodaysWorkouts();
    }
  }

  private loadTodaysWorkouts(): void {
    const today = new Date().toISOString().slice(0, 10);
    this.workoutService.list(today, today).subscribe(
      withCd(this.cdr, (res) => {
        this.isLoading = false;
        this.todaysWorkouts = res.workouts.filter((w) => w.status !== 'completed');
      })
    );
  }

  loadSession(id: number): void {
    this.isLoading = true;
    this.workoutService.get(id).subscribe(
      withCd(this.cdr, (res) => {
        this.isLoading = false;
        this.session = res.workout;
      })
    );
  }

  openSession(session: WorkoutSession): void {
    this.router.navigate(['/app/workout'], { queryParams: { id: session.id } });
    this.loadSession(session.id);
  }

  createQuickWorkout(): void {
    this.isCreating = true;
    const today = new Date().toISOString().slice(0, 10);
    this.workoutService.create({ name: 'Entrenamiento libre', scheduled_date: today }).subscribe(
      withCd(this.cdr, (res) => {
        this.isCreating = false;
        this.openSession(res.workout);
      })
    );
  }

  start(): void {
    if (!this.session) return;
    this.workoutService.start(this.session.id).subscribe(withCd(this.cdr, (res) => (this.session = res.workout)));
  }

  complete(): void {
    if (!this.session) return;
    this.workoutService.complete(this.session.id).subscribe(
      withCd(this.cdr, (res) => {
        this.session = res.workout;
      })
    );
  }

  backToList(): void {
    this.session = null;
    this.router.navigate(['/app/workout']);
    this.loadTodaysWorkouts();
  }

  addExerciseToSession(): void {
    if (!this.session || !this.newExerciseId) return;
    this.pendingExerciseIds.push(this.newExerciseId);
    this.newExerciseId = null;
  }

  draftFor(exerciseId: number): { reps: number; weight: number } {
    if (!this.setDrafts[exerciseId]) {
      this.setDrafts[exerciseId] = { reps: 10, weight: 0 };
    }
    return this.setDrafts[exerciseId];
  }

  logSet(exerciseId: number): void {
    if (!this.session) return;
    const draft = this.draftFor(exerciseId);

    this.workoutService
      .addSet(this.session.id, { exercise_id: exerciseId, reps: draft.reps, weight: draft.weight })
      .subscribe(
        withCd(this.cdr, (res) => {
          this.session = res.workout;
          this.pendingExerciseIds = this.pendingExerciseIds.filter((id) => id !== exerciseId);
        })
      );
  }

  pendingExercises(): Exercise[] {
    return this.pendingExerciseIds
      .map((id) => this.exercises.find((e) => e.id === id))
      .filter((e): e is Exercise => e !== undefined);
  }

  availableExercises(): Exercise[] {
    if (!this.session) return this.exercises;
    const usedIds = new Set([...this.session.exercises.map((e) => e.exercise_id), ...this.pendingExerciseIds]);
    return this.exercises.filter((e) => !usedIds.has(e.id));
  }

  formatDuration(seconds: number | null): string {
    if (!seconds) return '';
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  }
}
