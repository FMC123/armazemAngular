import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuard } from '../auth/auth.guard';
import { LayoutComponent } from '../layout/layout.component';
import { SamplePackFormComponent } from './sample-pack-form/sample-pack-form.component';
import { SamplePackFormResolve } from './sample-pack-form/sample-pack-form-resolve.service';
import { SamplePackListComponent } from './sample-pack-list/sample-pack-list.component';
import { SamplePackDetailComponent } from './sample-pack-detail/simple-pack-detail.component';

@NgModule({
	imports: [
		RouterModule.forChild([
			{
				path: 'sample-pack',
				component: LayoutComponent,
				canActivateChild: [AuthGuard],
				children: [
					{
						path: 'new',
						component: SamplePackFormComponent,
						resolve: {
							samplePack: SamplePackFormResolve
						}
					},
					{
						path: 'edit/:id',
						component: SamplePackFormComponent,
						resolve: {
							samplePack: SamplePackFormResolve
						}
					},
					{
						path: ':id',
						component: SamplePackDetailComponent,
						resolve: {
							samplePack: SamplePackFormResolve
						}
					},
					{
						path: '',
						component: SamplePackListComponent
					}
				]
			}
		])
	],
	providers: [SamplePackFormResolve],
	exports: [RouterModule]
})
export class SamplePackRoutingModule {}
