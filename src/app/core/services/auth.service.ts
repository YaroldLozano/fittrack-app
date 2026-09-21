import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Preferences } from '@capacitor/preferences';
import { BehaviorSubject, Observable, filter, firstValueFrom, from, map, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';
import { ApiResponse, ForgotPasswordResponse, LoginResponse, UpdateEmailResponse } from '../models/auth.model';

const TOKEN_KEY = 'fitness_auth_token';
const USER_KEY = 'fitness_auth_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly currentUser = new BehaviorSubject<User | null>(null);
  private readonly initialized = new BehaviorSubject<boolean>(false);

  readonly currentUser$ = this.currentUser.asObservable();

  constructor(private http: HttpClient) {
    this.restoreSession();
  }

  get currentUserValue(): User | null {
    return this.currentUser.value;
  }

  async isReady(): Promise<boolean> {
    if (this.initialized.value) {
      return true;
    }
    return firstValueFrom(this.initialized.pipe(filter((ready) => ready)));
  }

  async getToken(): Promise<string | null> {
    const { value } = await Preferences.get({ key: TOKEN_KEY });
    return value;
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${environment.apiUrl}/auth/login`, { username, password })
      .pipe(
        switchMap((res) =>
          from(this.persistSession(res)).pipe(map(() => res))
        )
      );
  }

  register(username: string, password: string, email?: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/register`, {
      username,
      password,
      email,
    });
  }

  forgotPassword(identifier: string): Observable<ForgotPasswordResponse> {
    return this.http.post<ForgotPasswordResponse>(`${environment.apiUrl}/auth/forgot-password`, {
      identifier,
    });
  }

  resetPassword(token: string, password: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.apiUrl}/auth/reset-password`, {
      token,
      password,
    });
  }

  updateEmail(email: string): Observable<UpdateEmailResponse> {
    return this.http
      .put<UpdateEmailResponse>(`${environment.apiUrl}/auth/email`, { email })
      .pipe(switchMap((res) => from(this.persistUserUpdate(res)).pipe(map(() => res))));
  }

  async logout(): Promise<void> {
    const token = await this.getToken();

    if (token) {
      try {
        await firstValueFrom(this.http.post(`${environment.apiUrl}/auth/logout`, {}));
      } catch {
        // Si el logout en el servidor falla (p. ej. sin conexión), igual limpiamos la sesión local.
      }
    }

    await this.clearSession();
  }

  /** Clears the local session without calling the API — used when a request comes back 401 (expired/revoked token). */
  async clearSession(): Promise<void> {
    await Preferences.remove({ key: TOKEN_KEY });
    await Preferences.remove({ key: USER_KEY });
    this.currentUser.next(null);
  }

  private async restoreSession(): Promise<void> {
    const [{ value: token }, { value: userJson }] = await Promise.all([
      Preferences.get({ key: TOKEN_KEY }),
      Preferences.get({ key: USER_KEY }),
    ]);

    if (token && userJson) {
      this.currentUser.next(JSON.parse(userJson) as User);
    }

    this.initialized.next(true);
  }

  private async persistSession(res: LoginResponse): Promise<void> {
    if (!res.success || !res.token || !res.user) {
      return;
    }

    await Promise.all([
      Preferences.set({ key: TOKEN_KEY, value: res.token }),
      Preferences.set({ key: USER_KEY, value: JSON.stringify(res.user) }),
    ]);

    this.currentUser.next(res.user);
  }

  private async persistUserUpdate(res: UpdateEmailResponse): Promise<void> {
    if (!res.success || !res.user) {
      return;
    }

    await Preferences.set({ key: USER_KEY, value: JSON.stringify(res.user) });
    this.currentUser.next(res.user);
  }
}
