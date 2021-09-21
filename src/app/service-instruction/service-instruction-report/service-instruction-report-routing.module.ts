import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LayoutComponent } from 'app/layout/layout.component';

import { AuthGuard } from '../../auth/auth.guard';
import { ServiceInstructionReportComponent } from './service-instruction-report.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'service-instruction-report',
        component: LayoutComponent,
        canActivateChild: [ AuthGuard ],
        children: [
          {
            path: '',
            component: ServiceInstructionReportComponent
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
export class ServiceInstructionReportRoutingModule { }
