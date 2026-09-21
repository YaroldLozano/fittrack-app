import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular/lazy';
import { RouterModule } from '@angular/router';
import { WorkoutPageRoutingModule } from './workout-routing.module';
import { WorkoutPage } from './workout.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, RouterModule, WorkoutPageRoutingModule],
  declarations: [WorkoutPage],
})
export class WorkoutPageModule {}
