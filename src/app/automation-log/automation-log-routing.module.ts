import { LayoutComponent } from '../layout/layout.component';
import { AuthGuard } from '../auth/auth.guard';
import { AutomationLogListComponent } from './automation-log-list/automation-log-list.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'automation-log',
    component: LayoutComponent,
    canActivateChild: [ AuthGuard ],
    children: [
      {
        path: '',
        component: AutomationLogListComponent,
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AutomationLogRoutingModule { }

export const routedComponents = [AutomationLogListComponent];
