import { SharedModule } from '../shared/shared.module';
import { FarmListComponent } from './farm-list/farm-list.component';

import { NgModule } from '@angular/core';

@NgModule({
  imports: [SharedModule],
  exports: [FarmListComponent],
  declarations: [FarmListComponent],
  providers: [],
})
export class FarmSharedModule { }
