import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular/lazy';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../core/shared.module';
import { StoryViewerPageRoutingModule } from './story-viewer-routing.module';
import { StoryViewerPage } from './story-viewer.page';

@NgModule({
  imports: [CommonModule, IonicModule, RouterModule, SharedModule, StoryViewerPageRoutingModule],
  declarations: [StoryViewerPage],
})
export class StoryViewerPageModule {}
