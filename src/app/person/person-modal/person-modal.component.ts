import { Person } from '../person';
import { PersonModalService } from './person-modal.service';
import { Subscription } from 'rxjs/Rx';
import { EventEmitter } from '@angular/forms/src/facade/async';
import { Component, Input, OnDestroy, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-person-modal',
  templateUrl: 'person-modal.component.html'
})

export class PersonModalComponent implements OnInit, OnDestroy {
  @Output() closePersonModal = new EventEmitter();
  @Output() selectPerson = new EventEmitter();
  @Input() bootMode: string;

  selectSubscription: Subscription;

  constructor(
    private service: PersonModalService,
  ) { }

  ngOnInit() {
    this.selectSubscription = this.service.select.subscribe((person) => {
      this.emitSelect(person);
    });

    this.verifyBootMode();
  }

  ngOnDestroy() {
    if (this.selectSubscription && !this.selectSubscription.closed) {
      this.selectSubscription.unsubscribe();
    }
  }

  emitSelect(person: string) {
    
    this.selectPerson.emit(person);
    (<any>jQuery)('.person-modal').modal('hide');
  }

  emitCloseModalPerson() {
    this.closePersonModal.emit();
    (<any>jQuery)('.person-modal').modal('hide');
  }

  get mode() {
    return this.service.mode;
  }

  get person() {
    return this.service.person;
  }

  get addressId(){
    return this.service.addressId;
  }

  get customerContactId(){
    return this.service.customerContactId;
  }

  get loading() {
    return this.service.loading;
  }

  verifyBootMode() {
    switch (this.bootMode) {
      case 'editable':
        this.service.bootMode = this.bootMode;
        this.service.editPerson(this.person);
        break;
      case 'default':
        this.service.reset();
        break;
      default:
        break;
    }
  }

}
