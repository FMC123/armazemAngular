import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { CityService } from './city.service';

@NgModule({
  imports: [SharedModule],
  providers: [CityService]
})
export class CityModule { }
