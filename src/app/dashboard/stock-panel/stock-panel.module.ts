import { NgModule } from '@angular/core';

import { StockPanelComponent } from './stock-panel.component';
import { StockPanelService } from './stock-panel.service';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
	imports: [SharedModule],
	exports: [StockPanelComponent],
	declarations: [StockPanelComponent],
	providers: [StockPanelService]
})
export class StockPanelModule {}
