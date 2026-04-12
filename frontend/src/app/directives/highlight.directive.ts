import { Directive, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';

@Directive({ selector: '[appHighlight]', standalone: true })
export class HighlightDirective implements OnChanges {
  @Input('appHighlight') term = '';
  constructor(private el: ElementRef, private r: Renderer2) {}
  ngOnChanges(): void {
    const el = this.el.nativeElement as HTMLElement;
    const txt = el.textContent?.toLowerCase() ?? '';
    const t = this.term?.toLowerCase().trim();
    if (t && txt.includes(t)) {
      this.r.setStyle(el, 'background', 'rgba(79,142,247,0.18)');
      this.r.setStyle(el, 'border-radius', '3px');
    } else {
      this.r.removeStyle(el, 'background');
      this.r.removeStyle(el, 'border-radius');
    }
  }
}
