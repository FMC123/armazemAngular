import { NgModule } from '@angular/core';

import { AddressSharedModule } from '../address/address-shared.module';
import { CustomerContactSharedModule } from '../customer-contact/customer-contact-shared.module';
import { FarmSharedModule } from '../farm/farm-shared.module';
import { PersonSharedModule } from '../person/person-shared.module';
import { SharedModule } from './../shared/shared.module';
import { WarehouseStakeholderFormComponent } from './warehouse-stakeholder-form/warehouse-stakeholder-form.component';
import {
  WarehouseStakeholderDetailsComponent,
} from './warehouse-stakeholder-list-details/warehouse-stakeholder-list-details.component';
import {
  WarehouseStakeholderListInfoComponent,
} from './warehouse-stakeholder-list-details/warehouse-stakeholder-list-info.component';
import { WarehouseStakeholderListComponent } from './warehouse-stakeholder-list/warehouse-stakeholder-list.component';
import { WarehouseStakeholderRoutingModule } from './warehouse-stakeholder-routing.module';
import { WarehouseStakeholderService } from './warehouse-stakeholder.service';
import { WarehouseStakeholderCertificateComponent } from './warehouse-stakeholder-certificate/warehouse-stakeholder-certificate.component';
import {WarehouseStakeholderCertificateService} from "./warehouse-stakeholder-certificate/warehouse-stakeholder-certificate.service";
import { WarehouseStakeholderCertificateFormModalComponent } from './warehouse-stakeholder-certificate/warehouse-stakeholder-certificate-form-modal/warehouse-stakeholder-certificate-form-modal.component';

@NgModule({
  imports: [
    SharedModule,
    WarehouseStakeholderRoutingModule,
    FarmSharedModule,
    PersonSharedModule,
    CustomerContactSharedModule,
    AddressSharedModule,
  ],
  declarations: [
    WarehouseStakeholderFormComponent,
    WarehouseStakeholderListComponent,
    WarehouseStakeholderListInfoComponent,
    WarehouseStakeholderDetailsComponent,
    WarehouseStakeholderCertificateComponent,
    WarehouseStakeholderCertificateFormModalComponent
  ],
  exports: [
    WarehouseStakeholderCertificateComponent,
  ],
  providers: [
    WarehouseStakeholderService,
    WarehouseStakeholderCertificateService,
  ]
})
export class WarehouseStakeholderModule { }
