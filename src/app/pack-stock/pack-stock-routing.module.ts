import { PackStockFormResolve } from './pack-stock-form/pack-stock-form-resolve.service';
import { PackStockFormComponent } from './pack-stock-form/pack-stock-form.component';
import { PackStockDetailsResolve } from './pack-stock-details/pack-stock-details-resolve.service';
import { PackStockDetailsComponent } from './pack-stock-details/pack-stock-details.component';
import { AuthGuard } from '../auth/auth.guard';
import { LayoutComponent } from '../layout/layout.component';
import { PackStockListComponent } from './pack-stock-list/pack-stock-list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'pack-stock',
    component: LayoutComponent,
    canActivateChild: [ AuthGuard ],
    children: [
      {
        path: 'new',
        component: PackStockFormComponent,
        resolve: {
          group: PackStockFormResolve,
        }
      },
      {
        path: ':id/edit',
        component: PackStockFormComponent,
        resolve: {
          group: PackStockFormResolve,
        }
      },
      {
        path: ':id',
        component: PackStockDetailsComponent,
        resolve: {
          group: PackStockDetailsResolve,
        }
      },
      {
        path: '',
        component: PackStockListComponent
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    PackStockDetailsResolve,
    PackStockFormResolve
  ]
})
export class PackStockRoutingModule { }

export const routedComponents = [
  PackStockListComponent,
  PackStockDetailsComponent,
  PackStockFormComponent,
];
