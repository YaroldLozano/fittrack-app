import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular/lazy';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../core/shared.module';
import { PostDetailPageRoutingModule } from './post-detail-routing.module';
import { PostDetailPage } from './post-detail.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, RouterModule, SharedModule, PostDetailPageRoutingModule],
  declarations: [PostDetailPage],
})
export class PostDetailPageModule {}
