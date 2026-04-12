import { Directive, ElementRef, HostListener, Input, OnDestroy, Renderer2 } from '@angular/core';

@Directive({ selector: '[appTooltip]', standalone: true })
export class TooltipDirective implements OnDestroy {
  @Input('appTooltip') text = '';
  private tip: HTMLElement | null = null;

  constructor(private el: ElementRef, private r: Renderer2) {}

  @HostListener('mouseenter') show() {
    if (!this.text) return;
    this.tip = this.r.createElement('div');
    this.r.appendChild(document.body, this.tip!);
    this.tip!.textContent = this.text;
    Object.assign(this.tip!.style, {
      position: 'fixed', background: '#1f2233', color: '#e8eaf0',
      padding: '4px 10px', borderRadius: '5px', fontSize: '0.75rem',
      pointerEvents: 'none', zIndex: '9999', whiteSpace: 'nowrap',
      border: '1px solid #2a2d3e', boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
    });
    const r = (this.el.nativeElement as HTMLElement).getBoundingClientRect();
    Object.assign(this.tip!.style, {
      top: `${r.top - 32}px`,
      left: `${r.left + r.width / 2}px`,
      transform: 'translateX(-50%)'
    });
  }

  @HostListener('mouseleave') hide() { this.remove(); }
  ngOnDestroy() { this.remove(); }
  private remove() {
    if (this.tip) { this.r.removeChild(document.body, this.tip); this.tip = null; }
  }
}