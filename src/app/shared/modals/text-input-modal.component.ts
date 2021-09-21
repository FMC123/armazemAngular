import {Component, EventEmitter, Input, OnInit, Output, ViewChildren} from "@angular/core";
import {Focusable} from "../../shared/forms/focusable/focusable.directive";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ErrorHandler} from "../../shared/errors/error-handler";

@Component({
  selector: 'app-text-input-modal',
  templateUrl: './text-input-modal.component.html'
})
export class TextInputComponent implements OnInit {
  @ViewChildren(Focusable) focusables;
  @Input() title: string;
  @Input() description: string;
  @Input() value: string;
  @Input() required: boolean = true;
  @Output() confirm = new EventEmitter();
  @Output() close: EventEmitter<any> = new EventEmitter<any>();

  form: FormGroup;
  loading = false;

  constructor(private formBuilder: FormBuilder,
              private errorHandler: ErrorHandler) {
  }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      description: [this.value ? this.value : '' , this.required ? [Validators.required] : [] ],
    });
  }

  focusOnInput() {
    return () => {
      if (this.focusables && this.focusables.length > 0) {
        this.focusables.first.focus();
      }
    };
  }

  submit() {
    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
    });
    if (!this.form.valid) {
      return;
    }
    this.confirm.emit(this.form.value.description);
    (<any>jQuery)('.modal').modal('hide');
  }

}
