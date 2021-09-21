import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { GlobalBatchesService } from 'app/report/global-batches/global-batches.service';


@NgModule({
  imports: [
    SharedModule
  ],

  declarations: [

  ],
  providers: [GlobalBatchesService],
})
export class GlobalBatchesModule { }
