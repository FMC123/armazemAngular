import {Component, EventEmitter, Input, OnInit, Output, ViewChildren} from "@angular/core";
import {Focusable} from "../../shared/forms/focusable/focusable.directive";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ErrorHandler} from "../../shared/errors/error-handler";
import {Masks} from "../../shared/forms/masks/masks";
import {RetentionService} from "../retention.service";
import {Retention} from "../retention";
import {Notification} from "../../shared/notification";

@Component({
  selector: 'app-warrant-control-prorogation-modal',
  templateUrl: './warrant-control-prorogation-modal.component.html'
})
export class WarrantControlProrogationModalComponent implements OnInit {
  @ViewChildren(Focusable) focusables;
  @Input() value: string;
  @Output() confirm = new EventEmitter<string>();
  @Output() close: EventEmitter<string> = new EventEmitter<any>();

  form: FormGroup;
  dateMask = Masks.dateMask;
  loading = false;

  retention:Retention;

  constructor(private formBuilder: FormBuilder,
              private retentionService:RetentionService,
              private errorHandler: ErrorHandler) {
  }

  ngOnInit() {
    this.retention = new Retention();
    this.buildForm();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      expiresExtension: ['' , [Validators.required]],
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

    this.confirm.emit(this.form.value.expiresExtension);

    (<any>jQuery)('.modal').modal('hide');
  }

}
