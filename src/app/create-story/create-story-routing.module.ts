import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateStoryPage } from './create-story.page';

const routes: Routes = [{ path: '', component: CreateStoryPage }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateStoryPageRoutingModule {}
