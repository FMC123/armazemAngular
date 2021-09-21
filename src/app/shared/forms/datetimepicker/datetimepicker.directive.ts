import { Directive, ElementRef, Host, Input, OnDestroy, OnInit, Optional, SkipSelf } from '@angular/core';
import { ControlContainer } from '@angular/forms';

@Directive({
  selector: '[appDateTimePicker]'
})
export class DateTimePickerDirective implements OnInit, OnDestroy {

  @Input('formControlName') controlName;

  constructor(private el: ElementRef,
              @Optional() @Host() @SkipSelf() private parent: ControlContainer) { }

  get control(){
    return (<any>this.parent.formDirective).control.controls[this.controlName];
  }

  ngOnInit() {
    let $el: any = jQuery(this.el.nativeElement).parent();
    $el.datetimepicker({
            locale: 'pt-br',
            //format: 'L',
            tooltips: {
              today: 'Ir para Hoje',
              clear: 'Limpar seleção',
              close: 'Fechar',
              selectMonth: 'Selecionar Mês',
              prevMonth: 'Mês Anterior',
              nextMonth: 'Próximo Mês',
              selectYear: 'Selecionar Ano',
              prevYear: 'Ano Anterior',
              nextYear: 'Próximo Ano',
              selectDecade: 'Selecionar Década',
              prevDecade: 'Década Anterior',
              nextDecade: 'Próxima Década',
              prevCentury: 'Século Anterior',
              nextCentury: 'Próximo Século'
            }
          });
      let _this = this;
      jQuery(this.el.nativeElement).on('blur', function(){
        _this.control.setValue(this.value);
      });
   }

   ngOnDestroy(){
     jQuery(this.el.nativeElement).off();
   }
}
