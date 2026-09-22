import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ChallengeService } from '../core/services/challenge.service';
import { FriendService } from '../core/services/friend.service';
import { ExerciseService } from '../core/services/exercise.service';
import { AuthService } from '../core/services/auth.service';
import { Challenge, ChallengeType } from '../core/models/challenge.model';
import { Friend } from '../core/models/friend.model';
import { Exercise } from '../core/models/exercise.model';
import { withCd } from '../core/utils/with-cd';
import { today } from '../core/utils/date.util';

@Component({
  selector: 'app-challenges',
  templateUrl: 'challenges.page.html',
  styleUrls: ['challenges.page.scss'],
  standalone: false,
})
export class ChallengesPage implements OnInit {
  challenges: Challenge[] = [];
  friends: Friend[] = [];
  exercises: Exercise[] = [];
  myUserId: number | null = null;

  readonly typeOptions: ChallengeType[] = ['strength', 'volume', 'progress', 'consistency', 'streak'];

  showCreateForm = false;
  isCreating = false;
  createError = '';
  isLoading = true;

  draft: { title: string; type: ChallengeType; exercise_id: number | null; starts_at: string; ends_at: string; participant_ids: number[] } = {
    title: '',
    type: 'consistency',
    exercise_id: null,
    starts_at: today(),
    ends_at: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
    participant_ids: [],
  };

  constructor(
    private challengeService: ChallengeService,
    private friendService: FriendService,
    private exerciseService: ExerciseService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {
    this.myUserId = this.authService.currentUserValue?.id ?? null;
  }

  ngOnInit(): void {
    this.load();
    this.friendService.list().subscribe(withCd(this.cdr, (res) => (this.friends = res.friends)));
    this.exerciseService.list().subscribe(withCd(this.cdr, (res) => (this.exercises = res.exercises)));
  }

  private load(): void {
    this.isLoading = true;
    this.challengeService.list().subscribe(
      withCd(this.cdr, (res) => {
        this.isLoading = false;
        this.challenges = res.challenges;
      })
    );
  }

  needsExercise(): boolean {
    return this.draft.type === 'strength' || this.draft.type === 'volume' || this.draft.type === 'progress';
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
    this.challengeService.create(this.draft).subscribe({
      next: withCd(this.cdr, () => {
        this.isCreating = false;
        this.showCreateForm = false;
        this.draft.title = '';
        this.draft.participant_ids = [];
        this.load();
      }),
      error: withCd(this.cdr, (err) => {
        this.isCreating = false;
        this.createError = err.error?.message || 'No se pudo crear el reto';
      }),
    });
  }

  accept(id: number): void {
    this.challengeService.accept(id).subscribe(withCd(this.cdr, () => this.load()));
  }

  decline(id: number): void {
    this.challengeService.decline(id).subscribe(withCd(this.cdr, () => this.load()));
  }

  isPending(challenge: Challenge): boolean {
    return challenge.my_status === 'invited';
  }
}
