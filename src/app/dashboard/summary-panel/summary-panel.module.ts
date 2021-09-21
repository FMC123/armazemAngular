import { NgModule } from '@angular/core';

import { SummaryPanelComponent } from './summary-panel.component';
import { SummaryPanelService } from './summary-panel.service';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [SharedModule],
  exports: [SummaryPanelComponent],
  declarations: [SummaryPanelComponent],
  providers: [SummaryPanelService]
})
export class SummaryPanelModule {}
