import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from 'app/layout/layout.component';
import { AuthGuard } from 'app/auth/auth.guard';
import { SaleSummaryComponent } from 'app/report/sale-summary/sale-summary.component';
import { InconsistencyStockComponent } from './inconsistency-stock.component';


const routes: Routes = [
  {
    path: 'inconsistency-stock',
    component: LayoutComponent,
    canActivateChild: [ AuthGuard ],
    children: [
      {
        path: '',
        component: InconsistencyStockComponent,
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InconsistencyStockRoutingModule {
}

export const routedComponents = [InconsistencyStockComponent];
