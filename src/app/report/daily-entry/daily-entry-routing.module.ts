import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from 'app/layout/layout.component';
import { AuthGuard } from 'app/auth/auth.guard';
import { DailyEntryComponent } from 'app/report/daily-entry/daily-entry.component';

const routes: Routes = [
  {
    path: 'daily-entry',
    component: LayoutComponent,
    canActivateChild: [ AuthGuard ],
    children: [
      {
        path: '',
        component: DailyEntryComponent,
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DailyEntryRouting {
}

export const routedComponents = [DailyEntryComponent];
