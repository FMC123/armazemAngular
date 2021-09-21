import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { LayoutComponent } from '../layout/layout.component';
import { SampleDetailsResolve } from './sample-details/sample-details-resolve.service';
import { SampleDetailsComponent } from './sample-details/sample-details.component';
import { SampleDischargeListComponent } from './sample-discharge-list/sample-discharge-list.component';
import { SampleListComponent } from './sample-list/sample-list.component';
import { SampleWithdrawalListComponent } from './sample-withdrawal-list/sample-withdrawal-list.component';
import { SampleDevolutionListComponent } from './sample-devolution-list/sample-devolution-list.component';
import {SampleReqPicoteListComponent} from "./sample-request-picote-list/sample-req-picote-list.component";

@NgModule({
	imports: [
		RouterModule.forChild([
			{
				path: 'sample',
				component: LayoutComponent,
				canActivateChild: [AuthGuard],
				children: [
					{
						path: 'discharge',
						component: SampleDischargeListComponent
					},
					{
						path: 'withdrawal',
						component: SampleWithdrawalListComponent
					},
					{
						path: 'devolution',
						component: SampleDevolutionListComponent
					},
          {
            path: 'picoterequest',
            component: SampleReqPicoteListComponent
          },
					{
						path: ':id',
						component: SampleDetailsComponent,
						resolve: {
							sample: SampleDetailsResolve
						}
					},
					{
						path: '',
						component: SampleListComponent
					}
				]
			}
		])
	],
	providers: [SampleDetailsResolve],
	exports: [RouterModule]
})
export class SampleRoutingModule {}
