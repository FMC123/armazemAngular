import { NgModule } from '@angular/core';
import { SharedModule } from './../shared/shared.module';
import { DepartmentRoutingModule } from './department-routing.module';
import { DepartmentService } from './department.service';
import {DepartmentFormComponent} from "./department-form/department-form.component";
import {DepartmentListComponent} from "./department-list/department-list.component";

@NgModule({
	imports: [
	  SharedModule,
    DepartmentRoutingModule,
  ],
	declarations: [
	  DepartmentFormComponent,
    DepartmentListComponent
  ],
	exports: [

  ],
	providers: [
	  DepartmentService
  ]
})
export class DepartmentModule {}
