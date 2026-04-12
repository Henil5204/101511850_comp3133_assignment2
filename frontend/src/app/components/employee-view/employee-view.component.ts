import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NavbarComponent } from '../navbar/navbar.component';
import { GraphqlService, Employee } from '../../services/graphql.service';
import { SalaryFormatPipe } from '../../pipes/salary-format.pipe';
import { InitialsPipe } from '../../pipes/initials.pipe';

@Component({
  selector: 'app-employee-view',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe, MatSnackBarModule, NavbarComponent, SalaryFormatPipe, InitialsPipe],
  templateUrl: './employee-view.component.html',
  styleUrls: ['./employee-view.component.scss']
})
export class EmployeeViewComponent implements OnInit {
  private gql   = inject(GraphqlService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snack = inject(MatSnackBar);

  emp             = signal<Employee | null>(null);
  loading         = signal(true);
  errorMsg        = signal('');
  deleting        = signal(false);
  showDeleteModal = signal(false);

  monthly  = computed(() => this.emp() ? Math.round(this.emp()!.salary / 12) : 0);
  biweekly = computed(() => this.emp() ? Math.round(this.emp()!.salary / 26) : 0);

  tenure = computed(() => {
    const e = this.emp();
    if (!e?.date_of_joining) return '—';
    const start = new Date(e.date_of_joining);
    const now = new Date();
    const months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
    if (months < 1) return '< 1 month';
    if (months < 12) return `${months} month${months > 1 ? 's' : ''}`;
    const y = Math.floor(months / 12), m = months % 12;
    return m ? `${y}y ${m}mo` : `${y} year${y > 1 ? 's' : ''}`;
  });

  ngOnInit() {
    const eid = this.route.snapshot.paramMap.get('id')!;
    this.gql.searchEmployeeById(eid).subscribe({
      next: e  => { this.emp.set(e); this.loading.set(false); },
      error: err => { this.errorMsg.set(err.message ?? 'Failed to load'); this.loading.set(false); }
    });
  }

  edit() { this.router.navigate(['/employees/edit', this.emp()?._id]); }

  doDelete() {
    this.deleting.set(true);
    this.gql.deleteEmployee(this.emp()!._id!).subscribe({
      next: () => { this.snack.open('Employee deleted', '', { duration: 3000 }); this.router.navigate(['/employees']); },
      error: err => { this.deleting.set(false); this.showDeleteModal.set(false); this.snack.open(err.message ?? 'Delete failed', '', { duration: 3000 }); }
    });
  }
}
