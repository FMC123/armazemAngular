import { ModuleWithProviders } from '@angular/core';
import { RouterModule }        from '@angular/router';

import { LayoutComponent } from '../layout/layout.component';
import { DashboardComponent } from './dashboard.component';
import { AuthGuard } from './../auth/auth.guard';

export const routing: ModuleWithProviders = RouterModule.forChild([
  {
    path: 'dashboard',
    component: LayoutComponent,
    canActivate: [ AuthGuard ],
    canActivateChild: [ AuthGuard ],
    children: [
      {
        path: '',
        component: DashboardComponent
      }
    ]
  }
]);
