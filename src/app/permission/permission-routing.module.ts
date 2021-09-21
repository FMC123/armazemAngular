import { PermissionListComponent } from './permission-list/permission-list.component';
import { PermissionFormResolve } from './permission-form-resolve';
import { PermissionFormComponent } from './permission-form-component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuard } from '../auth/auth.guard';
import { LayoutComponent } from '../layout/layout.component';


@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'permission',
        component: LayoutComponent,
        canActivateChild: [AuthGuard],
        children: [
          {
            path: 'new',
            component: PermissionFormComponent,
            resolve: {
              group: PermissionFormResolve
            }
          },

          {
            path: 'edit/:id',
            component: PermissionFormComponent,
            resolve: {
              group: PermissionFormResolve
            }
          },
          {
            path: ':id',
            component: PermissionFormComponent,
            resolve: {
              group: PermissionFormResolve
            }
          },

          {
            path: '',
            component: PermissionListComponent
          }
        ]
      }
    ])
  ],
  providers: [
    PermissionFormResolve
  ],
  exports: [
    RouterModule
  ]
})
export class PermissionRoutingModule { }
