import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../auth/auth.guard';
import { LayoutComponent } from '../layout/layout.component';
import { BatchReportComponent } from './batch-report.component';

const routes: Routes = [
  {
    path: 'batch-report',
    component: LayoutComponent,
    canActivateChild: [ AuthGuard ],
    children: [
      {
        path: '',
        component: BatchReportComponent
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BatchReportRoutingModule { }

export const routedComponents = [BatchReportComponent];
