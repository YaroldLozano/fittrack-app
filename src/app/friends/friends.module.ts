import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular/lazy';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../core/shared.module';
import { FriendsPageRoutingModule } from './friends-routing.module';
import { FriendsPage } from './friends.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, RouterModule, SharedModule, FriendsPageRoutingModule],
  declarations: [FriendsPage],
})
export class FriendsPageModule {}
