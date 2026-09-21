import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular/lazy';
import { RouterModule } from '@angular/router';
import { CreateStoryPageRoutingModule } from './create-story-routing.module';
import { CreateStoryPage } from './create-story.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, RouterModule, CreateStoryPageRoutingModule],
  declarations: [CreateStoryPage],
})
export class CreateStoryPageModule {}
