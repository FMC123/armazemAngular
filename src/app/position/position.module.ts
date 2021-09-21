import { NgModule } from '@angular/core';

import { StackListComponent } from '../stack/stack-list/stack-list.component';
import { StackModule } from '../stack/stack.module';
import { SharedModule } from './../shared/shared.module';
import { PositionFormComponent } from './position-form/position-form.component';
import { PositionDetailsComponent } from './position-list-details/position-list-details.component';
import { PositionListInfoComponent } from './position-list-details/position-list-info.component';
import { PositionRoutingModule } from './position.routing';
import { PositionService } from './position.service';
import { PositionSacariaService } from './sacaria/position-sacaria.service';

@NgModule({
  imports: [
    SharedModule,
    PositionRoutingModule,
    StackModule

  ],
  declarations: [
    PositionFormComponent,
    PositionListInfoComponent,
    PositionDetailsComponent,
    StackListComponent
  ],
  exports:[
    StackListComponent
  ],

  providers: [
    PositionService,
    PositionSacariaService,
  ]
})
export class PositionModule { }
