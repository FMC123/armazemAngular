import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { SampleTrackingService } from './sample-tracking.service';
import { SampleTrackingRoutingModule } from './sample-tracking-routing.module';
import { SampleTrackingComponent } from './sample-tracking.component';
import { SampleTrackingSearchComponent } from './sample-tracking-search/sample-tracking-search.component';
import { SampleTrackingContainerComponent } from './sample-tracking-container/sample-tracking-container.component';
import { SampleTrackingWarehouseComponent } from './sample-tracking-warehouse/sample-tracking-warehouse.component';
import { SampleTrackingListComponent } from './sample-tracking-list/sample-tracking-list.component';
import { SampleTrackingDetailComponent } from './sample-tracking-detail/sample-tracking-detail.component';

@NgModule({
	imports: [SharedModule, SampleTrackingRoutingModule],
	exports: [],
	declarations: [
		SampleTrackingComponent,
		SampleTrackingSearchComponent,
		SampleTrackingContainerComponent,
		SampleTrackingWarehouseComponent,
		SampleTrackingListComponent,
		SampleTrackingDetailComponent
	],
	providers: [SampleTrackingService]
})
export class SampleTrackingModule {}
