import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular/lazy';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../core/shared.module';
import { ShellPageRoutingModule } from './shell-routing.module';
import { ShellPage } from './shell.page';

@NgModule({
  imports: [CommonModule, IonicModule, RouterModule, SharedModule, ShellPageRoutingModule],
  declarations: [ShellPage],
})
export class ShellPageModule {}
