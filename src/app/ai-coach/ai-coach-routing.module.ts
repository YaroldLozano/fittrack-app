import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AiCoachPage } from './ai-coach.page';

const routes: Routes = [{ path: '', component: AiCoachPage }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class AiCoachPageRoutingModule {}
