import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';
import { UserFormComponent } from './user-form/user-form.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserRoutingModule } from './user-routing.module';
import { UserService } from './user.service';

@NgModule({
  imports: [
    SharedModule,
    UserRoutingModule
  ],
  declarations: [
    UserFormComponent,
    UserListComponent
  ],
  providers: [
    UserService,
  ]
})
export class UserModule { }
