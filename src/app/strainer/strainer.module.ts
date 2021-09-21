import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';
import { StrainerChildrenListComponent } from './strainer-form/strainer-children-list.component';
import { StrainerFormComponent } from './strainer-form/strainer-form.component';
import { StrainerDetailsComponent } from './strainer-list-details/strainer-list-details.component';
import { StrainerListInfoComponent } from './strainer-list-details/strainer-list-info-component';
import { StrainerListComponent } from './strainer-list/strainer-list.component';
import { StrainerRoutingModule } from './strainer-routing.module';
import { StrainerService } from './strainer.service';

@NgModule({
  imports: [
    SharedModule,
    StrainerRoutingModule,
  ],
  declarations: [
    StrainerChildrenListComponent,
    StrainerFormComponent,
    StrainerListComponent,
    StrainerListInfoComponent,
    StrainerDetailsComponent
  ],
  providers: [
    StrainerService,
  ]
})
export class StrainerModule { }
