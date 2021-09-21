import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

import {Autocomplete} from './autocomplete';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
})
export class AutocompleteComponent implements OnInit, OnChanges {
  @Input() service: Autocomplete;
  @Input() instant = false;
  @Input() placeHolder: string = '';
  @Output() output: EventEmitter<string> = new EventEmitter();
  @Input() disabled = false;
  @Input() loading = false;
  @Input() hideClearButton:boolean = false;
  form: FormGroup;

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.buildForm();
  }

  clean(autocompleteEl) {
    this.service.clean(autocompleteEl)
    this.output.emit('');
  }

  buildForm() {
    this.form = this.formBuilder.group({
      'autocomplete': ['']
    });
    this.service.mount(this.form.get('autocomplete'));
  }

  emitInput({target: {value: input}}) {
    this.output.emit(input);
  }

  ngOnChanges(changes): void {
    if (!this.form) {
      this.buildForm();
    }

    setTimeout(() => {
      if ((changes.disabled && changes.disabled.currentValue) || this.loading) {
        this.form.controls['autocomplete'].disable();
      } else {
        this.form.controls['autocomplete'].enable();
      }
    });
  }
}
