import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ModalManager } from '../../shared/modals/modal-manager';
import { Notification } from './../../shared/notification/notification';
import {CollaboratorProperty} from "../collaborator-property";
import {CollaboratorPropertyService} from "../collaborator-property.service";

@Component({
  selector: 'app-collaborator-property-list-details',
  templateUrl: './collaborator-property-list-details.component.html'
})
export class CollaboratorPropertyDetailsComponent implements OnInit {
    collaboratorProperty: CollaboratorProperty;

  constructor(private route: ActivatedRoute,
              private collaboratorPropertyService: CollaboratorPropertyService) { }

  ngOnInit() {
    Notification.clearErrors();
    this.route.data.forEach((data: {collaboratorProperty: CollaboratorProperty}) => {
      this.collaboratorProperty = data.collaboratorProperty;
    });
  }
}
