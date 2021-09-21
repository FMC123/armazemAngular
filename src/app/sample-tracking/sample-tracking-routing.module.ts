import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../auth/auth.guard';
import { LayoutComponent } from '../layout/layout.component';
import { SampleTrackingComponent } from './sample-tracking.component';
import { SampleTrackingListComponent } from './sample-tracking-list/sample-tracking-list.component';
import { SampleTrackingDetailComponent } from './sample-tracking-detail/sample-tracking-detail.component';
import {SampleTrackingDetailsResolve} from "./sample-tracking-detail/sample-tracking-detail-resolve.service";

@NgModule({
	imports: [
		RouterModule.forChild([
			{
				path: 'sample-tracking',
				component: LayoutComponent,
				canActivate: [AuthGuard],
				canActivateChild: [AuthGuard],
				children: [
					{
						path: '',
						component: SampleTrackingListComponent
					},
					{
						path: 'new',
						component: SampleTrackingComponent
					},
          {
            path: 'edit/:id',
            component: SampleTrackingComponent
          },
					{
						path: ':id',
						component: SampleTrackingDetailComponent,
            resolve: {
              sampleTracking: SampleTrackingDetailsResolve
            }
					}
				]
			}
		])
	],
  providers: [SampleTrackingDetailsResolve],
	exports: [RouterModule]
})

export class SampleTrackingRoutingModule {}
