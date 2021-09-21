import { NgModule } from '@angular/core';
import {
  BatchOperationCertificateFormModalComponent,
} from 'app/batch-operation/batch-operation-certificate/batch-operation-certificate-form-modal.component';
import {
  BatchOperationCertificateListComponent,
} from 'app/batch-operation/batch-operation-certificate/batch-operation-certificate-list.component';
import {
  BatchOperationCertificateService,
} from 'app/batch-operation/batch-operation-certificate/batch-operation-certificate.service';
import {
  BatchOperationCertificatesResolve,
} from 'app/batch-operation/batch-operation-certificate/batch-operation-certificates-resolve.service';

import { BatchSharedModule } from '../batch/batch-shared.module';
import {
  InputPackagingStockAvailableComponent,
} from '../input-packaging-stock-available/input-packaging-stock-available-form/input-packaging-stock-available-form.component';
import { PackStockModule } from '../pack-stock/pack-stock.module';
import { ServiceChargeSharedModule } from '../service-charge/service-charge-shared.module';
import { SharedModule } from './../shared/shared.module';
import { BatchOperationFilterComponent } from './batch-operation-list/batch-operation-filter.component';
import {
  BatchOperationOutStorageUnitDeleteFormModalComponent,
} from './batch-operation-out-form/storage-unit-delete-form/batch-operation-out-storage-unit-delete-form-modal.component';
import {
  BatchOperationOutStorageUnitEditFormModalComponent,
} from './batch-operation-out-form/storage-unit-edit-form/batch-operation-out-storage-unit-edit-form-modal.component';
import {
  BatchOperationOutStorageUnitNewFormModalComponent,
} from './batch-operation-out-form/storage-unit-new-form/batch-operation-out-storage-unit-new-form-modal.component';
import { BatchOperationRoutingModule, routedComponents } from './batch-operation-routing.module';
import { BatchOperationService } from './batch-operation.service';
import { FiscalNoteListFormComponent } from './batch-operation-out-form/fiscal_note_list_form/fiscal_note_list_form.component'

import { SelectModule } from 'ng2-select/select/select.module';
import { BatchOperationMovementFormComponent } from './batch-operation-movement-form/batch-operation-movement-form.component';
import { BatchOperationOwnershipTransferFormComponent } from './batch-operation-movement-form/batch-operation-ownership-transfer-form/batch-operation-ownership-transfer-form.component';
import { FiscalNoteListOwnershipTransferFormComponent } from './batch-operation-movement-form/fiscal-note-list-ownership-transfer-form/fiscal-note-list-ownership-transfer-form.component'
import { BatchListOwnershipTransferFormComponent } from "./batch-operation-movement-form/batch-list-ownership-transfer-form/batch-list-ownership-transfer-form.component";
import {BatchSwapComponent} from "./batch-operation-movement-form/batch-swap/batch-swap.component";
import {AutomationRouteModule} from "../automation-route/automation-route-module";

@NgModule({
    imports: [
        SharedModule,
        BatchOperationRoutingModule,
        BatchSharedModule,
        PackStockModule,
        ServiceChargeSharedModule,
        SelectModule,
        AutomationRouteModule
    ],
  declarations: [
    ...routedComponents,
    BatchOperationFilterComponent,
    InputPackagingStockAvailableComponent,
    BatchOperationOutStorageUnitNewFormModalComponent,
    BatchOperationOutStorageUnitEditFormModalComponent,
    BatchOperationOutStorageUnitDeleteFormModalComponent,
    BatchOperationCertificateListComponent,
    BatchOperationCertificateFormModalComponent,
    FiscalNoteListFormComponent,
    BatchOperationMovementFormComponent,
    BatchOperationOwnershipTransferFormComponent,
    FiscalNoteListOwnershipTransferFormComponent,
    BatchListOwnershipTransferFormComponent,
    BatchSwapComponent
  ],
  exports: [
  ],
  providers: [
    BatchOperationService,
    BatchOperationCertificateService,
    BatchOperationCertificatesResolve,
  ]
})
export class BatchOperationModule { }
