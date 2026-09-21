import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProgressPage } from './progress.page';

const routes: Routes = [{ path: '', component: ProgressPage }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class ProgressPageRoutingModule {}
