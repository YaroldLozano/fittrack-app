import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { BodyMetricService } from '../core/services/body-metric.service';
import { RankingService } from '../core/services/ranking.service';
import { ProfileService } from '../core/services/profile.service';
import { MediaService } from '../core/services/media.service';
import { PostService } from '../core/services/post.service';
import { FriendService } from '../core/services/friend.service';
import { BodyMetric } from '../core/models/body-metric.model';
import { User } from '../core/models/user.model';
import { MyGamification } from '../core/models/gamification.model';
import { Post } from '../core/models/post.model';
import { withCd } from '../core/utils/with-cd';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss'],
  standalone: false,
})
export class ProfilePage implements OnInit {
  user: User | null = null;
  me: MyGamification | null = null;
  metrics: BodyMetric[] = [];
  isSaving = false;
  formError = '';
  formSuccess = '';

  emailDraft = '';
  isSavingEmail = false;
  emailError = '';
  emailSuccess = '';

  avatarMediaId: number | null = null;
  isUploadingAvatar = false;
  bio: string | null = null;
  isEditingProfile = false;
  nameDraft = '';
  bioDraft = '';
  isSavingProfile = false;

  myPosts: Post[] = [];

  draft: {
    recorded_date: string;
    weight: number | null;
    height: number | null;
    body_fat_percentage: number | null;
    chest: number | null;
    waist: number | null;
    arm: number | null;
    leg: number | null;
    hip: number | null;
  } = {
    recorded_date: new Date().toISOString().slice(0, 10),
    weight: null,
    height: null,
    body_fat_percentage: null,
    chest: null,
    waist: null,
    arm: null,
    leg: null,
    hip: null,
  };

  chartData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };
  chartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { ticks: { color: 'rgba(255,255,255,0.6)' }, grid: { color: 'rgba(255,255,255,0.05)' } },
      y: { ticks: { color: 'rgba(255,255,255,0.6)' }, grid: { color: 'rgba(255,255,255,0.05)' } },
    },
    plugins: { legend: { display: false } },
  };

  constructor(
    private authService: AuthService,
    private bodyMetricService: BodyMetricService,
    private rankingService: RankingService,
    private profileService: ProfileService,
    private mediaService: MediaService,
    private postService: PostService,
    private friendService: FriendService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.user = this.authService.currentUserValue;
    this.emailDraft = this.user?.email ?? '';
  }

  ngOnInit(): void {
    this.loadMetrics();
    this.rankingService.me().subscribe(withCd(this.cdr, (res) => (this.me = res.me)));
    this.loadProfile();
    if (this.user) {
      this.postService.forUser(this.user.id).subscribe(withCd(this.cdr, (res) => (this.myPosts = res.posts)));
    }
  }

  private loadProfile(): void {
    if (!this.user) {
      return;
    }
    this.friendService.profile(this.user.id).subscribe(
      withCd(this.cdr, (res) => {
        this.avatarMediaId = res.profile.avatar_media_id;
        this.bio = res.profile.bio;
      })
    );
  }

  onAvatarSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) {
      return;
    }
    this.isUploadingAvatar = true;
    this.mediaService.upload(file).subscribe({
      next: withCd(this.cdr, (res) => {
        this.profileService.setAvatar(res.media.id).subscribe(
          withCd(this.cdr, (profileRes) => {
            this.isUploadingAvatar = false;
            this.avatarMediaId = profileRes.user.avatar_media_id;
          })
        );
      }),
      error: withCd(this.cdr, () => {
        this.isUploadingAvatar = false;
      }),
    });
  }

  removeAvatar(): void {
    this.profileService.removeAvatar().subscribe(withCd(this.cdr, () => (this.avatarMediaId = null)));
  }

  startEditProfile(): void {
    this.nameDraft = this.user?.username ?? '';
    this.bioDraft = this.bio ?? '';
    this.isEditingProfile = true;
  }

  saveProfile(): void {
    this.isSavingProfile = true;
    this.profileService.update({ bio: this.bioDraft }).subscribe({
      next: withCd(this.cdr, (res) => {
        this.isSavingProfile = false;
        this.isEditingProfile = false;
        this.bio = res.user.bio;
      }),
      error: withCd(this.cdr, () => {
        this.isSavingProfile = false;
      }),
    });
  }

  private loadMetrics(): void {
    this.bodyMetricService.list().subscribe(
      withCd(this.cdr, (res) => {
        this.metrics = res.body_metrics;
        this.chartData = {
          labels: this.metrics.map((m) => m.recorded_date),
          datasets: [
            {
              label: 'Peso (kg)',
              data: this.metrics.map((m) => m.weight ?? 0),
              borderColor: '#F94144',
              backgroundColor: 'rgba(249, 65, 68, 0.15)',
              tension: 0.3,
              fill: true,
            },
          ],
        };
      })
    );
  }

  submit(): void {
    this.isSaving = true;
    this.formError = '';
    this.formSuccess = '';

    this.bodyMetricService.upsert(this.draft).subscribe({
      next: withCd(this.cdr, () => {
        this.isSaving = false;
        this.formSuccess = 'Registro guardado';
        this.loadMetrics();
      }),
      error: withCd(this.cdr, (err) => {
        this.isSaving = false;
        this.formError = err.error?.message || 'No se pudo guardar el registro';
      }),
    });
  }

  submitEmail(): void {
    this.isSavingEmail = true;
    this.emailError = '';
    this.emailSuccess = '';

    this.authService.updateEmail(this.emailDraft).subscribe({
      next: withCd(this.cdr, (res) => {
        this.isSavingEmail = false;
        if (res.success) {
          this.user = res.user ?? this.user;
          this.emailSuccess = 'Correo actualizado';
        } else {
          this.emailError = res.message || 'No se pudo guardar el correo';
        }
      }),
      error: withCd(this.cdr, (err) => {
        this.isSavingEmail = false;
        this.emailError = err.error?.message || 'No se pudo conectar con el servidor';
      }),
    });
  }

  openPost(postId: number): void {
    this.router.navigate(['/app/posts', postId]);
  }

  async onLogout() {
    await this.authService.logout();
    this.router.navigateByUrl('/auth');
  }
}
