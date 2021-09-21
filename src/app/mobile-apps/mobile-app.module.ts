import { NgModule } from '@angular/core';
import { MobileAppFormComponent } from 'app/mobile-apps/mobile-app-form/mobile-app-form.component';
import { MobileAppDetailsComponent } from 'app/mobile-apps/mobile-app-list-details/mobile-app-list-details.component';
import { MobileAppListInfoComponent } from 'app/mobile-apps/mobile-app-list-details/mobile-app-list-info.component';
import { MobileAppListComponent } from 'app/mobile-apps/mobile-app-list/mobile-app-list.component';
import { MobileAppRoutingModule } from 'app/mobile-apps/mobile-app-routing.module';
import { MobileAppService } from 'app/mobile-apps/mobile-app.service';

import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    MobileAppRoutingModule
  ],
  declarations: [
    MobileAppFormComponent,
    MobileAppListComponent,
    MobileAppListInfoComponent,
    MobileAppDetailsComponent
  ],
  providers: [
    MobileAppService,
  ]
})
export class MobileAppModule { }
