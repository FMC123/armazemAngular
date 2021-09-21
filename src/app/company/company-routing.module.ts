import { CompanyDetailsResolve } from './company-list-details/company-list-details-resolve.service';
import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';


import {CompanyFormResolve} from './company-form/company-form-resolve.service';
import {CompanyListComponent} from './company-list/company-list.component';
import {CompanyFormComponent} from './company-form/company-form.component';
import {CompanyDetailsComponent} from './company-list-details/company-list-details.component';
import { AuthGuard } from '../auth/auth.guard';
import { LayoutComponent } from 'app/layout/layout.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'company',
        component: LayoutComponent,
        canActivateChild: [ AuthGuard ],
        children: [
          {
            path: 'new',
            component: CompanyFormComponent,
            resolve: {
              company: CompanyFormResolve
            }
          },
          {
            path: 'edit/:id',
            component: CompanyFormComponent,
            resolve: {
              company: CompanyFormResolve
            }
          },
          {
            path: ':id',
            component: CompanyDetailsComponent,
            resolve: {
              company: CompanyDetailsResolve,
            }
          },

          {
            path: '',
            component: CompanyListComponent
          }
        ]
      }
    ])
  ],
  providers: [
    CompanyFormResolve,
    CompanyDetailsResolve,
  ],
  exports: [
    RouterModule
  ]
})
export  class CompanyRoutingModule { }
