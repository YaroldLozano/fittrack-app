import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AchievementService } from '../core/services/achievement.service';
import { Achievement } from '../core/models/achievement.model';
import { withCd } from '../core/utils/with-cd';

@Component({
  selector: 'app-achievements',
  templateUrl: 'achievements.page.html',
  styleUrls: ['achievements.page.scss'],
  standalone: false,
})
export class AchievementsPage implements OnInit {
  unlocked: Achievement[] = [];
  locked: Achievement[] = [];
  isLoading = true;

  constructor(
    private achievementService: AchievementService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.achievementService.me().subscribe(
      withCd(this.cdr, (res) => {
        this.isLoading = false;
        this.unlocked = res.unlocked;
        this.locked = res.locked;
      })
    );
  }
}
