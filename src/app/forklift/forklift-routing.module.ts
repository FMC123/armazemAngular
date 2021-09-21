import { AuthGuard } from '../auth/auth.guard';
import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';

import { ForkliftFormComponent } from './forklift-form/forklift-form.component';
import { ForkliftListComponent } from './forklift-list/forklift-list.component';
import { ForkliftDetailsComponent } from './forklift-list-details/forklift-list-details.component';
import { ForkliftFormResolve } from './forklift-form/forklift-form-resolve.service';
import { LayoutComponent } from 'app/layout/layout.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'forklift',
        component: LayoutComponent,
        canActivateChild: [ AuthGuard ],
        children: [
          {
            path: 'new',
            component: ForkliftFormComponent,
            resolve: {
              forklift: ForkliftFormResolve
            }
          },
          {
            path: 'edit/:id',
            component: ForkliftFormComponent,
            resolve: {
              forklift: ForkliftFormResolve
            }
          },
          {
            path: ':id',
            component: ForkliftDetailsComponent,
            resolve: {
              forklift: ForkliftFormResolve
            }
          },
          {
            path: '',
            component: ForkliftListComponent
          }
        ]
      }
    ])
  ],
  providers: [
    ForkliftFormResolve
  ],
  exports: [
    RouterModule
  ]
})
export class ForkliftRoutingModule { }
