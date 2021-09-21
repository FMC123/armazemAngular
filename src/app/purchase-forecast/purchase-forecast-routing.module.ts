import { BalanceUnifiedResolve } from '../balance/balance-unified-resolve.service';
import { LayoutComponent } from '../layout/layout.component';
import { AuthGuard } from '../auth/auth.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PurchaseForecastComponent } from './purchase-forecast.component';

const routes: Routes = [
  {
    path: 'purchase-forecast',
    canActivateChild: [ AuthGuard ],
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: PurchaseForecastComponent,
        resolve: {
          unified: BalanceUnifiedResolve,
        }
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PurchaseForecastRoutingModule { }

export const routedComponents = [
  PurchaseForecastComponent,
];
