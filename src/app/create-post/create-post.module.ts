import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular/lazy';
import { RouterModule } from '@angular/router';
import { CreatePostPageRoutingModule } from './create-post-routing.module';
import { CreatePostPage } from './create-post.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, RouterModule, CreatePostPageRoutingModule],
  declarations: [CreatePostPage],
})
export class CreatePostPageModule {}
