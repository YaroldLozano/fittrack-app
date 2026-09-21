import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { withCd } from '../core/utils/with-cd';

type AuthMode = 'login' | 'signup' | 'forgot';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page {
  mode: AuthMode = 'login';

  // Login
  username = '';
  password = '';
  errorMessage = '';
  isLoggingIn = false;

  // Signup
  signupUsername = '';
  signupPassword = '';
  signupError = '';
  signupSuccess = '';
  isRegistering = false;

  // Forgot password: paso 1 pide el código por correo, paso 2 lo pega junto con la nueva contraseña
  forgotIdentifier = '';
  forgotError = '';
  forgotRequested = false;
  forgotInfoMessage = '';
  forgotTokenInput = '';
  forgotNewPassword = '';
  forgotResetError = '';
  forgotResetSuccess = '';
  isRequestingReset = false;
  isResettingPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  setMode(mode: AuthMode) {
    this.mode = mode;
    this.errorMessage = '';
    this.signupError = '';
    this.signupSuccess = '';
    this.forgotError = '';
    this.forgotRequested = false;
    this.forgotInfoMessage = '';
    this.forgotTokenInput = '';
    this.forgotNewPassword = '';
    this.forgotResetError = '';
    this.forgotResetSuccess = '';
  }

  onLogin() {
    this.errorMessage = '';
    this.isLoggingIn = true;

    this.authService.login(this.username, this.password).subscribe({
      next: withCd(this.cdr, (res) => {
        this.isLoggingIn = false;
        if (res.success) {
          this.router.navigateByUrl('/app/dashboard');
        } else {
          this.errorMessage = res.message || 'No se pudo iniciar sesión';
        }
      }),
      error: withCd(this.cdr, (err) => {
        this.isLoggingIn = false;
        this.errorMessage = err.error?.message || 'No se pudo conectar con el servidor';
      }),
    });
  }

  onSignup() {
    this.signupError = '';
    this.signupSuccess = '';
    this.isRegistering = true;

    this.authService.register(this.signupUsername, this.signupPassword).subscribe({
      next: withCd(this.cdr, (res) => {
        this.isRegistering = false;
        if (res.success) {
          this.signupSuccess = 'Cuenta creada. Ahora puedes iniciar sesión.';
          this.signupUsername = '';
          this.signupPassword = '';
        } else {
          this.signupError = res.message || 'No se pudo registrar el usuario';
        }
      }),
      error: withCd(this.cdr, (err) => {
        this.isRegistering = false;
        this.signupError = err.error?.message || 'No se pudo conectar con el servidor';
      }),
    });
  }

  onRequestReset() {
    this.forgotError = '';
    this.isRequestingReset = true;

    this.authService.forgotPassword(this.forgotIdentifier).subscribe({
      next: withCd(this.cdr, (res) => {
        this.isRequestingReset = false;
        if (res.success) {
          this.forgotRequested = true;
          this.forgotInfoMessage =
            res.message || 'Si existe una cuenta con correo registrado, te enviamos un código de recuperación.';
        } else {
          this.forgotError = res.message || 'No se pudo generar el código de recuperación';
        }
      }),
      error: withCd(this.cdr, (err) => {
        this.isRequestingReset = false;
        this.forgotError = err.error?.message || 'No se pudo conectar con el servidor';
      }),
    });
  }

  onResetPassword() {
    if (!this.forgotTokenInput) {
      return;
    }

    this.forgotResetError = '';
    this.forgotResetSuccess = '';
    this.isResettingPassword = true;

    this.authService.resetPassword(this.forgotTokenInput, this.forgotNewPassword).subscribe({
      next: withCd(this.cdr, (res) => {
        this.isResettingPassword = false;
        if (res.success) {
          this.forgotResetSuccess = 'Contraseña actualizada. Ya puedes iniciar sesión.';
          this.forgotRequested = false;
          this.forgotTokenInput = '';
          this.forgotIdentifier = '';
          this.forgotNewPassword = '';
        } else {
          this.forgotResetError = res.message || 'No se pudo actualizar la contraseña';
        }
      }),
      error: withCd(this.cdr, (err) => {
        this.isResettingPassword = false;
        this.forgotResetError = err.error?.message || 'No se pudo conectar con el servidor';
      }),
    });
  }
}
