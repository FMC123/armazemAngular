import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuard } from '../auth/auth.guard';
import { PersonFormResolve } from './person-form/person-form-resolve.service';
import { PersonFormComponent } from './person-form/person-form.component';
import {
    PersonDetailsResolve,
} from './person-list-details/person-list-details-resolve.service';
import {
    PersonListDetailsComponent,
} from './person-list-details/person-list-details.component';
import {PersonListComponent} from './person-list/person-list.component';
import { LayoutComponent } from 'app/layout/layout.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'person',
        component: LayoutComponent,
        canActivateChild: [ AuthGuard ],
        children: [
          {
            path: 'new',
            component: PersonFormComponent,
            resolve: {
              person: PersonFormResolve
            }
          },
          {
            path: 'edit/:id',
            component: PersonFormComponent,
            resolve: {
              person: PersonFormResolve
            }
          },
           {
            path: ':id',
            component: PersonListDetailsComponent,
            resolve: {
              person: PersonDetailsResolve
            }
          },
          {
            path: '',
            component: PersonListComponent
          }
        ]
      }
    ])
  ],
  providers: [
    PersonFormResolve,
    PersonDetailsResolve,
  ],
  exports: [
    RouterModule
  ]
})
export class PersonRoutingModule { }
