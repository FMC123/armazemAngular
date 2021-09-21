import { PurchaseProspectDetailsResolve } from './purchase-prospect-details/purchase-prospect-details-resolve.service';
import { PurchaseProspectDetailsComponent } from './purchase-prospect-details/purchase-prospect-details.component';
import { AuthGuard } from '../auth/auth.guard';
import { PurchaseProspectFormResolve } from './purchase-prospect-form/purchase-prospect-form-resolve.service';
import { PurchaseProspectFormComponent } from './purchase-prospect-form/purchase-prospect-form.component';
import { PurchaseProspectListComponent } from './purchase-prospect-list/purchase-prospect-list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../layout/layout.component';

const routes: Routes = [
  {
    path: 'purchase-prospect',
    component: LayoutComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'new',
        component: PurchaseProspectFormComponent,
        resolve: {
          purchaseProspect: PurchaseProspectFormResolve
        }
      },
      {
        path: 'edit/:id',
        component: PurchaseProspectFormComponent,
        resolve: {
          purchaseProspect: PurchaseProspectFormResolve
        }
      },
      {
        path: ':id',
        component: PurchaseProspectDetailsComponent,
        resolve: {
          purchaseProspect: PurchaseProspectDetailsResolve,
        }
      },
      {
        path: '',
        component: PurchaseProspectListComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)],
  providers: [
    PurchaseProspectFormResolve,
    PurchaseProspectDetailsResolve,
  ],
  exports: [RouterModule]
})

export class PurchaseProspectRoutingModule { }

export const routedComponents = [
  PurchaseProspectListComponent,
  PurchaseProspectDetailsComponent
];
