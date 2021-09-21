import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';
import { ServiceRequestDetailsComponent } from './service-request-details/service-request-details.component';
import { ServiceRequestInfoComponent } from './service-request-details/service-request-info.component';
import { ServiceRequestListFilterComponent } from './service-request-list/service-request-list-filter.component';
import { ServiceRequestListComponent } from './service-request-list/service-request-list.component';
import { ServiceRequestRoutingModule } from './service-request-routing.module';
import { ServiceRequestService } from './service-request.service';

@NgModule({
  imports: [
    SharedModule,
    ServiceRequestRoutingModule,
  ],
  declarations: [
    ServiceRequestListFilterComponent,
    ServiceRequestListComponent,
    ServiceRequestDetailsComponent,
    ServiceRequestInfoComponent,
  ],
  providers: [ServiceRequestService]
})
export class ServiceRequestModule { }
