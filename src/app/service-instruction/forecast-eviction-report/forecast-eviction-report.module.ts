import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ServiceInstructionService } from 'app/service-instruction/service-instruction.service';
import { ForecastEvictionReportRoutingModule } from './forecast-eviction-report-routing.module';
import { ForecastEvictionReportComponent } from './forecast-eviction-report.component';

@NgModule({
  imports: [
    SharedModule,
    ForecastEvictionReportRoutingModule
  ],
  declarations: [
    ForecastEvictionReportComponent
  ],
  providers: [
    ServiceInstructionService,
  ]
})
export class ForecastEvictionReportModule { }