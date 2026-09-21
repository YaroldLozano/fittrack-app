import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular/lazy';
import { RouterModule } from '@angular/router';
import { GoalsPageRoutingModule } from './goals-routing.module';
import { GoalsPage } from './goals.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, RouterModule, GoalsPageRoutingModule],
  declarations: [GoalsPage],
})
export class GoalsPageModule {}
