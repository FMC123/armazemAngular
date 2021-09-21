import { CertificateService } from '../certificate.service';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Notification } from './../../shared/notification/notification';
import { Certificate } from '../certificate';

@Component({
  selector: 'app-certificate-list-details',
  templateUrl: './certificate-list-details.component.html'
})
export class CertificateDetailsComponent implements OnInit {
  certificate: Certificate;

  constructor(private route: ActivatedRoute,
              private certificateService: CertificateService) { }

  ngOnInit() {
    Notification.clearErrors();
    this.route.data.forEach((data: {certificate: Certificate}) => {
      this.certificate = data.certificate;
    });
  }

}
