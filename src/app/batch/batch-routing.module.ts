import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../auth/auth.guard';
import { LayoutComponent } from '../layout/layout.component';
import {BatchBatchcodeUpdateComponent} from "./batch-batchcode-update/batch-batchcode-update.component";

const routes: Routes = [
  {
    path: 'batchcode-update',
    component: LayoutComponent,
    canActivateChild: [ AuthGuard ],
    children: [
      {
        path: '',
        component: BatchBatchcodeUpdateComponent
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BatchRoutingModule { }

export const routedComponents = [BatchBatchcodeUpdateComponent];
