import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { OperationTypeDetailsComponent } from './operation-type-details/operation-type-details.component';
import { OperationTypeInfoComponent } from './operation-type-details/operation-type-info.component';
import { OperationTypeFormComponent } from './operation-type-form/operation-type-form.component';
import { OperationTypeServiceInputFormComponent } from './operation-type-form/operation-type-service-input-form.component';
import { OperationTypeListComponent } from './operation-type-list/operation-type-list.component';
import { OperationTypeRoutingModule } from './operation-type-routing.module';
import { OperationTypeService } from './operation-type.service';

@NgModule({
  imports: [
    SharedModule,
    OperationTypeRoutingModule,
  ],
  declarations: [
    OperationTypeFormComponent,
    OperationTypeListComponent,
    OperationTypeDetailsComponent,
    OperationTypeInfoComponent,
    OperationTypeServiceInputFormComponent,
  ],
  providers: [
    OperationTypeService,
  ]
})
export class OperationTypeModule { }
