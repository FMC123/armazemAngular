import { SharedModule } from '../shared/shared.module';
import { StorageUnitMoveFormModalComponent } from './move/storage-unit-move-form-modal.component';
import { NgModule } from '@angular/core';
import { StorageUnitSacariaFormModalComponent } from './sacaria/storage-unit-sacaria-form/storage-unit-sacaria-form-modal.component';
import {StorageUnitSetFormModalComponent} from "./sacaria/storage-unit-set-form/storage-unit-set-form-modal.component";

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    StorageUnitMoveFormModalComponent,
    StorageUnitSacariaFormModalComponent,
    StorageUnitSetFormModalComponent
  ],
  declarations: [
    StorageUnitMoveFormModalComponent,
    StorageUnitSacariaFormModalComponent,
    StorageUnitSetFormModalComponent
  ],
  providers: [],
})
export class StorageUnitSharedModule { }
