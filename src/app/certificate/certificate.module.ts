import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { CertificateFormComponent } from './certificate-form/certificate-form.component';
import { CertificateDetailsComponent } from './certificate-list-details/certificate-list-details.component';
import { CertificateListInfoComponent } from './certificate-list-details/certificate-list-info.component';
import { CertificateListComponent } from './certificate-list/certificate-list.component';
import { CertificateRoutingModule } from './certificate-routing.module';
import { CertificateService } from './certificate.service';

@NgModule({
  imports: [
    SharedModule,
    CertificateRoutingModule
  ],
  declarations: [
    CertificateFormComponent,
    CertificateListComponent,
    CertificateListInfoComponent,
    CertificateDetailsComponent
  ],
  providers: [
    CertificateService,
  ]
})
export class CertificateModule { }
