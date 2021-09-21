import { AutomationRouteOutModalComponent } from './automation-route-modal/automation-route-out-modal.component';
import { AutomationRouteInModalComponent } from './automation-route-modal/automation-route-in-modal.component';
import { AutomationRouteService } from './automation-route.service';
import { NgModule } from '@angular/core';
import { AutomationRouteComponent } from './automation-route.component';
import { AutomationRouteRoutingModule } from './automation-route-rounting.module';
import { SharedModule } from './../shared/shared.module';
@NgModule({
  imports: [
    SharedModule,
    AutomationRouteRoutingModule,
  ],
  exports: [
    AutomationRouteInModalComponent,
    AutomationRouteOutModalComponent,
  ],
  declarations: [
    AutomationRouteComponent,
    AutomationRouteInModalComponent,
    AutomationRouteOutModalComponent,
  ],
  providers: [
    AutomationRouteService
  ],
})
export class AutomationRouteModule { }
