import { AuthGuard } from '../auth/auth.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../layout/layout.component';

import { BatchOperationOutFormComponent } from './batch-operation-out-form/batch-operation-out-form.component';
import { BatchOperationInFormComponent } from './batch-operation-in-form/batch-operation-in-form.component';
import { BatchOperationListComponent } from './batch-operation-list/batch-operation-list.component';
import { BatchOperationMovementFormComponent } from './batch-operation-movement-form/batch-operation-movement-form.component';

import { BatchOperationOutFormResolve } from "./batch-operation-out-form/batch-operation-out-form-resolve.service";
import { BatchOperationInFormTransportationResolve } from './batch-operation-in-form/batch-operation-in-form-transportation-resolve.service';
import { BatchOperationInFormResolve } from './batch-operation-in-form/batch-operation-in-form-resolve.service';
import { BatchOperationOutFormTransportationResolve } from './batch-operation-out-form/batch-operation-out-form-transportation-resolve.service';
import { BatchOperationMovementFormResolve } from './batch-operation-movement-form/batch-operation-movement-form-resolve.service';

const routes: Routes = [
  {
    path: 'batch-operation',
    component: LayoutComponent,
    canActivateChild: [ AuthGuard ],
    children: [
      {
        path: '',
        component: BatchOperationListComponent,
      },
      {
        path: 'movement',
        component: BatchOperationMovementFormComponent,
        resolve: {
          batchOperationMovement: BatchOperationMovementFormResolve
        }
      },
      {
        path: 'in/:id/edit',
        component: BatchOperationInFormComponent,
        resolve: {
          batchOperation: BatchOperationInFormResolve,
          transportation: BatchOperationInFormTransportationResolve,
        }
      },
      {
        path: 'out/:id/edit',
        component: BatchOperationOutFormComponent,
        resolve: {
          batchOperation: BatchOperationOutFormResolve,
          transportation: BatchOperationOutFormTransportationResolve,
        }
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    BatchOperationInFormTransportationResolve,
    BatchOperationInFormResolve,
    BatchOperationOutFormResolve,
    BatchOperationOutFormTransportationResolve,
    BatchOperationMovementFormResolve,
  ]
})
export class BatchOperationRoutingModule { }

export const routedComponents = [
  BatchOperationListComponent,
  BatchOperationInFormComponent,
  BatchOperationOutFormComponent,
  BatchOperationMovementFormComponent,
];
