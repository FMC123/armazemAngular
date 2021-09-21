import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuard } from '../auth/auth.guard';
import { LayoutComponent } from '../layout/layout.component';
import { UserAdministratorFormResolve } from './user-administrator-form/user-administrator-form-resolve.service';
import { UserAdministratorFormComponent } from './user-administrator-form/user-administrator-form.component';
import { UserAdministratorListComponent } from './user-administrator-list/user-administrator-list.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'user-administrator',
        component: LayoutComponent,
        canActivateChild: [ AuthGuard ],
        children: [
          {
            path: 'new',
            component: UserAdministratorFormComponent,
            resolve: {
              user: UserAdministratorFormResolve
            }
          },
          {
            path: 'edit/:id',
            component: UserAdministratorFormComponent,
            resolve: {
              user: UserAdministratorFormResolve
            }
          },
          {
            path: '',
            component: UserAdministratorListComponent
          }
        ]
      }
    ])
  ],
  providers: [
    UserAdministratorFormResolve
  ],
  exports: [
    RouterModule
  ]
})
export class UserAdministratorRoutingModule { }
