import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular/lazy';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../core/shared.module';
import { FeedPageRoutingModule } from './feed-routing.module';
import { FeedPage } from './feed.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, RouterModule, SharedModule, FeedPageRoutingModule],
  declarations: [FeedPage],
})
export class FeedPageModule {}
