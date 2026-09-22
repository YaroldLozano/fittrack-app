import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ExerciseService } from '../core/services/exercise.service';
import { AuthService } from '../core/services/auth.service';
import { DifficultyLevel, Exercise, MuscleGroup } from '../core/models/exercise.model';
import { withCd } from '../core/utils/with-cd';

@Component({
  selector: 'app-exercises',
  templateUrl: 'exercises.page.html',
  styleUrls: ['exercises.page.scss'],
  standalone: false,
})
export class ExercisesPage implements OnInit {
  muscleGroups: MuscleGroup[] = [];
  exercises: Exercise[] = [];
  filterMuscleGroupId: number | null = null;
  currentUserId: number | null = null;

  showForm = false;
  isSaving = false;
  formError = '';

  newExercise: {
    name: string;
    muscle_group_id: number | null;
    equipment: string;
    difficulty_level: DifficultyLevel | '';
    description: string;
  } = { name: '', muscle_group_id: null, equipment: '', difficulty_level: '', description: '' };

  constructor(
    private exerciseService: ExerciseService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private alertCtrl: AlertController
  ) {
    this.currentUserId = this.authService.currentUserValue?.id ?? null;
  }

  ngOnInit(): void {
    this.exerciseService.getMuscleGroups().subscribe(
      withCd(this.cdr, (res) => (this.muscleGroups = res.muscle_groups))
    );
    this.loadExercises();
  }

  loadExercises(): void {
    this.exerciseService
      .list(this.filterMuscleGroupId ?? undefined)
      .subscribe(withCd(this.cdr, (res) => (this.exercises = res.exercises)));
  }

  onFilterChange(): void {
    this.loadExercises();
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    this.formError = '';
  }

  onCreate(): void {
    if (!this.newExercise.name || !this.newExercise.muscle_group_id) {
      this.formError = 'Nombre y grupo muscular son requeridos';
      return;
    }

    this.isSaving = true;
    this.formError = '';

    this.exerciseService
      .create({
        name: this.newExercise.name,
        muscle_group_id: this.newExercise.muscle_group_id,
        equipment: this.newExercise.equipment || null,
        difficulty_level: (this.newExercise.difficulty_level || null) as DifficultyLevel | null,
        description: this.newExercise.description || null,
      })
      .subscribe({
        next: withCd(this.cdr, () => {
          this.isSaving = false;
          this.showForm = false;
          this.newExercise = { name: '', muscle_group_id: null, equipment: '', difficulty_level: '', description: '' };
          this.loadExercises();
        }),
        error: withCd(this.cdr, (err) => {
          this.isSaving = false;
          this.formError = err.error?.message || 'No se pudo crear el ejercicio';
        }),
      });
  }

  async onDelete(exercise: Exercise): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar ejercicio',
      message: '¿Eliminar este ejercicio? Esta acción no se puede deshacer.',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.exerciseService.delete(exercise.id).subscribe({
              next: withCd(this.cdr, () => this.loadExercises()),
              error: withCd(this.cdr, (err) => console.error(err)),
            });
          },
        },
      ],
    });
    await alert.present();
  }

  isOwn(exercise: Exercise): boolean {
    return exercise.user_id !== null && exercise.user_id === this.currentUserId;
  }
}
