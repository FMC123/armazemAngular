import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LayoutComponent } from '../layout/layout.component';
import { AuthGuard } from '../auth/auth.guard';
import { SamplePackReceiveFormComponent } from './sample-pack-receive-form/sample-pack-receive-form.component';
import { SamplePackReceiveFormResolve } from './sample-pack-receive-form/sample-pack-receive-form-resolve.service';
import { SamplePackReceiveDetailComponent } from './sample-pack-receive-detail/simple-pack-receive-detail.component';
import { SamplePackReceiveListComponent } from './sample-pack-receive-list/sample-pack-receive-list.component';

@NgModule({
	imports: [
		RouterModule.forChild([
			{
				path: 'sample-pack-receive',
				component: LayoutComponent,
				canActivateChild: [AuthGuard],
				children: [
					{
						path: 'new',
						component: SamplePackReceiveFormComponent,
						resolve: {
							samplePack: SamplePackReceiveFormResolve
						}
					},
					{
						path: 'edit/:id',
						component: SamplePackReceiveFormComponent,
						resolve: {
							samplePack: SamplePackReceiveFormResolve
						}
					},
					{
						path: ':id',
						component: SamplePackReceiveDetailComponent,
						resolve: {
							samplePack: SamplePackReceiveFormResolve
						}
					},
					{
						path: '',
						component: SamplePackReceiveListComponent
					}
				]
			}
		])
	],
	providers: [SamplePackReceiveFormResolve],
	exports: [RouterModule]
})
export class SamplePackReceiveRoutingModule { }
