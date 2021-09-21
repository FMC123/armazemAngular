import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { TrackingCartButtonComponent } from './cart/button/tracking-cart-button.component';
import { TrackingCartComponent } from './cart/tracking-cart.component';
import { TrackingDataService } from './data/tracking-data.service';
import { MapTrackingComponent } from './map/map-tracking.component';
import { TrackingResultsComponent } from './results/tracking-results.component';
import { TrackingSearchComponent } from './search/tracking-search.component';
import { TrackingSearchService } from './search/tracking-search.service';
import {
	routedComponents,
	TrackingRoutingModule
} from './tracking-routing.module';
import { TrackingService } from './tracking.service';

@NgModule({
	imports: [SharedModule, TrackingRoutingModule],
	exports: [],
	declarations: [
		routedComponents,
		MapTrackingComponent,
		TrackingSearchComponent,
		TrackingResultsComponent,
		TrackingCartButtonComponent,
		TrackingCartComponent
	],
	providers: [TrackingService, TrackingSearchService, TrackingDataService]
})
export class TrackingModule {}
