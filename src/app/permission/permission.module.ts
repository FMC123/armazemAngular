import { PermissionDetailComponent } from './permission-detail/permission-detail.component';
import { PermissionListComponent } from './permission-list/permission-list.component';
import { PermissionService } from './permission.service';
import { NgModule } from '@angular/core';
import { SharedModule } from './../shared/shared.module';
import { PermissionRoutingModule } from 'app/permission/permission-routing.module';
import { PermissionFormComponent } from 'app/permission/permission-form-component';
import { PermissionFormResolve } from 'app/permission/permission-form-resolve';

@NgModule({

  imports: [
    SharedModule, PermissionRoutingModule
  ],

  declarations: [
    PermissionListComponent, PermissionFormComponent, PermissionDetailComponent
  ],
  providers: [PermissionService],
})

export class PermissionModule { }
