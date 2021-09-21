import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { EquipamentDestinationFormComponent } from './equipament-destination-form/equipament-destination-form.component';
import { EquipamentDestinationListComponent } from './equipament-destination-list/equipament-destination-list.component';
import { EquipamentDestinationRoutingModule } from './equipament-destination-routing.module';
import { EquipamentDestinationService } from './equipament-destination.service';

@NgModule({
  imports: [
    SharedModule,
    EquipamentDestinationRoutingModule,
  ],
  declarations: [
    EquipamentDestinationListComponent,
    EquipamentDestinationFormComponent,
  ],
  exports: [
    EquipamentDestinationListComponent,
  ],
  providers: [
    EquipamentDestinationService,
  ]
})
export class EquipamentDestinationModule { }
