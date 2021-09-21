import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { ClassificationAuthorizationListComponent } from './classification-authorization-list/classification-authorization-list.component';
import { ClassificationAuthorizationDetailComponent } from './classification-authorization-detail/classification-authorization-detail.component';
import { ClassificationAuthorizationDetailResolve } from './classification-authorization-detail/classification-authorization-detail-resolve.service';
import { ClassificationAuthorizationFormComponent } from './classification-authorization-form/classification-authorization-form.component';
import { ClassificationAuthorizationFormResolve } from './classification-authorization-form/classification-authorization-form-resolve.service';

@NgModule({
	imports: [
		RouterModule.forChild([
			{
				path: 'classification-authorization',
				component: LayoutComponent,
				canActivateChild: [AuthGuard],
				children: [
					{
						path: ':id',
						component: ClassificationAuthorizationDetailComponent,
						resolve: {
							classificationVersion: ClassificationAuthorizationDetailResolve
						}
					},
					{
						path: 'edit/:id',
						component: ClassificationAuthorizationFormComponent,
						resolve: {
							classificationVersion: ClassificationAuthorizationFormResolve
						}
					},
					{
						path: '',
						component: ClassificationAuthorizationListComponent
					}
				]
			}
		])
	],
	providers: [
		ClassificationAuthorizationDetailResolve,
		ClassificationAuthorizationFormResolve
	],
	exports: [RouterModule]
})
export class ClassificationAuthorizationRoutingModule {}
