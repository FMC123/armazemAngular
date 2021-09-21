import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';
import { ParameterFormComponent } from './parameter-form/parameter-form.component';
import { ParameterListComponent } from './parameter-list/parameter-list.component';
import { ParameterRoutingModule } from './parameter-routing.module';
import { ParameterService } from './parameter.service';

@NgModule({
  imports: [
    SharedModule,
    ParameterRoutingModule,
  ],
  declarations: [
    ParameterFormComponent,
    ParameterListComponent,
  ],
  exports:[
  ],
  providers: [
    ParameterService,
  ]
})
export class ParameterModule { }
