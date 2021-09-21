import { AutomationLogService } from './automation-log.service';
import { AutomationLogRoutingModule } from './automation-log-routing.module';
import { SharedModule } from '../shared/shared.module';
import { AutomationLogListComponent } from './automation-log-list/automation-log-list.component';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [
    SharedModule,
    AutomationLogRoutingModule,
  ],
  exports: [],
  declarations: [
    AutomationLogListComponent,
  ],
  providers: [
    AutomationLogService,
  ],
})
export class AutomationLogModule { }
