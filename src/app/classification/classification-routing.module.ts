import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { ClassificationListComponent } from './classification-list/classification-list.component';
import { ClassificationFormComponent } from './classification-form/classification-form.component';
import { ClassificationFormResolve } from './classification-form/classification-form-resolve.service';
import { ClassificationDetailsComponent } from './classification-details/classification-details.component';
import { ClassificationDetailsResolve } from './classification-details/classification-details-resolve.service';
import { LayoutComponent } from '../layout/layout.component';
import { ClassificationListSampleComponent } from './classification-list/sample/classification-list-sample.component';

@NgModule({
	imports: [
		RouterModule.forChild([
			{
				path: 'classification',
				component: LayoutComponent,
				canActivateChild: [AuthGuard],
				children: [
					{
						path: 'new',
						component: ClassificationFormComponent,
						resolve: {
							classification: ClassificationFormResolve
						}
					},
					{
						path: 'edit/:id',
					 	component: ClassificationFormComponent,
					 	resolve: {
					 		classification: ClassificationFormResolve
					 	}
					},
					{
						path: 'sample/:id',
					 	component: ClassificationListSampleComponent
					},
					{
						path: ':id',
						component: ClassificationDetailsComponent,
						resolve: {
							classification: ClassificationDetailsResolve,
						}
					},
					{
						path: '',
						component: ClassificationListComponent
					}
				]
			}
		])
	],
	providers: [
		ClassificationFormResolve,
		ClassificationDetailsResolve
	],
	exports: [RouterModule]
})
export class ClassificationRoutingModule {}
