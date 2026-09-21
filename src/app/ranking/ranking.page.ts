import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RankingService } from '../core/services/ranking.service';
import { AchievementService } from '../core/services/achievement.service';
import { ChallengeService } from '../core/services/challenge.service';
import { ExerciseService } from '../core/services/exercise.service';
import { MyGamification, RankedEntry, PeriodRankingEntry, ExerciseRankingEntry } from '../core/models/gamification.model';
import { Achievement } from '../core/models/achievement.model';
import { Challenge } from '../core/models/challenge.model';
import { Exercise } from '../core/models/exercise.model';
import { withCd } from '../core/utils/with-cd';

type RankingTab = 'resumen' | 'amigos' | 'global' | 'semanal' | 'temporada' | 'ejercicio';

@Component({
  selector: 'app-ranking',
  templateUrl: 'ranking.page.html',
  styleUrls: ['ranking.page.scss'],
  standalone: false,
})
export class RankingPage implements OnInit {
  tab: RankingTab = 'resumen';

  me: MyGamification | null = null;
  recentAchievements: Achievement[] = [];
  nextUnlocks: Achievement[] = [];
  activeChallenges: Challenge[] = [];

  friendsEntries: RankedEntry[] = [];

  globalMode: 'page' | 'nearby' = 'nearby';
  globalPageNum = 1;
  globalEntries: RankedEntry[] = [];
  globalTotal = 0;

  weeklyEntries: PeriodRankingEntry[] = [];
  weeklySecondsRemaining = 0;
  weeklyScope: 'global' | 'friends' = 'global';

  seasonEntries: PeriodRankingEntry[] = [];
  seasonName = '';
  seasonScope: 'global' | 'friends' = 'global';

  exercises: Exercise[] = [];
  selectedExerciseId: number | null = null;
  exerciseScope: 'global' | 'friends' = 'global';
  exerciseEntries: ExerciseRankingEntry[] = [];

  isLoading = true;

  constructor(
    private rankingService: RankingService,
    private achievementService: AchievementService,
    private challengeService: ChallengeService,
    private exerciseService: ExerciseService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadSummary();
  }

  setTab(tab: RankingTab): void {
    this.tab = tab;
    if (tab === 'amigos' && this.friendsEntries.length === 0) this.loadFriends();
    if (tab === 'global' && this.globalEntries.length === 0) this.loadGlobal();
    if (tab === 'semanal' && this.weeklyEntries.length === 0) this.loadWeekly();
    if (tab === 'temporada' && this.seasonEntries.length === 0) this.loadSeason();
    if (tab === 'ejercicio' && this.exercises.length === 0) this.loadExerciseTab();
  }

  private loadSummary(): void {
    this.isLoading = true;
    this.rankingService.me().subscribe(
      withCd(this.cdr, (res) => {
        this.isLoading = false;
        this.me = res.me;
      })
    );
    this.achievementService.me().subscribe(
      withCd(this.cdr, (res) => {
        this.recentAchievements = [...res.unlocked].slice(0, 3);
        this.nextUnlocks = [...res.locked]
          .filter((a) => (a.current_value ?? 0) > 0)
          .sort((a, b) => (b.current_value ?? 0) / b.requirement_value - (a.current_value ?? 0) / a.requirement_value)
          .slice(0, 3);
      })
    );
    this.challengeService.list().subscribe(
      withCd(this.cdr, (res) => {
        this.activeChallenges = res.challenges.filter((c) => c.status === 'active' || c.status === 'pending');
      })
    );
  }

  loadFriends(): void {
    this.rankingService.friends().subscribe(withCd(this.cdr, (res) => (this.friendsEntries = res.ranking.entries)));
  }

  setGlobalMode(mode: 'page' | 'nearby'): void {
    this.globalMode = mode;
    this.globalPageNum = 1;
    this.loadGlobal();
  }

  loadGlobal(): void {
    this.rankingService.global(this.globalMode, this.globalPageNum).subscribe(
      withCd(this.cdr, (res) => {
        this.globalEntries = res.ranking.entries;
        this.globalTotal = res.ranking.total;
      })
    );
  }

  nextGlobalPage(): void {
    this.globalPageNum++;
    this.loadGlobal();
  }

  prevGlobalPage(): void {
    if (this.globalPageNum > 1) {
      this.globalPageNum--;
      this.loadGlobal();
    }
  }

  setWeeklyScope(scope: 'global' | 'friends'): void {
    this.weeklyScope = scope;
    this.loadWeekly();
  }

  loadWeekly(): void {
    this.rankingService.weekly(this.weeklyScope).subscribe(
      withCd(this.cdr, (res) => {
        this.weeklyEntries = res.ranking.entries;
        this.weeklySecondsRemaining = res.ranking.seconds_remaining;
      })
    );
  }

  setSeasonScope(scope: 'global' | 'friends'): void {
    this.seasonScope = scope;
    this.loadSeason();
  }

  loadSeason(): void {
    this.rankingService.season(this.seasonScope).subscribe(
      withCd(this.cdr, (res) => {
        this.seasonEntries = res.ranking.entries;
        this.seasonName = res.ranking.season.name;
      })
    );
  }

  private loadExerciseTab(): void {
    this.exerciseService.list().subscribe(withCd(this.cdr, (res) => (this.exercises = res.exercises)));
  }

  onExerciseSelected(): void {
    if (!this.selectedExerciseId) return;
    this.loadExerciseRanking();
  }

  setExerciseScope(scope: 'global' | 'friends'): void {
    this.exerciseScope = scope;
    this.loadExerciseRanking();
  }

  private loadExerciseRanking(): void {
    if (!this.selectedExerciseId) return;
    this.rankingService
      .byExercise(this.selectedExerciseId, this.exerciseScope)
      .subscribe(withCd(this.cdr, (res) => (this.exerciseEntries = res.ranking.entries)));
  }

  formatDuration(seconds: number): string {
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${d}d ${h}h ${m}m`;
  }
}
