import { NgModule } from '@angular/core';

import {
  ServiceGroupItemListComponent,
} from '../service-group-items/service-group-item-list/service-group-item-list.component';
import { ServiceGroupService } from '../service-group/service-group.service';
import { SharedModule } from '../shared/shared.module';
import { ServiceGroupFormComponent } from './service-group-form/service-group-form.component';
import { ServiceGroupDetailsComponent } from './service-group-list-detail/service-group-list-details.component';
import { ServiceGroupListInfoComponent } from './service-group-list-detail/service-group-list-info.component';
import { ServiceGroupListComponent } from './service-group-list/service-group-list.component';
import { ServiceGroupRoutingModule } from './service-group-routing.module';

@NgModule({
  imports: [
    SharedModule,
    ServiceGroupRoutingModule,
  ],
  exports: [ServiceGroupItemListComponent],
  declarations: [
    ServiceGroupDetailsComponent,
    ServiceGroupListInfoComponent,
    ServiceGroupListComponent,
    ServiceGroupFormComponent,
    ServiceGroupItemListComponent
  ],
  providers: [
    ServiceGroupService,
  ]
})
export class ServiceGroupModule { }
