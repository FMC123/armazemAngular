import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LayoutComponent } from 'app/layout/layout.component';
import { AuthGuard } from '../../auth/auth.guard';
import { ForecastEvictionReportComponent } from './forecast-eviction-report.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'forecast-eviction-report',
        component: LayoutComponent,
        canActivateChild: [ AuthGuard ],
        children: [
          {
            path: '',
            component: ForecastEvictionReportComponent
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
export class ForecastEvictionReportRoutingModule { }
