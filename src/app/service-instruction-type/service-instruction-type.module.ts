import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';
import { ServiceInstructionTypeDetailsComponent } from './service-instruction-type-details/service-instruction-type-details.component';
import { ServiceInstructionTypeInfoComponent } from './service-instruction-type-details/service-instruction-type-info.component';
import { ServiceInstructionTypeFormComponent } from './service-instruction-type-form/service-instruction-type-form.component';
import { ServiceInstructionTypeListComponent } from './service-instruction-type-list/service-instruction-type-list.component';
import { ServiceInstructionTypeRoutingModule } from './service-instruction-type-routing.module';
import { ServiceInstructionTypeService } from './service-instruction-type.service';

@NgModule({
  imports: [
    SharedModule,
    ServiceInstructionTypeRoutingModule,
  ],
  declarations: [
    ServiceInstructionTypeFormComponent,
    ServiceInstructionTypeListComponent,
    ServiceInstructionTypeDetailsComponent,
    ServiceInstructionTypeInfoComponent,
  ],
  providers: [ServiceInstructionTypeService]
})
export class ServiceInstructionTypeModule { }
