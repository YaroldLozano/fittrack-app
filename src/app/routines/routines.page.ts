import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoutineService } from '../core/services/routine.service';
import { ExerciseService } from '../core/services/exercise.service';
import { Routine, RoutineDay } from '../core/models/routine.model';
import { Exercise } from '../core/models/exercise.model';
import { withCd } from '../core/utils/with-cd';
import { ROUTINE_TEMPLATES, RoutineTemplate } from './routine-templates';

export const DAY_NAMES = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

@Component({
  selector: 'app-routines',
  templateUrl: 'routines.page.html',
  styleUrls: ['routines.page.scss'],
  standalone: false,
})
export class RoutinesPage implements OnInit {
  readonly dayNames = DAY_NAMES;
  readonly templates = ROUTINE_TEMPLATES;

  routines: Routine[] = [];
  exercises: Exercise[] = [];

  showBuilder = false;
  editingId: number | null = null;
  isSaving = false;
  formError = '';

  form: FormGroup;

  constructor(
    private routineService: RoutineService,
    private exerciseService: ExerciseService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.buildRoutineForm();
  }

  ngOnInit(): void {
    this.loadRoutines();
    this.exerciseService.list().subscribe(withCd(this.cdr, (res) => (this.exercises = res.exercises)));
  }

  get days(): FormArray {
    return this.form.get('days') as FormArray;
  }

  exercisesOf(dayIndex: number): FormArray {
    return this.days.at(dayIndex).get('exercises') as FormArray;
  }

  loadRoutines(): void {
    this.routineService.list().subscribe(withCd(this.cdr, (res) => (this.routines = res.routines)));
  }

  private buildRoutineForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      description: [''],
      goal: [''],
      start_date: [new Date().toISOString().slice(0, 10)],
      end_date: [''],
      status: ['active'],
      days: this.fb.array([]),
    });
  }

  private buildDayGroup(day: Partial<Routine['days'][0]> = {}): FormGroup {
    return this.fb.group({
      day_of_week: [day.day_of_week ?? 0, Validators.required],
      label: [day.label ?? ''],
      is_rest_day: [day.is_rest_day ?? false],
      exercises: this.fb.array((day.exercises ?? []).map((ex) => this.buildExerciseGroup(ex))),
    });
  }

  private buildExerciseGroup(ex: Partial<Routine['days'][0]['exercises'][0]> = {}): FormGroup {
    return this.fb.group({
      exercise_id: [ex.exercise_id ?? null, Validators.required],
      sets: [ex.sets ?? 4, Validators.required],
      reps: [ex.reps ?? 10, Validators.required],
      target_weight: [ex.target_weight ?? null],
      rest_seconds: [ex.rest_seconds ?? 90],
      notes: [ex.notes ?? ''],
    });
  }

  addDay(): void {
    this.days.push(this.buildDayGroup());
  }

  removeDay(index: number): void {
    this.days.removeAt(index);
  }

  addExercise(dayIndex: number): void {
    this.exercisesOf(dayIndex).push(this.buildExerciseGroup());
  }

  removeExercise(dayIndex: number, exIndex: number): void {
    this.exercisesOf(dayIndex).removeAt(exIndex);
  }

  openCreate(): void {
    this.editingId = null;
    this.form = this.buildRoutineForm();
    this.showBuilder = true;
    this.formError = '';
  }

  openEdit(routine: Routine): void {
    this.editingId = routine.id;
    this.form = this.fb.group({
      name: [routine.name, Validators.required],
      description: [routine.description ?? ''],
      goal: [routine.goal ?? ''],
      start_date: [routine.start_date ?? ''],
      end_date: [routine.end_date ?? ''],
      status: [routine.status],
      days: this.fb.array(routine.days.map((d) => this.buildDayGroup(d))),
    });
    this.showBuilder = true;
    this.formError = '';
  }

  cancelBuilder(): void {
    this.showBuilder = false;
  }

  useTemplate(template: RoutineTemplate): void {
    this.editingId = null;
    this.formError = '';

    const days: RoutineDay[] = template.days.map((day) => ({
      day_of_week: day.day_of_week,
      label: day.label,
      is_rest_day: false,
      exercises: day.exercises
        .map((ex) => {
          const match = this.exercises.find((e) => e.name.toLowerCase() === ex.name.toLowerCase());
          if (!match) return null;
          return {
            exercise_id: match.id,
            sets: ex.sets,
            reps: ex.reps,
            target_weight: null,
            rest_seconds: ex.rest_seconds,
            notes: null,
          };
        })
        .filter((e): e is NonNullable<typeof e> => e !== null),
    }));

    this.form = this.fb.group({
      name: [template.name, Validators.required],
      description: [template.description],
      goal: [template.goal],
      start_date: [new Date().toISOString().slice(0, 10)],
      end_date: [''],
      status: ['active'],
      days: this.fb.array(days.map((d) => this.buildDayGroup(d))),
    });
    this.showBuilder = true;
  }

  submit(): void {
    if (this.form.invalid) {
      this.formError = 'Revisa los campos requeridos (nombre, día y ejercicio son obligatorios).';
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.formError = '';

    const payload = this.form.value;
    const request$ = this.editingId
      ? this.routineService.update(this.editingId, payload)
      : this.routineService.create(payload);

    request$.subscribe({
      next: withCd(this.cdr, () => {
        this.isSaving = false;
        this.showBuilder = false;
        this.loadRoutines();
      }),
      error: withCd(this.cdr, (err) => {
        this.isSaving = false;
        this.formError = err.error?.message || 'No se pudo guardar la rutina';
      }),
    });
  }

  toggleStatus(routine: Routine): void {
    const next = routine.status === 'active' ? 'paused' : 'active';
    this.routineService.updateStatus(routine.id, next).subscribe(withCd(this.cdr, () => this.loadRoutines()));
  }

  markCompleted(routine: Routine): void {
    this.routineService.updateStatus(routine.id, 'completed').subscribe(withCd(this.cdr, () => this.loadRoutines()));
  }

  duplicate(routine: Routine): void {
    this.routineService.duplicate(routine.id).subscribe(withCd(this.cdr, () => this.loadRoutines()));
  }

  remove(routine: Routine): void {
    this.routineService.delete(routine.id).subscribe(withCd(this.cdr, () => this.loadRoutines()));
  }

  exerciseName(id: number): string {
    return this.exercises.find((e) => e.id === id)?.name ?? '';
  }
}
