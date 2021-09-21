import { IntegrationZimMoveListComponent } from './integration-zim-move-list.component';
import { IntegrationZimMoveRoutingModule } from './integration-zim-move-routing.module';

import { environment } from 'environments/environment';
import { SharedModule } from '../../shared/shared.module';
import { NgModule } from '@angular/core';
import { IntegrationZimMoveService } from './integration-zim-move.service';



const PROVIDERS = [
  IntegrationZimMoveService,
];

@NgModule({
  imports: [
    SharedModule,
    IntegrationZimMoveRoutingModule,
  ],
  declarations: [
    IntegrationZimMoveListComponent
  ],
  providers: PROVIDERS
})
export class IntegrationZimMoveModule { }
