import {
  BatchOperationFormTransportationResolve,
} from './balance-transportation/batch-weighing-share/batch-operation-form-transportation-resolve.service';
import { BalanceHasScaleGuard } from './balance-has-scale.guard';
import { BalanceUnifiedResolve } from './balance-unified-resolve.service';
import { BatchWeighingResolve } from './balance-transportation/batch-weighing-share/batch-weighing-resolve.service';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../auth/auth.guard';
import { LayoutComponent } from '../layout/layout.component';
import { BalanceTransportationInResolve } from './balance-transportation/balance-transportation-in-resolve.service';
import { BalanceTransportationInComponent } from './balance-transportation/balance-transportation-in.component';
import { BalanceTransportationOutResolve } from './balance-transportation/balance-transportation-out-resolve.service';
import { BalanceTransportationOutComponent } from './balance-transportation/balance-transportation-out.component';
import { BalanceComponent } from './balance.component';
import {
  BalanceTransportationBatchWeighingShareComponent
} from './balance-transportation/batch-weighing-share/balance-transportation-batch-weighing-share.component';

const routes: Routes = [
  {
    path: 'balance',
    component: LayoutComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: '',
        component: BalanceComponent,
        resolve: {
          unified: BalanceUnifiedResolve,
        },
      },
      {
        path: 'in/:id',
        component: BalanceTransportationInComponent,
        canActivate: [BalanceHasScaleGuard],
        resolve: {
          transportation: BalanceTransportationInResolve,
          unified: BalanceUnifiedResolve,
        }
      },
      {
        path: 'out/:id',
        component: BalanceTransportationOutComponent,
        canActivate: [BalanceHasScaleGuard],
        resolve: {
          transportation: BalanceTransportationOutResolve
        }
      },
      {
        path: 'batch-weighing-share/:id',
        component: BalanceTransportationBatchWeighingShareComponent,
        canActivate: [BalanceHasScaleGuard],
        resolve: {
          transportation: BatchOperationFormTransportationResolve,
          batchOperation: BatchWeighingResolve,
          unified: BalanceUnifiedResolve
        }
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    BatchWeighingResolve,
    BalanceTransportationInResolve,
    BalanceTransportationOutResolve,
    BalanceUnifiedResolve,
    BalanceHasScaleGuard,
    BatchOperationFormTransportationResolve,
  ]
})
export class BalanceRoutingModule { }

export const routedComponents = [BalanceComponent];
