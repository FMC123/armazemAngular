import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ServiceInstructionService } from 'app/service-instruction/service-instruction.service';
import { ServiceInstructionReportRoutingModule } from './service-instruction-report-routing.module';
import { ServiceInstructionReportComponent } from './service-instruction-report.component';
import { IndustrializationFiscalNoteListFormComponent } from './industrialization-fiscal-note/industrialization_fiscal_note_form.component';

@NgModule({
  imports: [
    SharedModule,
    ServiceInstructionReportRoutingModule
  ],
  declarations: [
    ServiceInstructionReportComponent,
    IndustrializationFiscalNoteListFormComponent
  ],
  providers: [
    ServiceInstructionService,
  ]
})
export class ServiceInstructionReportModule { }
