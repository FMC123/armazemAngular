import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from 'app/layout/layout.component';
import { AuthGuard } from 'app/auth/auth.guard';
import { SaleSummaryComponent } from 'app/report/sale-summary/sale-summary.component';

const routes: Routes = [
  {
    path: 'sale-summary',
    component: LayoutComponent,
    canActivateChild: [ AuthGuard ],
    children: [
      {
        path: '',
        component: SaleSummaryComponent,
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SaleSummaryRoutingModule {
}

export const routedComponents = [SaleSummaryComponent];
