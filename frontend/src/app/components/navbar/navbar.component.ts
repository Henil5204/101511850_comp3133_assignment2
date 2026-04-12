import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
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
      <div class="brand-dot"></div>
      <span>EmpTrack</span>
    </a>

    <nav class="nav-links">
      <a routerLink="/employees" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">Employees</a>
      <a routerLink="/employees/add" routerLinkActive="active">Add Employee</a>
    </nav>

    <div class="nav-right">
      <div class="user-menu" (click)="open.set(!open())" tabindex="0"
           (keydown.enter)="open.set(!open())" (keydown.escape)="open.set(false)">
        <div class="avatar avatar-sm">{{ auth.currentUser()?.username ?? '' | initials }}</div>
        <span class="user-name hide-mobile">{{ auth.currentUser()?.username }}</span>
        <span class="material-icons" style="font-size:16px;color:var(--text-muted)">expand_more</span>

        @if (open()) {
          <div class="dropdown" (click)="$event.stopPropagation()">
            <div class="dropdown-header">
              <p class="dh-name">{{ auth.currentUser()?.username }}</p>
              <p class="dh-email">{{ auth.currentUser()?.email }}</p>
            </div>
            <div class="dd-divider"></div>
            <a class="dd-item" routerLink="/employees" (click)="open.set(false)">
              <span class="material-icons-outlined">group</span> Employees
            </a>
            <a class="dd-item" routerLink="/employees/add" (click)="open.set(false)">
              <span class="material-icons-outlined">person_add</span> Add employee
            </a>
            <div class="dd-divider"></div>
            <button class="dd-item danger" (click)="auth.logout()">
              <span class="material-icons-outlined">logout</span> Sign out
            </button>
          </div>
        }
      </div>
    </div>
  </div>
</header>
@if (open()) { <div class="nav-backdrop" (click)="open.set(false)"></div> }
  `,
  styles: [`
    .nav { height: 52px; background: var(--bg-elevated); border-bottom: 1px solid var(--border); position: sticky; top: 0; z-index: 100; }
    .nav-inner { height: 100%; max-width: 1200px; margin: 0 auto; padding: 0 32px; display: flex; align-items: center; gap: 24px; }
    @media(max-width:768px) { .nav-inner { padding: 0 16px; } }
    .nav-brand { display: flex; align-items: center; gap: 8px; text-decoration: none; font-size: 0.9375rem; font-weight: 600; color: var(--text-primary); flex-shrink: 0; }
    .brand-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--accent); }
    .nav-links { display: flex; align-items: center; gap: 4px; flex: 1; }
    @media(max-width:600px) { .nav-links { display: none; } }
    .nav-links a { font-size: 0.8125rem; font-weight: 500; color: var(--text-secondary); text-decoration: none; padding: 4px 10px; border-radius: var(--r-md); transition: color var(--t), background var(--t); }
    .nav-links a:hover { color: var(--text-primary); background: rgba(255,255,255,0.04); }
    .nav-links a.active { color: var(--text-primary); background: rgba(255,255,255,0.06); }
    .nav-right { margin-left: auto; }
    .user-menu { position: relative; display: flex; align-items: center; gap: 8px; cursor: pointer; padding: 4px 8px 4px 4px; border-radius: var(--r-lg); border: 1px solid transparent; transition: all var(--t); outline: none; }
    .user-menu:hover, .user-menu:focus { background: var(--bg-surface); border-color: var(--border); }
    .user-name { font-size: 0.8125rem; font-weight: 500; color: var(--text-primary); }
    .dropdown { position: absolute; top: calc(100% + 6px); right: 0; min-width: 200px; background: var(--bg-elevated); border: 1px solid var(--border); border-radius: var(--r-xl); box-shadow: var(--shadow-lg); z-index: 101; overflow: hidden; animation: dropIn 0.1s ease; }
    @keyframes dropIn { from { opacity:0; transform:translateY(-4px); } to { opacity:1; transform:translateY(0); } }
    .dropdown-header { padding: 12px 14px 10px; }
    .dh-name { font-size: 0.8125rem; font-weight: 600; color: var(--text-primary); }
    .dh-email { font-size: 0.75rem; color: var(--text-muted); margin-top: 1px; }
    .dd-divider { height: 1px; background: var(--border); }
    .dd-item { display: flex; align-items: center; gap: 8px; padding: 9px 14px; font-size: 0.8125rem; font-weight: 500; color: var(--text-secondary); text-decoration: none; cursor: pointer; background: none; border: none; width: 100%; text-align: left; transition: background var(--t), color var(--t); font-family: var(--font); }
    .dd-item .material-icons-outlined { font-size: 15px; }
    .dd-item:hover { background: rgba(255,255,255,0.04); color: var(--text-primary); }
    .dd-item.danger { color: var(--red); } .dd-item.danger:hover { background: rgba(248,113,113,0.08); }
    .nav-backdrop { position: fixed; inset: 0; z-index: 100; }
    .hide-mobile { } @media(max-width:600px){ .hide-mobile { display:none; } }
  `]
})
export class NavbarComponent {
  auth = inject(AuthService);
  open = signal(false);
}
