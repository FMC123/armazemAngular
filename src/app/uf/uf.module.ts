import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { UfService } from './uf.service';

@NgModule({
  imports: [SharedModule],
  providers: [
    UfService,
  ]
})
export class UfModule {}
