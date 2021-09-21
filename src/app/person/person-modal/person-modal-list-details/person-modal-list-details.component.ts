import { PersonModalService } from '../person-modal.service';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ModalManager } from '../../../shared/modals/modal-manager';
import { Person } from '../../person';
import { PersonService } from '../../person.service';
import { Notification } from './../../../shared/notification/notification';


@Component({
  selector: 'app-person-modal-list-details',
  templateUrl: './person-modal-list-details.component.html'
})
export class PersonModalListDetailsComponent {
  @Input() returnActive: boolean;
  @Input() person: Person;

  constructor(
    private personService: PersonService,
    private personModalService: PersonModalService,
  ) { }

  returList() {
    this.personModalService.reset();
  }

}
