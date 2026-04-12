import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'salaryFormat', standalone: true })
export class SalaryFormatPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value == null || isNaN(value)) return '—';
    return new Intl.NumberFormat('en-CA', {
      style: 'currency', currency: 'CAD', minimumFractionDigits: 0
    }).format(value);
  }
}