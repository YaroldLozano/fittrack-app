import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GroupWorkoutsPage } from './group-workouts.page';

const routes: Routes = [{ path: '', component: GroupWorkoutsPage }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class GroupWorkoutsPageRoutingModule {}
