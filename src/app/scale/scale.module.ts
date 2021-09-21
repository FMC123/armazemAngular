import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';
import { ScaleFormComponent } from './scale-form/scale-form.component';
import { ScaleDetailsComponent } from './scale-list-details/scale-list-details.component';
import { ScaleListInfoComponent } from './scale-list-details/scale-list-info.component';
import { ScaleListComponent } from './scale-list/scale-list.component';
import { ScaleRoutingModule } from './scale-routing.module';
import { ScaleService } from './scale.service';

@NgModule({
  imports: [
    SharedModule,
    ScaleRoutingModule,
  ],
  declarations: [
    ScaleFormComponent,
    ScaleListComponent,
    ScaleListInfoComponent,
    ScaleDetailsComponent
  ],
  providers: [
    ScaleService,
  ]
})
export class ScaleModule { }
