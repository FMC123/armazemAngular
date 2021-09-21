import { ModalManager } from '../../shared/modals/modal-manager';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Notification } from './../../shared/notification/notification';
import {Company} from '../company';
import {CompanyService} from '../company.service';

@Component({
  selector: 'app-company-list-details',
  templateUrl: './company-list-details.component.html'
})
export class CompanyDetailsComponent implements OnInit {
  company: Company;

  constructor(private route: ActivatedRoute,
              private companyService: CompanyService) { }

  ngOnInit() {
    Notification.clearErrors();
    this.route.data.forEach((data: {company: Company}) => {
      this.company = data.company;
    });
  }

}
