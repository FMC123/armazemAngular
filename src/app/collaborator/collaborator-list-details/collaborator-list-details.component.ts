import { ModalManager } from '../../shared/modals/modal-manager';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Notification } from './../../shared/notification/notification';
import {Collaborator} from "../collaborator";
import {CollaboratorService} from "../collaborator.service";

@Component({
  selector: 'app-collaborator-list-details',
  templateUrl: './collaborator-list-details.component.html'
})
export class collaboratorDetailsComponent implements OnInit {
  collaborator: Collaborator;

  constructor(private route: ActivatedRoute,
              private collaboratorService: CollaboratorService) { }

  ngOnInit() {
    Notification.clearErrors();
    this.route.data.forEach((data: {collaborator: Collaborator}) => {
      this.collaborator = data.collaborator;
    });
  }

}
