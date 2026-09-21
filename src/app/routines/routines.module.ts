import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular/lazy';
import { RouterModule } from '@angular/router';
import { RoutinesPageRoutingModule } from './routines-routing.module';
import { RoutinesPage } from './routines.page';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, IonicModule, RouterModule, RoutinesPageRoutingModule],
  declarations: [RoutinesPage],
})
export class RoutinesPageModule {}
