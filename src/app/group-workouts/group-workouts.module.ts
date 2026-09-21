import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular/lazy';
import { RouterModule } from '@angular/router';
import { GroupWorkoutsPageRoutingModule } from './group-workouts-routing.module';
import { GroupWorkoutsPage } from './group-workouts.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, RouterModule, GroupWorkoutsPageRoutingModule],
  declarations: [GroupWorkoutsPage],
})
export class GroupWorkoutsPageModule {}
