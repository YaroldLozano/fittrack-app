import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecureMediaDirective } from './directives/secure-media.directive';
import { AppAvatarComponent } from './components/app-avatar.component';

/** Piezas reutilizadas por varios módulos de página (ver SecureMediaDirective). */
@NgModule({
  imports: [CommonModule],
  declarations: [SecureMediaDirective, AppAvatarComponent],
  exports: [SecureMediaDirective, AppAvatarComponent],
})
export class SharedModule {}
