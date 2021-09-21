import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StorageUnitMergeComponent } from './storage-unit-merge.component';
import { LayoutComponent } from 'app/layout/layout.component';
import { AuthGuard } from 'app/auth/auth.guard';

const routes: Routes = [
  {
    path: 'storage-unit-merge',
    component: LayoutComponent,
    canActivateChild: [ AuthGuard ],
    children: [
      {
        path: '',
        component: StorageUnitMergeComponent
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StorageUnitMergeRoutingModule { }

export const routedComponents = [StorageUnitMergeComponent];
