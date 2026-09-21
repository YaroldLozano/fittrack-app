import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular/lazy';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../core/shared.module';
import { ChatConversationPageRoutingModule } from './chat-conversation-routing.module';
import { ChatConversationPage } from './chat-conversation.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, RouterModule, SharedModule, ChatConversationPageRoutingModule],
  declarations: [ChatConversationPage],
})
export class ChatConversationPageModule {}
