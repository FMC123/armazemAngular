import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RetentionService} from "./retention.service";
import {WarrantRoutingModule} from "./warrant-routing.module";
import { WarrantControlListComponent } from './warrant-control-list/warrant-control-list.component';
import {SharedModule} from "../shared/shared.module";
import { WarrantControlDetailComponent } from './warrant-control-detail/warrant-control-detail.component';
import { WarrantControlFormComponent } from './warrant-control-form/warrant-control-form.component';
import { WarrantControlProrogationModalComponent } from './warrant-control-prorogation-modal/warrant-control-prorogation-modal.component';
import { WarrantControlDetailInfoComponent } from './warrant-control-detail-info/warrant-control-detail-info.component';
import { WarrantControlBatchSelectionComponent } from './warrant-control-batch-selection/warrant-control-batch-selection.component';

@NgModule({
  imports: [
    CommonModule,
    WarrantRoutingModule,
    SharedModule,
  ],
  declarations: [
    WarrantControlListComponent,
    WarrantControlDetailComponent,
    WarrantControlFormComponent,
    WarrantControlProrogationModalComponent,
    WarrantControlDetailInfoComponent,
    WarrantControlBatchSelectionComponent
  ],
  providers: [RetentionService]
})
export class WarrantControlModule { }
