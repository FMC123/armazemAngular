import { Directive, OnInit, ElementRef, Inject } from '@angular/core';

@Directive({
  selector: '[focusable]',
})
export class Focusable {
    constructor(@Inject(ElementRef) private element: ElementRef) {}
    public focus() {
        this.element.nativeElement.focus();
    }
}
