import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { DailyMovementReportRoutingModule } from './daily-movement-report-routing.module';
import { DailyMovementReportComponent } from './daily-movement-report.component';
import { BatchService } from 'app/batch/batch.service';

@NgModule({
  imports: [
    SharedModule,
    DailyMovementReportRoutingModule
  ],
  declarations: [
    DailyMovementReportComponent
  ],
  providers: [
    BatchService,
  ]
})
export class DailyMovementReportModule { }
