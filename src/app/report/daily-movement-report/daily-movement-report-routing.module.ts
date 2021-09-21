import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LayoutComponent } from 'app/layout/layout.component';
import { AuthGuard } from '../../auth/auth.guard';
import { DailyMovementReportComponent } from './daily-movement-report.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'daily-movement-report',
        component: LayoutComponent,
        canActivateChild: [ AuthGuard ],
        children: [
          {
            path: '',
            component: DailyMovementReportComponent
          },
        ]
      }
    ])
  ],
  providers: [
  ],
  exports: [
    RouterModule
  ]
})
export class DailyMovementReportRoutingModule { }