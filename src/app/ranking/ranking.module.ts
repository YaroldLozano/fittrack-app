import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular/lazy';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../core/shared.module';
import { RankingPageRoutingModule } from './ranking-routing.module';
import { RankingPage } from './ranking.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, RouterModule, SharedModule, RankingPageRoutingModule],
  declarations: [RankingPage],
})
export class RankingPageModule {}
