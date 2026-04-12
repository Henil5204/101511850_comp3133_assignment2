import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';

export interface User { _id?: string; username: string; email: string; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TK = 'emptrack_token';
  private readonly UK = 'emptrack_user';

  private _token = signal<string | null>(localStorage.getItem(this.TK));
  private _user  = signal<User | null>(this._loadUser());

  readonly currentUser = this._user.asReadonly();
  readonly isLoggedIn  = computed(() => !!this._token());

  constructor(private router: Router) {}

  isAuthenticated(): boolean { return !!this._token(); }
  getToken(): string | null  { return this._token(); }

  setSession(token: string, user: User): void {
    localStorage.setItem(this.TK, token);
    localStorage.setItem(this.UK, JSON.stringify(user));
    this._token.set(token);
    this._user.set(user);
  }

  logout(): void {
    localStorage.removeItem(this.TK);
    localStorage.removeItem(this.UK);
    this._token.set(null);
    this._user.set(null);
    this.router.navigate(['/login']);
  }

  private _loadUser(): User | null {
    try { const r = localStorage.getItem(this.UK); return r ? JSON.parse(r) : null; }
    catch { return null; }
  }
<<<<<<< HEAD
}
=======
}
>>>>>>> 4c8a8b9a6444978bb654de3ea87c66b44c357391
