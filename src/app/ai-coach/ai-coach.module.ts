import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular/lazy';
import { RouterModule } from '@angular/router';
import { AiCoachPageRoutingModule } from './ai-coach-routing.module';
import { AiCoachPage } from './ai-coach.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, RouterModule, AiCoachPageRoutingModule],
  declarations: [AiCoachPage],
})
export class AiCoachPageModule {}
