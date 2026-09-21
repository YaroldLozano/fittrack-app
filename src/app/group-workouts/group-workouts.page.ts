import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { GroupWorkoutService } from '../core/services/group-workout.service';
import { FriendService } from '../core/services/friend.service';
import { GroupWorkout } from '../core/models/group-workout.model';
import { Friend } from '../core/models/friend.model';
import { withCd } from '../core/utils/with-cd';

@Component({
  selector: 'app-group-workouts',
  templateUrl: 'group-workouts.page.html',
  styleUrls: ['group-workouts.page.scss'],
  standalone: false,
})
export class GroupWorkoutsPage implements OnInit {
  groupWorkouts: GroupWorkout[] = [];
  friends: Friend[] = [];

  showCreateForm = false;
  isCreating = false;
  createError = '';
  isLoading = true;

  draft: { name: string; scheduled_date: string; scheduled_time: string; participant_ids: number[] } = {
    name: '',
    scheduled_date: new Date().toISOString().slice(0, 10),
    scheduled_time: '18:00',
    participant_ids: [],
  };

  constructor(
    private groupWorkoutService: GroupWorkoutService,
    private friendService: FriendService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.load();
    this.friendService.list().subscribe(withCd(this.cdr, (res) => (this.friends = res.friends)));
  }

  private load(): void {
    this.isLoading = true;
    this.groupWorkoutService.list().subscribe(
      withCd(this.cdr, (res) => {
        this.isLoading = false;
        this.groupWorkouts = res.group_workouts;
      })
    );
  }

  toggleParticipant(userId: number): void {
    const idx = this.draft.participant_ids.indexOf(userId);
    if (idx >= 0) {
      this.draft.participant_ids.splice(idx, 1);
    } else {
      this.draft.participant_ids.push(userId);
    }
  }

  create(): void {
    this.isCreating = true;
    this.createError = '';
    this.groupWorkoutService.create(this.draft).subscribe({
      next: withCd(this.cdr, () => {
        this.isCreating = false;
        this.showCreateForm = false;
        this.draft.name = '';
        this.draft.participant_ids = [];
        this.load();
      }),
      error: withCd(this.cdr, (err) => {
        this.isCreating = false;
        this.createError = err.error?.message || 'No se pudo crear el entrenamiento';
      }),
    });
  }

  respond(id: number, accept: boolean): void {
    this.groupWorkoutService.respond(id, accept).subscribe(withCd(this.cdr, () => this.load()));
  }

  complete(id: number): void {
    this.groupWorkoutService.complete(id).subscribe(withCd(this.cdr, () => this.load()));
  }

  isPending(gw: GroupWorkout): boolean {
    return gw.my_status === 'invited';
  }
}
