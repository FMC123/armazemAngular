import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { TransportationFiscalNoteCertificateFormModalComponent } from './transportation-fiscal-note/certificate/transportation-fiscal-note-certificate-form-modal.component';
import { TransportationFiscalNoteCertificateMemoryListComponent } from './transportation-fiscal-note/certificate/transportation-fiscal-note-certificate-memory-list.component';
import { TransportationFiscalNoteCertificateService } from './transportation-fiscal-note/certificate/transportation-fiscal-note-certificate.service';
import { TransportationFiscalNoteMemoryListComponent } from './transportation-fiscal-note/transportation-fiscal-note-memory-list/transportation-fiscal-note-memory-list.component';
import { TransportationFiscalNoteService } from './transportation-fiscal-note/transportation-fiscal-note.service';
import { TransportationPurchaseForecastFiller } from './transportation-in-form/transportation-purchase-forecast-filler.service';
import { TransportationFilterComponent } from './transportation-list-closed/transportation-filter.component';
import { NewPurchaseOrderModalComponent } from "../new-purchase-order-modal/new-purchase-order-modal.component";
import {
	routedComponents,
	TransportationRoutingModule
} from './transportation-routing.module';
import { TransportationSharedModule } from './transportation-shared.module';
import { TransportationService } from './transportation.service';
import {PackStockMovementListTransportationComponent} from "./pack-stock-movement-list-transportation/pack-stock-movement-list-transportation.component";

@NgModule({
	imports: [
		SharedModule,
		TransportationSharedModule,
		TransportationRoutingModule
	],
	exports: [],
	declarations: [
		...routedComponents,
		TransportationFilterComponent,
		TransportationFiscalNoteMemoryListComponent,
		TransportationFiscalNoteCertificateMemoryListComponent,
		TransportationFiscalNoteCertificateFormModalComponent,
    PackStockMovementListTransportationComponent,
    NewPurchaseOrderModalComponent
	],
	providers: [
		TransportationService,
		TransportationFiscalNoteService,
		TransportationFiscalNoteCertificateService,
		TransportationPurchaseForecastFiller
	]
})
export class TransportationModule {}
