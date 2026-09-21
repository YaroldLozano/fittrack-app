import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular/lazy';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../core/shared.module';
import { MessagesPageRoutingModule } from './messages-routing.module';
import { MessagesPage } from './messages.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, RouterModule, SharedModule, MessagesPageRoutingModule],
  declarations: [MessagesPage],
})
export class MessagesPageModule {}
