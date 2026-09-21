import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular/lazy';
import { RouterModule } from '@angular/router';
import { CalendarPageRoutingModule } from './calendar-routing.module';
import { CalendarPage } from './calendar.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, RouterModule, CalendarPageRoutingModule],
  declarations: [CalendarPage],
})
export class CalendarPageModule {}
