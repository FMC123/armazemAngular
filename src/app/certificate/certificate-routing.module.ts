import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';

import { CertificateFormComponent } from './certificate-form/certificate-form.component';
import { CertificateListComponent } from './certificate-list/certificate-list.component';
import { CertificateFormResolve } from './certificate-form/certificate-form-resolve.service';
import { LayoutComponent } from 'app/layout/layout.component';
import { CertificateDetailsResolve } from './certificate-list-details/certificate-list-details-resolve.service';
import { CertificateDetailsComponent } from './certificate-list-details/certificate-list-details.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'certificate',
        component: LayoutComponent,
        children: [
          {
            path: 'new',
            component: CertificateFormComponent,
            resolve: {
              certificate: CertificateFormResolve
            }
          },
          {
            path: 'edit/:id',
            component: CertificateFormComponent,
            resolve: {
              certificate: CertificateFormResolve
            }
          },
          {
            path: ':id',
            component: CertificateDetailsComponent,
            resolve: {
              certificate: CertificateDetailsResolve,
            }
          },
          {
            path: '',
            component: CertificateListComponent
          }
        ]
      }
    ])
  ],
  providers: [
    CertificateFormResolve,
    CertificateDetailsResolve
  ],
  exports: [
    RouterModule
  ]
})
export class CertificateRoutingModule { }
