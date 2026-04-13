import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'initials', standalone: true })
export class InitialsPipe implements PipeTransform {
  transform(first: string | null | undefined, last?: string | null | undefined): string {
    const f = first?.charAt(0)?.toUpperCase() ?? '';
    const l = last?.charAt(0)?.toUpperCase() ?? '';
    return `${f}${l}` || '?';
  }
}