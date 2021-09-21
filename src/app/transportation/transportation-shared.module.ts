import {
    TransportationListSelectActionsComponent,
} from './transportation-list/select/transportation-list-select-actions.component';
import {
    TransportationListUnifiedActionsComponent,
} from './transportation-list/unified/transportation-list-unified-actions.component';
import {
    TransportationListSelectModalComponent,
} from './transportation-list-select-modal/transportation-list-select-modal.component';
import { SharedModule } from '../shared/shared.module';
import {
    TransportationFiscalNoteCertificateListComponent,
} from './transportation-fiscal-note/certificate/transportation-fiscal-note-certificate-list.component';
import {
    TransportationFiscalNoteListComponent,
} from './transportation-fiscal-note/transportation-fiscal-note-list/transportation-fiscal-note-list.component';
import { TransportationListTotalsComponent } from './transportation-list-totals/transportation-list-totals.component';
import {
    TransportationListBalanceActionsComponent,
} from './transportation-list/balance/transportation-list-balance-actions.component';
import {
    TransportationListLobbyActionsComponent,
} from './transportation-list/lobby/transportation-list-lobby-actions.component';
import { TransportationListComponent } from './transportation-list/transportation-list.component';

import { NgModule } from '@angular/core';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    TransportationListComponent,
    TransportationFiscalNoteListComponent,
    TransportationListTotalsComponent,
    TransportationListSelectModalComponent,
  ],
  declarations: [
    TransportationListComponent,
    TransportationFiscalNoteListComponent,
    TransportationFiscalNoteCertificateListComponent,
    TransportationListLobbyActionsComponent,
    TransportationListUnifiedActionsComponent,
    TransportationListBalanceActionsComponent,
    TransportationListTotalsComponent,
    TransportationListSelectModalComponent,
    TransportationListSelectActionsComponent,
  ],
  providers: [],
})
export class TransportationSharedModule { }
