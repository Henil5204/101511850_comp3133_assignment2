import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NavbarComponent } from '../navbar/navbar.component';
import { GraphqlService, Employee } from '../../services/graphql.service';

const DEPARTMENTS  = ['Engineering','Product','Design','Marketing','Sales','Human Resources','Finance','Operations','Legal','Customer Success'];
const DESIGNATIONS = ['Software Engineer','Senior Software Engineer','Lead Engineer','Engineering Manager','Product Manager','Product Designer','UX Researcher','Marketing Specialist','Sales Representative','HR Specialist','Financial Analyst','Operations Manager','DevOps Engineer','QA Engineer','Data Scientist','Director','Vice President'];
const GENDERS = ['Male','Female','Other'];

@Component({
  selector: 'app-employee-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MatSnackBarModule, NavbarComponent],
  templateUrl: './employee-edit.component.html',
  styleUrls: ['../employee-add/employee-add.component.scss']
})
export class EmployeeEditComponent implements OnInit {
  private fb     = inject(FormBuilder);
  private gql    = inject(GraphqlService);
  private route  = inject(ActivatedRoute);
  private router = inject(Router);
  private snack  = inject(MatSnackBar);

  loading      = signal(true);
  saving       = signal(false);
  errorMsg     = signal('');
  employee     = signal<Employee | null>(null);
  photoPreview = signal<string | null>(null);

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

  ngOnInit() {
    const eid = this.route.snapshot.paramMap.get('id')!;
    this.gql.searchEmployeeById(eid).subscribe({
      next: emp => {
        this.employee.set(emp);
        this.form.patchValue({ ...emp, date_of_joining: emp.date_of_joining?.split('T')[0] ?? emp.date_of_joining, salary: emp.salary });
        if (emp.employee_photo) this.photoPreview.set(emp.employee_photo);
        this.loading.set(false);
      },
      error: err => { this.errorMsg.set(err.message ?? 'Failed to load'); this.loading.set(false); }
    });
  }

  onFileChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { const r = reader.result as string; this.photoPreview.set(r); this.form.patchValue({ employee_photo: r }); };
    reader.readAsDataURL(file);
  }

  removePhoto() { this.photoPreview.set(null); this.form.patchValue({ employee_photo: '' }); }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving.set(true); this.errorMsg.set('');
    const raw = this.form.value;
    const eid = this.employee()?._id!;
    const updates: Partial<Employee> = {
      first_name:      raw.first_name      ?? undefined,
      last_name:       raw.last_name       ?? undefined,
      email:           raw.email           ?? undefined,
      gender:          (raw.gender         ?? undefined) as Employee['gender'],
      date_of_joining: raw.date_of_joining ?? undefined,
      department:      raw.department      ?? undefined,
      designation:     raw.designation     ?? undefined,
      salary:          raw.salary != null  ? Number(raw.salary) : undefined,
      employee_photo:  raw.employee_photo  ?? undefined,
    };
    this.gql.updateEmployee(eid, updates).subscribe({
      next: emp => { this.snack.open(`${emp.first_name} ${emp.last_name} updated`, '', { duration: 3000 }); this.router.navigate(['/employees']); },
      error: err => { this.saving.set(false); this.errorMsg.set(err.message ?? 'Update failed'); },
      complete: () => this.saving.set(false)
    });
  }
}
