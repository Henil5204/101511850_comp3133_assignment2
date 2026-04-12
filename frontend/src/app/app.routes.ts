import { Routes } from '@angular/router';
import { authGuard, loginGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    canActivate: [loginGuard],
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent),
    title: 'Sign In · EmpTrack'
  },
  {
    path: 'signup',
    canActivate: [loginGuard],
    loadComponent: () => import('./components/signup/signup.component').then(m => m.SignupComponent),
    title: 'Sign Up · EmpTrack'
  },
  {
    path: 'employees',
    canActivate: [authGuard],
    loadComponent: () => import('./components/employee-list/employee-list.component').then(m => m.EmployeeListComponent),
    title: 'Employees · EmpTrack'
  },
  {
    path: 'employees/add',
    canActivate: [authGuard],
    loadComponent: () => import('./components/employee-add/employee-add.component').then(m => m.EmployeeAddComponent),
    title: 'Add Employee · EmpTrack'
  },
  {
    path: 'employees/edit/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./components/employee-edit/employee-edit.component').then(m => m.EmployeeEditComponent),
    title: 'Edit Employee · EmpTrack'
  },
  {
    path: 'employees/view/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./components/employee-view/employee-view.component').then(m => m.EmployeeViewComponent),
    title: 'Employee · EmpTrack'
  },
  { path: '**', redirectTo: 'employees' }
];
