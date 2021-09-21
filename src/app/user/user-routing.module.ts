import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuard } from '../auth/auth.guard';
import { LayoutComponent } from '../layout/layout.component';
import { UserFormResolve } from './user-form/user-form-resolve.service';
import { UserFormComponent } from './user-form/user-form.component';
import { UserListComponent } from './user-list/user-list.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'user',
        component: LayoutComponent,
        canActivateChild: [ AuthGuard ],
        children: [
          {
            path: 'new',
            component: UserFormComponent,
            resolve: {
              user: UserFormResolve
            }
          },
          {
            path: 'edit/:id',
            component: UserFormComponent,
            resolve: {
              user: UserFormResolve
            }
          },
          {
            path: '',
            component: UserListComponent
          }
        ]
      }
    ])
  ],
  providers: [
    UserFormResolve
  ],
  exports: [
    RouterModule
  ]
})
export class UserRoutingModule { }
