import { Observable } from 'rxjs/Rx';
import { ErrorHandler } from '../../../shared/errors/error-handler';
import { PersonService } from '../../person.service';
import { PersonModalService } from '../person-modal.service';
import * as console from 'console';
import { ModalManager } from '../../../shared/modals/modal-manager';
import { Person } from '../../person';
import { Component, Input, OnInit, forwardRef } from '@angular/core';
import {
    AbstractControl,
    ControlValueAccessor,
    FormControl,
    NG_VALIDATORS,
    NG_VALUE_ACCESSOR,
    Validator,
} from '@angular/forms';

@Component({
  selector: 'app-person-modal-find',
  templateUrl: 'person-modal-find.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PersonModalFindComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => PersonModalFindComponent),
      multi: true,
    }],
})

export class PersonModalFindComponent implements OnInit, ControlValueAccessor, Validator {
  @Input() bootMode: string;
  loading = false;
  personModalManager: ModalManager = new ModalManager();
  person: Person;

  constructor(
    private service: PersonModalService,
    private personService: PersonService,
    private errorHandler: ErrorHandler,
  ) { }

  ngOnInit() {
  }

  selectPerson(id) {
    if (id) {
      this.loadPerson(id);
      this.propagateChange(id);
    } else {
      this.propagateChange(null);
    }
  }

  writeValue(obj: any): void {
    let id = obj;
    if (!id) {
      this.person = null;
      return;
    }
    this.loadPerson(id);
  };

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  };

  registerOnTouched(fn: any): void { };

  private propagateChange = (_: any) => { };

  public validate(c: FormControl) {
    return null;
  }

  private handleCriticalError(error) {
    this.handleError(error).catch(() => {
      //TODO error
    });
  }

  private handleError(error) {
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }

  loadPerson(id: string){
    this.person = new Person();
    this.loading = true;
    return this.personService.find(id).then(person => {
      if (person) {
        this.person = person;
      }
      this.loading = false;
    }).catch((error) => this.handleCriticalError(error));
  }

  get editable() {
    return 'editable' === this.bootMode;
  }

  editableForm() {
    this.service.person = this.person;
    this.personModalManager.open(null);
  }

}
