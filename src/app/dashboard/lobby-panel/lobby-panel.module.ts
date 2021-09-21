import { NgModule } from '@angular/core';

import { LobbyPanelComponent } from './lobby-panel.component';
import { LobbyPanelService } from './lobby-panel.service';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [SharedModule],
  exports: [LobbyPanelComponent],
  declarations: [LobbyPanelComponent],
  providers: [LobbyPanelService]
})
export class LobbyPanelModule {}
