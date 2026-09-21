import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FriendProfilePage } from './friend-profile.page';

const routes: Routes = [{ path: '', component: FriendProfilePage }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class FriendProfilePageRoutingModule {}
