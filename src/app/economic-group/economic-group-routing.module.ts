import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';


import { EconomicGroupFormResolve } from './economic-group-form/economic-group-form-resolve.service';
import { EconomicGroupListComponent } from './economic-group-list/economic-group-list.component';
import { EconomicGroupFormComponent } from './economic-group-form/economic-group-form.component';
import { EconomicGroupDetailsComponent } from './economic-group-details/economic-group-list-details.component';
import { AuthGuard } from '../auth/auth.guard';
import { LayoutComponent } from 'app/layout/layout.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'economic-group',
        component: LayoutComponent,
        canActivateChild: [ AuthGuard ],
        children: [
          {
            path: 'new',
            component: EconomicGroupFormComponent,
            resolve: {
              economicGroup: EconomicGroupFormResolve
            }
          },
          {
            path: 'edit/:id',
            component: EconomicGroupFormComponent,
            resolve: {
              economicGroup: EconomicGroupFormResolve
            }
          },
          {
            path: ':id',
            component: EconomicGroupDetailsComponent,
            resolve: {
              economicGroup: EconomicGroupFormResolve
            }
          },

          {
            path: '',
            component: EconomicGroupListComponent
          }
        ]
      }
    ])
  ],
  providers: [
    EconomicGroupFormResolve,
    //EconomicGroupDetailsResolve,
  ],
  exports: [
    RouterModule
  ]
})
export  class EconomicGroupRoutingModule { }
