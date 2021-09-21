import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from 'app/layout/layout.component';
import { AuthGuard } from 'app/auth/auth.guard';
import { DuctCleanComponent } from 'app/report/duct-clean/duct-clean.component';

const routes: Routes = [
  {
    path: 'duct-clean',
    component: LayoutComponent,
    canActivateChild: [ AuthGuard ],
    children: [
      {
        path: '',
        component: DuctCleanComponent,
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DuctCleanRouting {
}

export const routedComponents = [DuctCleanComponent];
