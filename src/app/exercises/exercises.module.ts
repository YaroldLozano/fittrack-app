import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular/lazy';
import { RouterModule } from '@angular/router';
import { ExercisesPageRoutingModule } from './exercises-routing.module';
import { ExercisesPage } from './exercises.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, RouterModule, ExercisesPageRoutingModule],
  declarations: [ExercisesPage],
})
export class ExercisesPageModule {}
