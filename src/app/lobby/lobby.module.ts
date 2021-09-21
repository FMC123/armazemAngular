import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { TransportationSharedModule } from '../transportation/transportation-shared.module';
import { LobbyActionsComponent } from './lobby-actions.component';
import { LobbyRoutingModule, routedComponents } from './lobby-routing.module';
import { LobbyComponent } from './lobby.component';

@NgModule({
  imports: [
    SharedModule,
    LobbyRoutingModule,
    TransportationSharedModule,
  ],
  exports: [],
  declarations: [
    LobbyComponent,
    LobbyActionsComponent,
    ...routedComponents,
  ],
  providers: [],
})
export class LobbyModule { }
