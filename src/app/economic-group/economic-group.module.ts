import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';
import { EconomicGroupDetailsComponent } from './economic-group-details/economic-group-list-details.component';
import { EconomicGroupListInfoComponent } from './economic-group-details/economic-group-list-info-component';
import { EconomicGroupChildrenListComponent } from './economic-group-form/economic-group-children-list.component';
import { EconomicGroupFormComponent } from './economic-group-form/economic-group-form.component';
import { EconomicGroupListComponent } from './economic-group-list/economic-group-list.component';
import { EconomicGroupRoutingModule } from './economic-group-routing.module';
import { EconomicGroupService } from './economic-group.service';

@NgModule({
  imports: [
    SharedModule,
    EconomicGroupRoutingModule,
  ],
  declarations: [
    EconomicGroupChildrenListComponent,
    EconomicGroupFormComponent,
    EconomicGroupListComponent,
    EconomicGroupListInfoComponent,
    EconomicGroupDetailsComponent
  ],
  providers: [
    EconomicGroupService,
  ]
})
export class EconomicGroupModule { }
