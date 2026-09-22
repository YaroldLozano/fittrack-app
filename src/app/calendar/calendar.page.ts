import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WorkoutService } from '../core/services/workout.service';
import { RoutineService } from '../core/services/routine.service';
import { WorkoutSession } from '../core/models/workout.model';
import { Routine } from '../core/models/routine.model';
import { withCd } from '../core/utils/with-cd';
import { today } from '../core/utils/date.util';

interface CalendarCell {
  date: string; // YYYY-MM-DD
  dayNumber: number;
  inCurrentMonth: boolean;
  isToday: boolean;
  isRestDay: boolean;
  workouts: WorkoutSession[];
}

@Component({
  selector: 'app-calendar',
  templateUrl: 'calendar.page.html',
  styleUrls: ['calendar.page.scss'],
  standalone: false,
})
export class CalendarPage implements OnInit {
  currentMonth = new Date();
  cells: CalendarCell[] = [];
  selectedDate: string | null = null;

  activeRoutine: Routine | null = null;
  isCreating = false;
  newWorkoutName = '';

  readonly weekdayLabels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  constructor(
    private workoutService: WorkoutService,
    private routineService: RoutineService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.routineService.list().subscribe({
      next: withCd(this.cdr, (res) => {
        this.activeRoutine = res.routines.find((r) => r.status === 'active') ?? null;
        this.buildMonth();
      }),
      error: withCd(this.cdr, (err) => console.error(err)),
    });
  }

  get monthLabel(): string {
    return this.currentMonth.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  }

  changeMonth(delta: number): void {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + delta, 1);
    this.buildMonth();
  }

  private buildMonth(): void {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    const firstOfMonth = new Date(year, month, 1);
    const lastOfMonth = new Date(year, month + 1, 0);

    // Monday-based offset
    const startOffset = (firstOfMonth.getDay() + 6) % 7;
    const gridStart = new Date(year, month, 1 - startOffset);
    const totalCells = Math.ceil((startOffset + lastOfMonth.getDate()) / 7) * 7;

    const from = this.toDateString(gridStart);
    const gridEnd = new Date(gridStart);
    gridEnd.setDate(gridStart.getDate() + totalCells - 1);
    const to = this.toDateString(gridEnd);

    this.workoutService.list(from, to).subscribe({
      next: withCd(this.cdr, (res) => {
        const todayStr = today();
        const cells: CalendarCell[] = [];

        for (let i = 0; i < totalCells; i++) {
          const date = new Date(gridStart);
          date.setDate(gridStart.getDate() + i);
          const dateStr = this.toDateString(date);

          cells.push({
            date: dateStr,
            dayNumber: date.getDate(),
            inCurrentMonth: date.getMonth() === month,
            isToday: dateStr === todayStr,
            isRestDay: this.isRoutineRestDay(dateStr, date.getDay()),
            workouts: res.workouts.filter((w) => w.scheduled_date === dateStr),
          });
        }

        this.cells = cells;
      }),
      error: withCd(this.cdr, (err) => console.error(err)),
    });
  }

  private isRoutineRestDay(dateStr: string, jsDay: number): boolean {
    if (!this.activeRoutine) return false;
    if (this.activeRoutine.start_date && dateStr < this.activeRoutine.start_date) return false;
    if (this.activeRoutine.end_date && dateStr > this.activeRoutine.end_date) return false;

    const dayOfWeek = (jsDay + 6) % 7; // convert JS (0=Sun) to our 0=Mon convention
    return this.activeRoutine.days.some((d) => d.day_of_week === dayOfWeek && d.is_rest_day);
  }

  private toDateString(date: Date): string {
    return date.toISOString().slice(0, 10);
  }

  selectDate(cell: CalendarCell): void {
    this.selectedDate = cell.date;
    this.newWorkoutName = '';
  }

  get selectedCell(): CalendarCell | undefined {
    return this.cells.find((c) => c.date === this.selectedDate);
  }

  createWorkoutForSelectedDate(): void {
    if (!this.selectedDate || !this.newWorkoutName) return;

    this.isCreating = true;
    this.workoutService.create({ name: this.newWorkoutName, scheduled_date: this.selectedDate }).subscribe({
      next: withCd(this.cdr, () => {
        this.isCreating = false;
        this.newWorkoutName = '';
        this.buildMonth();
      }),
      error: withCd(this.cdr, (err) => {
        this.isCreating = false;
        console.error(err);
      }),
    });
  }

  openWorkout(workout: WorkoutSession): void {
    this.router.navigate(['/app/workout'], { queryParams: { id: workout.id } });
  }
}
