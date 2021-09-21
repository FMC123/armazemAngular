import { BalanceUnifiedResolve } from '../balance/balance-unified-resolve.service';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../auth/auth.guard';
import { LayoutComponent } from '../layout/layout.component';
import { TransportationInFormResolve } from './transportation-in-form/transportation-in-form-resolve.service';
import { TransportationInFormComponent } from './transportation-in-form/transportation-in-form.component';
import { TransportationListClosedComponent } from './transportation-list-closed/transportation-list-closed.component';
import {TransportationOutFormResolve} from "./transportation-out-form/transportation-out-form-resolve.service";
import {TransportationOutFormComponent} from "./transportation-out-form/transportation-out-form.component";

const routes: Routes = [
  {
    path: 'transportation',
    component: LayoutComponent,
    canActivateChild: [ AuthGuard ],
    children: [
      {
        path: 'closed',
        component: TransportationListClosedComponent,
      },
      {
        path: 'in',
        children: [
          {
            path: 'new',
            component: TransportationInFormComponent,
            resolve: {
              transportation: TransportationInFormResolve,
              unified: BalanceUnifiedResolve,
            }
          },
          {
            path: ':id/edit',
            component: TransportationInFormComponent,
            resolve: {
              transportation: TransportationInFormResolve,
              unified: BalanceUnifiedResolve,
            }
          }
        ]
      },
      {
        path: 'out',
        children: [
          {
            path: 'new',
            component: TransportationOutFormComponent,
            resolve: {
              transportation: TransportationOutFormResolve,
              unified: BalanceUnifiedResolve,

            }
          },
          {
            path: ':id/edit',
            component: TransportationOutFormComponent,
            resolve: {
              transportation: TransportationOutFormResolve,
              unified: BalanceUnifiedResolve,
            }
          }
        ]
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    TransportationInFormResolve,
    TransportationOutFormResolve,
  ]
})
export class TransportationRoutingModule { }

export const routedComponents = [
  TransportationListClosedComponent,
  TransportationInFormComponent,
  TransportationOutFormComponent,
];
