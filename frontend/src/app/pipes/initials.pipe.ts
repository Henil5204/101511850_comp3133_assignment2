import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'initials', standalone: true })
export class InitialsPipe implements PipeTransform {
  transform(first: string | null | undefined, last?: string | null | undefined): string {
    const f = first?.charAt(0)?.toUpperCase() ?? '';
    const l = last?.charAt(0)?.toUpperCase() ?? '';
    return `${f}${l}` || '?';
  }
<<<<<<< HEAD
}
=======
}
>>>>>>> 4c8a8b9a6444978bb654de3ea87c66b44c357391
