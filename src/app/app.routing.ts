import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { PasswordChangeComponent } from './auth/password/password-change.component';
import { WarehouseLoginComponent } from './auth/warehouse-login/warehouse-login.component';
import { ErrorComponent } from './error/error.component';
import { LayoutComponent } from './layout/layout.component';
import { NotFoundComponent } from './not-found/not-found.component';

const ROUTES: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  { path: 'login', component: LoginComponent, pathMatch: 'full' },
  {
    path: 'login/warehouse',
    component: WarehouseLoginComponent,
    canActivate: [ AuthGuard ]
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'password-change', component: PasswordChangeComponent, pathMatch: 'full' },
      { path: 'error', component: ErrorComponent },
      { path: '**', component: NotFoundComponent },
    ]
  },
];

export const routing: ModuleWithProviders = RouterModule.forRoot(ROUTES);
