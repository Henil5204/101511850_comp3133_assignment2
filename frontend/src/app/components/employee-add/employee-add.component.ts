import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NavbarComponent } from '../navbar/navbar.component';
import { GraphqlService } from '../../services/graphql.service';

const DEPARTMENTS  = ['Engineering','Product','Design','Marketing','Sales','Human Resources','Finance','Operations','Legal','Customer Success'];
const DESIGNATIONS = ['Software Engineer','Senior Software Engineer','Lead Engineer','Engineering Manager','Product Manager','Product Designer','UX Researcher','Marketing Specialist','Sales Representative','HR Specialist','Financial Analyst','Operations Manager','DevOps Engineer','QA Engineer','Data Scientist','Director','Vice President'];
const GENDERS = ['Male','Female','Other'];

@Component({
  selector: 'app-employee-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MatSnackBarModule, NavbarComponent],
  templateUrl: './employee-add.component.html',
  styleUrls: ['./employee-add.component.scss']
})
export class EmployeeAddComponent {
  private fb     = inject(FormBuilder);
  private gql    = inject(GraphqlService);
  private router = inject(Router);
  private snack  = inject(MatSnackBar);

  step         = signal(1);
  loading      = signal(false);
  errorMsg     = signal('');
  photoPreview = signal<string | null>(null);
  dragOver     = signal(false);

  departments  = DEPARTMENTS;
  designations = DESIGNATIONS;
  genders      = GENDERS;

  form = this.fb.group({
    first_name:      ['', [Validators.required, Validators.minLength(2)]],
    last_name:       ['', [Validators.required, Validators.minLength(2)]],
    email:           ['', [Validators.required, Validators.email]],
    gender:          ['', Validators.required],
    date_of_joining: ['', Validators.required],
    department:      ['', Validators.required],
    designation:     ['', Validators.required],
    salary:          [null as number | null, [Validators.required, Validators.min(0)]],
    employee_photo:  ['']
  });

  get f() { return this.form.controls; }

  goNext() {
    ['first_name','last_name','email','gender','date_of_joining'].forEach(k => this.form.get(k)?.markAsTouched());
    const valid = ['first_name','last_name','email','gender','date_of_joining'].every(k => this.form.get(k)?.valid);
    if (valid) this.step.set(2);
  }

  goBack() { this.step.set(1); }

  onFileChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const r = reader.result as string;
      this.photoPreview.set(r);
      this.form.patchValue({ employee_photo: r });
    };
    reader.readAsDataURL(file);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.dragOver.set(false);
    const file = event.dataTransfer?.files[0];
    if (file?.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        const r = reader.result as string;
        this.photoPreview.set(r);
        this.form.patchValue({ employee_photo: r });
      };
      reader.readAsDataURL(file);
    }
  }

  removePhoto() {
    this.photoPreview.set(null);
    this.form.patchValue({ employee_photo: '' });
  }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);
    this.errorMsg.set('');
    const raw = this.form.value;
    this.gql.addEmployee({
      first_name:      raw.first_name!,
      last_name:       raw.last_name!,
      email:           raw.email!,
      gender:          raw.gender as 'Male' | 'Female' | 'Other',
      designation:     raw.designation!,
      department:      raw.department!,
      salary:          Number(raw.salary),
      date_of_joining: raw.date_of_joining!,
      employee_photo:  raw.employee_photo || null
    }).subscribe({
      next: emp => {
        this.snack.open(`${emp.first_name} ${emp.last_name} added successfully`, '', { duration: 3000 });
        this.router.navigate(['/employees']);
      },
      error: err => { this.loading.set(false); this.errorMsg.set(err.message ?? 'Failed to add employee'); },
      complete: () => this.loading.set(false)
    });
  }
}
