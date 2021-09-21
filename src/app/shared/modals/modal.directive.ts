import { Directive, ElementRef, AfterViewInit, Input, Output, EventEmitter  } from '@angular/core';

@Directive({
  selector: '[appModal]'
})
export class ModalDirective implements AfterViewInit{
  @Output() close = new EventEmitter();
  @Input() shownCallback: Function;

  constructor(private element: ElementRef) {}

  ngAfterViewInit() {
    let modal: any = jQuery(this.element.nativeElement);
    modal.modal('show');
    modal.on('hidden.bs.modal', (e) => {
      this.close.emit(null);
    });
    modal.on('shown.bs.modal', () => {
      modal.find('.modal-body').css('overflow-y', 'auto');
      modal.find('.modal-body').css('max-height', jQuery(window).height() * 0.8);
      if (this.shownCallback) {
        this.shownCallback();
      }
    });
  }
}
