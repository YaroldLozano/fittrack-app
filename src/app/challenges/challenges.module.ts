import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular/lazy';
import { RouterModule } from '@angular/router';
import { ChallengesPageRoutingModule } from './challenges-routing.module';
import { ChallengesPage } from './challenges.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, RouterModule, ChallengesPageRoutingModule],
  declarations: [ChallengesPage],
})
export class ChallengesPageModule {}
