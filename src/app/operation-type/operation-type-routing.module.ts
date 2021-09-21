import { OperationTypeDetailsResolve } from './operation-type-details/operation-type-details-resolve.service';
import { OperationTypeDetailsComponent } from './operation-type-details/operation-type-details.component';
import { AuthGuard } from '../auth/auth.guard';
import { OperationTypeFormResolve } from './operation-type-form/operation-type-form-resolve.service';
import { OperationTypeFormComponent } from './operation-type-form/operation-type-form.component';
import { OperationTypeListComponent } from './operation-type-list/operation-type-list.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LayoutComponent } from "app/layout/layout.component";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'operation-type',
        component: LayoutComponent,
        canActivateChild: [ AuthGuard ],
        children: [
          {
            path: 'new',
            component: OperationTypeFormComponent,
            resolve: {
              operationType: OperationTypeFormResolve
            }
          },
          {
            path: 'edit/:id',
            component: OperationTypeFormComponent,
            resolve: {
              operationType: OperationTypeFormResolve
            }
          },
          {
            path: ':id',
            component: OperationTypeDetailsComponent,
            resolve: {
              operationType: OperationTypeDetailsResolve,
            }
          },
          {
            path: '',
            component: OperationTypeListComponent
          }
        ]
      }
    ])
  ],
  providers: [
    OperationTypeFormResolve,
    OperationTypeDetailsResolve,
  ],
  exports: [
    RouterModule
  ]
})
export class OperationTypeRoutingModule { }
