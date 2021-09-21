import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AuditInventoryReportRoutingModule } from './audit-inventory-report-routing.module';
import { AuditInventoryReportComponent } from './audit-inventory-report.component';
import { BatchService } from 'app/batch/batch.service';
import {AuditInventoryReportService} from "./audit-inventory-report.service";

@NgModule({
  imports: [
    SharedModule,
    AuditInventoryReportRoutingModule
  ],
  declarations: [
    AuditInventoryReportComponent
  ],
  providers: [
    BatchService,
    AuditInventoryReportService,
  ]
})
export class AuditInventoryReportModule { }
