import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, from, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

const PUBLIC_AUTH_PATHS = ['/auth/login', '/auth/register', '/auth/forgot-password', '/auth/reset-password'];

/** On a 401 from a protected endpoint (expired/revoked token), clears the local session and sends the user back to login. */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((err: unknown) => {
      const isUnauthorized = err instanceof HttpErrorResponse && err.status === 401;
      const isPublicAuthCall = PUBLIC_AUTH_PATHS.some((path) => req.url.includes(path));

      if (isUnauthorized && !isPublicAuthCall) {
        return from(authService.clearSession()).pipe(
          switchMap(() => {
            router.navigate(['/auth']);
            return throwError(() => err);
          })
        );
      }

      return throwError(() => err);
    })
  );
};
