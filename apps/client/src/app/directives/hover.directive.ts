import { DOCUMENT } from '@angular/common';
import {
  Directive,
  ElementRef,
  HostListener,
  Inject,
  Input,
} from '@angular/core';

@Directive({
  selector: '[uniHovered]',
})
export class HoverDirective {
  @Input() border = '2px solid blue';

  constructor(
    private element: ElementRef,
    @Inject(DOCUMENT) private document: Document
  ) {}

  @HostListener('focus') onHover() {
    this.element.nativeElement.parentElement.style.border = this.border;
  }

  @HostListener('blur') onBlur() {
    this.element.nativeElement.parentElement.style.border = '';
  }
}
