import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LayoutComponent } from 'app/layout/layout.component';
import { AuthGuard } from '../../auth/auth.guard';
import { AuditInventoryReportComponent } from './audit-inventory-report.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'audit-inventory-report',
        component: LayoutComponent,
        canActivateChild: [ AuthGuard ],
        children: [
          {
            path: '',
            component: AuditInventoryReportComponent
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
export class AuditInventoryReportRoutingModule { }
