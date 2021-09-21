import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';
import { UserAdministratorFormComponent } from './user-administrator-form/user-administrator-form.component';
import { UserAdministratorListComponent } from './user-administrator-list/user-administrator-list.component';
import { UserAdministratorRoutingModule } from './user-administrator-routing.module';
import { UserAdministratorService } from './user-administrator.service';

@NgModule({
  imports: [
    SharedModule,
    UserAdministratorRoutingModule,
    UserAdministratorRoutingModule
  ],
  declarations: [
    UserAdministratorFormComponent,
    UserAdministratorListComponent
  ],
  providers: [
    UserAdministratorService,
  ]
})
export class UserAdministratorModule { }
