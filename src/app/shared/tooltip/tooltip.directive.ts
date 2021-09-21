import {
	AfterViewInit,
	Directive,
	ElementRef,
	Input,
	OnDestroy
} from '@angular/core';

@Directive({
	selector: '[appTooltip]'
})
export class TooltipDirective implements AfterViewInit, OnDestroy {
	@Input() appTooltip: string;
	@Input() placement: 'top' | 'bottom' | 'left' | 'right' | 'auto' = 'top';

	constructor(private element: ElementRef) {}

	ngAfterViewInit() {
		let $el: any = jQuery(this.element.nativeElement);
		$el.prop('title', this.appTooltip);
		$el.tooltip({ trigger: 'hover', placement: this.placement });
	}

	ngOnDestroy() {
		let $el: any = jQuery(this.element.nativeElement);
		$el.tooltip('hide');
	}
}
