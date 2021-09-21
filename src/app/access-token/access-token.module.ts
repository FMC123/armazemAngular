import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';
import { AccessTokenFilterComponent } from './access-token-list/access-token-filter.component';
import { AccessTokenListComponent } from './access-token-list/access-token-list.component';
import { AccessTokenRoutingModule } from './access-token-routing.module';
import { AccessTokenService } from './access-token.service';

@NgModule({
  imports: [
    SharedModule,
    AccessTokenRoutingModule
  ],
  declarations: [
    AccessTokenFilterComponent,
    AccessTokenListComponent
  ],
  providers: [
    AccessTokenService,
  ]
})
export class AccessTokenModule { }
