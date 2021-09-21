import { ModalManager } from '../../shared/modals/modal-manager';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Notification } from '../../shared/notification/notification';
import { IncidentMotive } from '../incident-motive';
import { IncidentMotiveService } from '../incident-motive.service';

@Component({
  selector: 'app-incident-control-list-details',
  templateUrl: './incident-motive-list-details.component.html'
})
export class IncidentMotiveDetailsComponent implements OnInit {
  incidentMotive: IncidentMotive;

  constructor(private route: ActivatedRoute,
    private motiveControlService: IncidentMotiveService) { }

  ngOnInit() {
    Notification.clearErrors();
    this.route.data.forEach((data: { incidentMotive: IncidentMotive }) => {
      this.incidentMotive = data.incidentMotive;
    });
  }

}
