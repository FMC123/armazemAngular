import { NgModule } from '@angular/core';

import { PositionListComponent } from '../position/position-list/position-list.component';
import { PositionModule } from '../position/position.module';
import { SharedModule } from './../shared/shared.module';
import { PositionLayerFormComponent } from './position-layer-form/position-layer-form.component';
import { PositionLayerDetailsComponent } from './position-layer-list-details/position-layer-list-details.component';
import { PositionLayerListInfoComponent } from './position-layer-list-details/position-layer-list-info.component';
import { PositionLayerListComponent } from './position-layer-list/position-layer-list.component';
import { PositionLayerRoutingModule } from './position-layer-routing.module';
import { PositionLayerService } from './position-layer.service';

@NgModule({
  imports: [
    SharedModule,
    PositionLayerRoutingModule,
    PositionModule
  ],
  declarations: [
    PositionLayerFormComponent,
    PositionLayerListComponent,
    PositionLayerListInfoComponent,
    PositionLayerDetailsComponent,
    PositionListComponent
  ],
  exports: [
    PositionListComponent
  ],
  providers: [
    PositionLayerService,
  ]
})
export class PositionLayerModule { }
