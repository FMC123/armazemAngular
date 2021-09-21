import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../auth/auth.guard';
import { LayoutComponent } from '../layout/layout.component';
import { BatchSwapHistoryListComponent } from './batch-swap-history-list/batch-swap-history-list.component'

const routes: Routes = [
  {
    path: 'batch-swap-log',
    component: LayoutComponent,
    canActivateChild: [ AuthGuard ],
    children: [
      {
        path: '',
        component: BatchSwapHistoryListComponent
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BatchSwapHistoryRoutingModule { }

export const routedComponents = [BatchSwapHistoryListComponent];
