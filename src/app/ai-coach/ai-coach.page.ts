import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AiService } from '../core/services/ai.service';
import { WorkoutService } from '../core/services/workout.service';
import { AiWorkoutSuggestion } from '../core/models/ai.model';
import { withCd } from '../core/utils/with-cd';

@Component({
  selector: 'app-ai-coach',
  templateUrl: 'ai-coach.page.html',
  styleUrls: ['ai-coach.page.scss'],
  standalone: false,
})
export class AiCoachPage implements OnInit {
  readonly quickPrompts = [
    'Tengo solo 20 minutos hoy',
    'No tengo pesas, solo peso corporal',
    'Quiero enfocarme en piernas',
    'Tengo molestia en el hombro, evita presses',
    'Algo intenso para quemar calorías',
  ];

  prompt = '';
  isAsking = false;
  isApplying = false;
  errorMessage = '';
  suggestion: AiWorkoutSuggestion | null = null;

  private todayExercisesContext: unknown[] = [];

  constructor(
    private aiService: AiService,
    private workoutService: WorkoutService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const today = new Date().toISOString().slice(0, 10);
    this.workoutService.list(today, today).subscribe(
      withCd(this.cdr, (res) => {
        const active = res.workouts.find((w) => w.status !== 'completed');
        this.todayExercisesContext = (active?.exercises ?? []).map((e) => ({
          exercise_id: e.exercise_id,
          exercise_name: e.exercise_name,
          sets: e.planned_sets,
          reps: e.planned_reps,
        }));
      })
    );
  }

  useQuickPrompt(text: string): void {
    this.prompt = text;
  }

  ask(): void {
    if (!this.prompt.trim() || this.isAsking) return;

    this.isAsking = true;
    this.errorMessage = '';
    this.suggestion = null;

    this.aiService.suggestWorkout(this.prompt.trim(), this.todayExercisesContext).subscribe({
      next: withCd(this.cdr, (res) => {
        this.isAsking = false;
        this.suggestion = res.suggestion;
      }),
      error: withCd(this.cdr, (err) => {
        this.isAsking = false;
        this.errorMessage = err.error?.message || 'No se pudo generar una propuesta. Intenta de nuevo.';
      }),
    });
  }

  apply(): void {
    if (!this.suggestion || this.isApplying) return;

    this.isApplying = true;
    const today = new Date().toISOString().slice(0, 10);

    this.workoutService
      .create({
        name: this.suggestion.name,
        scheduled_date: today,
        exercises: this.suggestion.exercises.map((e) => ({
          exercise_id: e.exercise_id,
          sets: e.sets,
          reps: e.reps,
          target_weight: e.target_weight,
          rest_seconds: e.rest_seconds,
        })),
      })
      .subscribe({
        next: withCd(this.cdr, (res) => {
          this.isApplying = false;
          this.router.navigate(['/app/workout'], { queryParams: { id: res.workout.id } });
        }),
        error: withCd(this.cdr, (err) => {
          this.isApplying = false;
          this.errorMessage = err.error?.message || 'No se pudo crear el entrenamiento.';
        }),
      });
  }

  discard(): void {
    this.suggestion = null;
  }
}
