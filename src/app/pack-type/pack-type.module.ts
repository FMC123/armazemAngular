import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';
import { PackTypeDetailsComponent } from './pack-type-details/pack-type-details.component';
import { PackTypeInfoComponent } from './pack-type-details/pack-type-info.component';
import { PackTypeFormComponent } from './pack-type-form/pack-type-form.component';
import { PackTypeListComponent } from './pack-type-list/pack-type-list.component';
import { PackTypeRoutingModule } from './pack-type-routing.module';
import { PackTypeService } from './pack-type.service';

@NgModule({
  imports: [
    SharedModule,
    PackTypeRoutingModule,
  ],
  declarations: [
    PackTypeFormComponent,
    PackTypeListComponent,
    PackTypeDetailsComponent,
    PackTypeInfoComponent,
  ],
  providers: [PackTypeService]
})
export class PackTypeModule { }
