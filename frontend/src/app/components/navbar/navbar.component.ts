import { Component, inject, signal, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { InitialsPipe } from '../../pipes/initials.pipe';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, InitialsPipe],
  template: `
<header class="nav">
  <div class="nav-inner">

    <a class="nav-brand" routerLink="/employees">
      <div class="brand-logo">
        <span class="material-icons" style="font-size:16px;color:#0f0f23">hub</span>
      </div>
      <span class="brand-name">Emp<span class="brand-accent">Track</span></span>
    </a>

    <nav class="nav-links">
      <a routerLink="/employees" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">
        <span class="material-icons-outlined" style="font-size:16px">group</span>
        Employees
      </a>
      <a routerLink="/employees/add" routerLinkActive="active">
        <span class="material-icons-outlined" style="font-size:16px">person_add</span>
        Add Employee
      </a>
    </nav>

    <div class="nav-right">
      <button class="user-pill" (click)="toggleMenu()">
        <div class="avatar avatar-sm">{{ auth.currentUser()?.username ?? '' | initials }}</div>
        <span class="user-name hide-mobile">{{ auth.currentUser()?.username }}</span>
        <span class="material-icons" style="font-size:15px;color:var(--text-muted)">expand_more</span>
      </button>

      @if (open()) {
        <div class="dropdown">
          <div class="dropdown-user">
            <div class="avatar avatar-md" style="flex-shrink:0">{{ auth.currentUser()?.username ?? '' | initials }}</div>
            <div>
              <p class="du-name">{{ auth.currentUser()?.username }}</p>
              <p class="du-email">{{ auth.currentUser()?.email }}</p>
            </div>
          </div>
          <div class="dd-sep"></div>
          <a class="dd-item" routerLink="/employees" (click)="closeMenu()">
            <span class="material-icons-outlined">group</span> All Employees
          </a>
          <a class="dd-item" routerLink="/employees/add" (click)="closeMenu()">
            <span class="material-icons-outlined">person_add</span> Add Employee
          </a>
          <div class="dd-sep"></div>
          <button class="dd-item logout" (click)="logout()">
            <span class="material-icons-outlined">logout</span> Sign Out
          </button>
        </div>
      }
    </div>
  </div>
  <div class="nav-progress"></div>
</header>
  `,
  styles: [`
    .nav {
      height: 56px;
      background: rgba(22,33,62,0.95);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border);
      position: sticky; top: 0; z-index: 100;
    }
    .nav-progress {
      height: 2px;
      background: linear-gradient(90deg, var(--accent), var(--teal), var(--pink));
      background-size: 200% 100%;
      animation: shimmer 3s ease infinite;
    }
    @keyframes shimmer { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }

    .nav-inner { height:100%; max-width:1280px; margin:0 auto; padding:0 24px; display:flex; align-items:center; gap:20px; }
    @media(max-width:768px){ .nav-inner { padding:0 16px; } }

    .nav-brand { display:flex; align-items:center; gap:10px; text-decoration:none; flex-shrink:0; }
    .brand-logo { width:32px; height:32px; border-radius:10px; background:linear-gradient(135deg,var(--accent),var(--teal)); display:flex; align-items:center; justify-content:center; box-shadow:0 2px 10px rgba(124,106,247,0.4); }
    .brand-name { font-size:1rem; font-weight:700; color:var(--text-primary); letter-spacing:-0.01em; }
    .brand-accent { color:var(--accent); }

    .nav-links { display:flex; align-items:center; gap:2px; flex:1; }
    @media(max-width:600px){ .nav-links { display:none; } }
    .nav-links a { display:flex; align-items:center; gap:6px; font-size:0.8125rem; font-weight:500; color:var(--text-secondary); text-decoration:none; padding:6px 12px; border-radius:var(--r-md); transition:all var(--t); }
    .nav-links a:hover { color:var(--text-primary); background:rgba(255,255,255,0.06); }
    .nav-links a.active { color:var(--accent); background:var(--accent-dim); }

    .nav-right { margin-left:auto; position:relative; }

    .user-pill { display:flex; align-items:center; gap:8px; cursor:pointer; padding:4px 10px 4px 4px; border-radius:999px; border:1px solid transparent; background:none; transition:all var(--t); font-family:var(--font); }
    .user-pill:hover { background:var(--bg-surface); border-color:var(--accent-border); }
    .user-name { font-size:0.8125rem; font-weight:600; color:var(--text-primary); }

    .dropdown { position:absolute; top:calc(100% + 8px); right:0; min-width:220px; background:var(--bg-card); border:1px solid var(--border); border-radius:var(--r-xl); box-shadow:0 16px 48px rgba(0,0,0,0.6); z-index:200; overflow:hidden; animation:dropIn 0.15s ease; }
    @keyframes dropIn { from{opacity:0;transform:translateY(-6px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }

    .dropdown-user { display:flex; align-items:center; gap:10px; padding:14px 16px; }
    .du-name  { font-size:0.875rem; font-weight:700; color:var(--text-primary); }
    .du-email { font-size:0.75rem; color:var(--text-muted); margin-top:1px; }
    .dd-sep   { height:1px; background:var(--border); }

    .dd-item { display:flex; align-items:center; gap:10px; padding:10px 16px; font-size:0.8125rem; font-weight:500; color:var(--text-secondary); text-decoration:none; cursor:pointer; background:none; border:none; width:100%; text-align:left; transition:all var(--t-fast); font-family:var(--font); }
    .dd-item .material-icons-outlined { font-size:16px; color:var(--accent); }
    .dd-item:hover { background:var(--accent-dim); color:var(--text-primary); }
    .dd-item.logout { color:var(--red); }
    .dd-item.logout .material-icons-outlined { color:var(--red); }
    .dd-item.logout:hover { background:rgba(239,68,68,0.1); }

    .hide-mobile {} @media(max-width:600px){ .hide-mobile { display:none; } }
  `]
})
export class NavbarComponent {
  auth   = inject(AuthService);
  router = inject(Router);
  open   = signal(false);

  toggleMenu(): void { this.open.update(v => !v); }
  closeMenu():  void { this.open.set(false); }

  logout(): void {
    this.open.set(false);
    this.auth.logout();
  }

  // Close dropdown when clicking anywhere outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('app-navbar')) {
      this.open.set(false);
    }
  }
}