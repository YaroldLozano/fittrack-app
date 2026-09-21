import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StoryViewerPage } from './story-viewer.page';

const routes: Routes = [{ path: '', component: StoryViewerPage }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StoryViewerPageRoutingModule {}
