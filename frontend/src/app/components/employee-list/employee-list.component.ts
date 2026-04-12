import { Component, OnInit, ViewChild, inject, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NavbarComponent } from '../navbar/navbar.component';
import { GraphqlService, Employee } from '../../services/graphql.service';
import { SalaryFormatPipe } from '../../pipes/salary-format.pipe';
import { InitialsPipe } from '../../pipes/initials.pipe';
import { HighlightDirective } from '../../directives/highlight.directive';
import { TooltipDirective } from '../../directives/tooltip.directive';

const DEPARTMENTS  = ['Engineering','Product','Design','Marketing','Sales','Human Resources','Finance','Operations','Legal','Customer Success'];
const DESIGNATIONS = ['Software Engineer','Senior Software Engineer','Lead Engineer','Engineering Manager','Product Manager','Product Designer','UX Researcher','Marketing Specialist','Sales Representative','HR Specialist','Financial Analyst','Operations Manager','DevOps Engineer','QA Engineer','Data Scientist','Director','Vice President'];

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink, DatePipe,
    MatTableModule, MatPaginatorModule, MatSortModule, MatSnackBarModule,
    NavbarComponent, SalaryFormatPipe, InitialsPipe,
    HighlightDirective, TooltipDirective
  ],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private gql    = inject(GraphqlService);
  private router = inject(Router);
  private snack  = inject(MatSnackBar);

  cols = ['name','department','designation','salary','gender','joined','actions'];
  ds   = new MatTableDataSource<Employee>([]);

  all        = signal<Employee[]>([]);
  loading    = signal(true);
  error      = signal('');
  searchTerm = signal('');
  deptFilter = signal('');
  desiFilter = signal('');
  deleteId   = signal<string | null>(null);

  departments  = DEPARTMENTS;
  designations = DESIGNATIONS;

  totalEmps = computed(() => this.all().length);
  avgSalary = computed(() => {
    const a = this.all();
    return a.length ? Math.round(a.reduce((s, e) => s + e.salary, 0) / a.length) : 0;
  });
  deptCount = computed(() => new Set(this.all().map(e => e.department)).size);

  newestEmp = computed<Employee | undefined>(() => {
    const arr = this.all();
    if (!arr.length) return undefined;
    return [...arr].sort((a, b) =>
      new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime()
    )[0];
  });

  hasFilter = computed(() => !!(this.searchTerm() || this.deptFilter() || this.desiFilter()));

  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    this.error.set('');
    this.gql.getAllEmployees().subscribe({
      next: emps => {
        this.all.set(emps);
        this.ds.data = emps;
        setTimeout(() => {
          this.ds.paginator = this.paginator;
          this.ds.sort = this.sort;
          this.ds.filterPredicate = this.buildPredicate();
        });
        this.loading.set(false);
      },
      error: err => { this.error.set(err.message ?? 'Failed to load'); this.loading.set(false); }
    });
  }

  onSearch(val: string) {
    this.searchTerm.set(val);
    this.deptFilter.set('');
    this.desiFilter.set('');
    this.ds.data = this.all();
    this.ds.filter = JSON.stringify({ term: val });
  }

  onDept(dept: string) {
    this.deptFilter.set(dept);
    this.searchTerm.set('');
    this.desiFilter.set('');
    if (dept) {
      this.loading.set(true);
      this.gql.searchByDepartment(dept).subscribe({
        next: emps => { this.ds.data = emps; this.loading.set(false); },
        error: () => this.loading.set(false)
      });
    } else {
      this.ds.data = this.all();
    }
  }

  onDesi(desi: string) {
    this.desiFilter.set(desi);
    this.deptFilter.set('');
    this.searchTerm.set('');
    if (desi) {
      this.loading.set(true);
      this.gql.searchByDesignation(desi).subscribe({
        next: emps => { this.ds.data = emps; this.loading.set(false); },
        error: () => this.loading.set(false)
      });
    } else {
      this.ds.data = this.all();
    }
  }

  clearAll() {
    this.searchTerm.set('');
    this.deptFilter.set('');
    this.desiFilter.set('');
    this.ds.data = this.all();
    this.ds.filter = '';
  }

  private buildPredicate() {
    return (row: Employee, filter: string) => {
      const f = JSON.parse(filter);
      const t = f.term?.toLowerCase() ?? '';
      if (!t) return true;
      return [row.first_name, row.last_name, row.email, row.designation, row.department]
        .some(v => v?.toLowerCase().includes(t));
    };
  }

  confirmDelete(id: string) { this.deleteId.set(id); }
  cancelDelete()            { this.deleteId.set(null); }

  doDelete() {
    const id = this.deleteId()!;
    this.gql.deleteEmployee(id).subscribe({
      next: () => {
        this.deleteId.set(null);
        this.snack.open('Employee deleted', '', { duration: 3000 });
        this.load();
      },
      error: err => {
        this.deleteId.set(null);
        this.snack.open(err.message ?? 'Delete failed', '', { duration: 3000 });
      }
    });
  }

  view(id: string) { this.router.navigate(['/employees/view', id]); }
  edit(id: string) { this.router.navigate(['/employees/edit', id]); }
  add()            { this.router.navigate(['/employees/add']); }
}
