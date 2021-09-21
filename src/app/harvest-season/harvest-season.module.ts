import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';
import { HarvestSeasonChildrenListComponent } from './harvest-season-form/harvest-season-children-list.component';
import { HarvestSeasonFormComponent } from './harvest-season-form/harvest-season-form.component';
import { HarvestSeasonDetailsComponent } from './harvest-season-list-details/harvest-season-list-details.component';
import { HarvestSeasonListInfoComponent } from './harvest-season-list-details/harvest-season-list-info-component';
import { HarvestSeasonListComponent } from './harvest-season-list/harvest-season-list.component';
import { HarvestSeasonRoutingModule } from './harvest-season-routing.module';
import { HarvestSeasonService } from './harvest-season.service';

@NgModule({
  imports: [
    SharedModule,
    HarvestSeasonRoutingModule,
  ],
  declarations: [
    HarvestSeasonChildrenListComponent,
    HarvestSeasonFormComponent,
    HarvestSeasonListComponent,
    HarvestSeasonListInfoComponent,
    HarvestSeasonDetailsComponent
  ],
  providers: [
    HarvestSeasonService,
  ]
})
export class HarvestSeasonModule { }
