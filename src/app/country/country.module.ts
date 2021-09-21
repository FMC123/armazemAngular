import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { CountryService } from './country.service';

@NgModule({
  imports: [SharedModule],
  providers: [
    CountryService
  ]
})

export class CountryModule {}
