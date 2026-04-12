import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { GraphqlService } from '../../services/graphql.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MatSnackBarModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private fb    = inject(FormBuilder);
  private gql   = inject(GraphqlService);
  private auth  = inject(AuthService);
  private snack = inject(MatSnackBar);

  loading  = signal(false);
  showPw   = signal(false);
  errorMsg = signal('');

  form = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  get f() { return this.form.controls; }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);
    this.errorMsg.set('');
    const { username, password } = this.form.value;
    this.gql.login(username!, password!).subscribe({
      next: res => {
        this.auth.setSession(res.token, res.user);
        this.snack.open(`Welcome back, ${res.user.username}!`, '', { duration: 3000 });
      },
      error: err => { this.loading.set(false); this.errorMsg.set(err.message ?? 'Login failed'); },
      complete: () => this.loading.set(false)
    });
  }
}
