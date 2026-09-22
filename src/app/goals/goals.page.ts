import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { GoalService } from '../core/services/goal.service';
import { ExerciseService } from '../core/services/exercise.service';
import { Goal, GoalType } from '../core/models/goal.model';
import { Exercise } from '../core/models/exercise.model';
import { withCd } from '../core/utils/with-cd';

@Component({
  selector: 'app-goals',
  templateUrl: 'goals.page.html',
  styleUrls: ['goals.page.scss'],
  standalone: false,
})
export class GoalsPage implements OnInit {
  goals: Goal[] = [];
  exercises: Exercise[] = [];

  showForm = false;
  isSaving = false;
  formError = '';

  newGoal: {
    title: string;
    type: GoalType;
    exercise_id: number | null;
    target_value: number | null;
    unit: string;
    target_date: string;
  } = { title: '', type: 'exercise_weight', exercise_id: null, target_value: null, unit: 'kg', target_date: '' };

  readonly typeLabels: Record<GoalType, string> = {
    exercise_weight: 'Levantar X kg en un ejercicio',
    workout_frequency: 'Entrenar N veces',
    body_weight: 'Llegar a un peso corporal',
    routine_completion: 'Completar una rutina',
    custom: 'Personalizado',
  };

  readonly typeOptions: GoalType[] = [
    'exercise_weight',
    'workout_frequency',
    'body_weight',
    'routine_completion',
    'custom',
  ];

  constructor(
    private goalService: GoalService,
    private exerciseService: ExerciseService,
    private cdr: ChangeDetectorRef,
    private alertCtrl: AlertController
  ) {}

  ngOnInit(): void {
    this.loadGoals();
    this.exerciseService.list().subscribe(withCd(this.cdr, (res) => (this.exercises = res.exercises)));
  }

  loadGoals(): void {
    this.goalService.list().subscribe(withCd(this.cdr, (res) => (this.goals = res.goals)));
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    this.formError = '';
  }

  submit(): void {
    if (!this.newGoal.title || !this.newGoal.type) {
      this.formError = 'El título y el tipo son requeridos';
      return;
    }

    this.isSaving = true;
    this.formError = '';

    this.goalService
      .create({
        title: this.newGoal.title,
        type: this.newGoal.type,
        exercise_id: this.newGoal.type === 'exercise_weight' ? this.newGoal.exercise_id : null,
        target_value: this.newGoal.target_value,
        unit: this.newGoal.unit || null,
        target_date: this.newGoal.target_date || null,
      })
      .subscribe({
        next: withCd(this.cdr, () => {
          this.isSaving = false;
          this.showForm = false;
          this.newGoal = { title: '', type: 'exercise_weight', exercise_id: null, target_value: null, unit: 'kg', target_date: '' };
          this.loadGoals();
        }),
        error: withCd(this.cdr, (err) => {
          this.isSaving = false;
          this.formError = err.error?.message || 'No se pudo crear el objetivo';
        }),
      });
  }

  markCompleted(goal: Goal): void {
    this.goalService.update(goal.id, { status: 'completed' }).subscribe(withCd(this.cdr, () => this.loadGoals()));
  }

  async remove(goal: Goal): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar objetivo',
      message: '¿Eliminar este objetivo? Esta acción no se puede deshacer.',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.goalService.delete(goal.id).subscribe({
              next: withCd(this.cdr, () => this.loadGoals()),
              error: withCd(this.cdr, (err) => console.error(err)),
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
