import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { EquipamentDestinationModule } from './equipament-destination/equipament-destination.module';
import { EquipamentDetailsComponent } from './equipament-details/equipament-details.component';
import { EquipamentInfoComponent } from './equipament-details/equipament-info.component';
import { EquipamentFormComponent } from './equipament-form/equipament-form.component';
import { EquipamentListComponent } from './equipament-list/equipament-list.component';
import { EquipamentRoutingModule } from './equipament-routing.module';
import { EquipamentTagModule } from './equipament-tag/equipament-tag.module';
import { EquipamentTypeFunctionService } from './equipament-type-function/equipament-type-function.service';
import { EquipamentTypeService } from './equipament-type/equipament-type.service';
import { EquipamentService } from './equipament.service';
import { ModBusEquipamentService } from './mod-bus-equipament/mod-bus-equipament.service';

@NgModule({
  imports: [
    SharedModule,
    EquipamentRoutingModule,
    EquipamentTagModule,
    EquipamentDestinationModule,
  ],
  declarations: [
    EquipamentFormComponent,
    EquipamentListComponent,
    EquipamentDetailsComponent,
    EquipamentInfoComponent,
  ],
  providers: [
    EquipamentService,
    EquipamentTypeService,
    EquipamentTypeFunctionService,
    ModBusEquipamentService
  ]
})
export class EquipamentModule { }
