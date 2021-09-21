import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from 'app/layout/layout.component';
import { AuthGuard } from 'app/auth/auth.guard';
import { SaleSummaryComponent } from 'app/report/sale-summary/sale-summary.component';
import { PrintTagComponent } from './print-tag.component';

const routes: Routes = [
  {
    path: 'print-tag',
    component: LayoutComponent,
    canActivateChild: [ AuthGuard ],
    children: [
      {
        path: '',
        component: PrintTagComponent,
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrintTagRoutingModule {
}

export const routedComponents = [PrintTagComponent];
