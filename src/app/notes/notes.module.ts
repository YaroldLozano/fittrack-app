import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular/lazy';
import { RouterModule } from '@angular/router';
import { NotesPageRoutingModule } from './notes-routing.module';
import { NotesPage } from './notes.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, RouterModule, NotesPageRoutingModule],
  declarations: [NotesPage],
})
export class NotesPageModule {}
