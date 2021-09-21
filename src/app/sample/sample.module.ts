import { NgModule } from '@angular/core';
import { SampleService } from './sample.service';
import { SharedModule } from './../shared/shared.module';
import { SampleDetailsComponent } from './sample-details/sample-details.component';
import { SampleInfoComponent } from './sample-details/sample-info.component';
import { SampleDischargeListComponent } from './sample-discharge-list/sample-discharge-list.component';
import { SampleDevolutionListComponent } from './sample-devolution-list/sample-devolution-list.component';
import { SampleDischargeModalComponent } from './sample-discharge-modal/sample-discharge-modal.component';
import { SampleHistoryComponent } from './sample-history/sample-history.component';
import { SampleHistoryService } from './sample-history/sample-history.service';
import { SampleListFilterComponent } from './sample-list/sample-list-filter.component';
import { SampleListComponent } from './sample-list/sample-list.component';
import { SampleRoutingModule } from './sample-routing.module';
import { SampleWithdrawalListComponent } from './sample-withdrawal-list/sample-withdrawal-list.component';
import {SampleMovementHistoryComponent} from "./sample-movement-history/sample-movement-history.component";
import {SampleMovementHistoryService} from "./sample-movement-history/sample-movement-history.service";
import {SampleReqPicoteListComponent} from "./sample-request-picote-list/sample-req-picote-list.component";
import {SampleReqPicoteListFilterComponent} from "./sample-request-picote-list/sample-req-picote-list-filter.component";

@NgModule({
	imports: [SharedModule, SampleRoutingModule],
	declarations: [
		SampleDischargeListComponent,
		SampleDischargeModalComponent,
		SampleWithdrawalListComponent,
		SampleListComponent,
		SampleListFilterComponent,
		SampleDetailsComponent,
		SampleInfoComponent,
		SampleHistoryComponent,
    SampleMovementHistoryComponent,
		SampleWithdrawalListComponent,
		SampleDevolutionListComponent,
    SampleReqPicoteListComponent,
    SampleReqPicoteListFilterComponent
	],
	exports: [],
	providers: [SampleService, SampleHistoryService, SampleMovementHistoryService]
})
export class SampleModule {}
