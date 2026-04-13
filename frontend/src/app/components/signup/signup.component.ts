import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { GraphqlService } from '../../services/graphql.service';
import { AuthService } from '../../services/auth.service';

function pwMatch(c: AbstractControl): ValidationErrors | null {
  const a = c.get('password')?.value, b = c.get('confirm')?.value;
  return a && b && a !== b ? { mismatch: true } : null;
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MatSnackBarModule],
  templateUrl: './signup.component.html',
  styleUrls: ['../login/login.component.scss']
})
export class SignupComponent {
  private fb    = inject(FormBuilder);
  private gql   = inject(GraphqlService);
  private auth  = inject(AuthService);
  private snack = inject(MatSnackBar);

  loading  = signal(false);
  showPw   = signal(false);
  errorMsg = signal('');

  form = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email:    ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirm:  ['', Validators.required]
  }, { validators: pwMatch });

  get f() { return this.form.controls; }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);
    this.errorMsg.set('');
    const { username, email, password } = this.form.value;
    this.gql.signup(username!, email!, password!).subscribe({
      next: res => {
        this.auth.setSession(res.token, res.user);
        this.snack.open(`Welcome, ${res.user.username}!`, '', { duration: 3000 });
      },
      error: err => { this.loading.set(false); this.errorMsg.set(err.message ?? 'Registration failed'); },
      complete: () => this.loading.set(false)
    });
  }
}