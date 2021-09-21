import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';
import { ForkliftFormComponent } from './forklift-form/forklift-form.component';
import { ForkliftDetailsComponent } from './forklift-list-details/forklift-list-details.component';
import { ForkliftListInfoComponent } from './forklift-list-details/forklift-list-info.component';
import { ForkliftListComponent } from './forklift-list/forklift-list.component';
import { ForkliftRoutingModule } from './forklift-routing.module';
import { ForkliftService } from './forklift.service';

@NgModule({
    imports: [
        SharedModule,
        ForkliftRoutingModule,

    ],
    declarations: [
        ForkliftFormComponent,
        ForkliftListComponent,
        ForkliftDetailsComponent,
        ForkliftListInfoComponent

    ],
    providers: [
      ForkliftService,
    ]
})
export class ForkliftModule { }
