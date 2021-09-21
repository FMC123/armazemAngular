import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';
import { CultivationChildrenListComponent } from './cultivation-form/cultivation-children-list.component';
import { CultivationFormComponent } from './cultivation-form/cultivation-form.component';
import { CultivationDetailsComponent } from './cultivation-list-details/cultivation-list-details.component';
import { CultivationListInfoComponent } from './cultivation-list-details/cultivation-list-info-component';
import { CultivationListComponent } from './cultivation-list/cultivation-list.component';
import { CultivationRoutingModule } from './cultivation-routing.module';
import { CultivationService } from './cultivation.service';

@NgModule({
  imports: [
    SharedModule,
    CultivationRoutingModule,
  ],
  declarations: [
    CultivationChildrenListComponent,
    CultivationFormComponent,
    CultivationListComponent,
    CultivationListInfoComponent,
    CultivationDetailsComponent
  ],
  providers: [
    CultivationService,
  ]
})
export class CultivationModule { }
