import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuard } from '../auth/auth.guard';
import { LayoutComponent } from '../layout/layout.component';
import {DepartmentFormComponent} from "./department-form/department-form.component";
import {DepartmentFormResolve} from "./department-form/department-form-resolve.service";
import {DepartmentListComponent} from "./department-list/department-list.component";


@NgModule({
	imports: [
		RouterModule.forChild([
			{
				path: 'department',
				component: LayoutComponent,
				canActivateChild: [AuthGuard],
				children: [
          {
            path: 'new',
            component: DepartmentFormComponent,
            resolve: {
              department: DepartmentFormResolve
            }
          },
          {
            path: 'edit/:id',
            component: DepartmentFormComponent,
            resolve: {
              department: DepartmentFormResolve
            }
          },
          {
            path: '',
            component: DepartmentListComponent,
            resolve: {
              department: DepartmentFormResolve
            }
          }

        ]
			}
		])
	],
	providers: [DepartmentFormResolve],
	exports: [RouterModule]
})
export class DepartmentRoutingModule {}
