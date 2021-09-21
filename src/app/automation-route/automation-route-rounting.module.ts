import { AutomationRouteComponent } from './automation-route.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from '../layout/layout.component';
import { AuthGuard } from '../auth/auth.guard';

const routes: Routes = [
	{
		path: 'automation-notification',
		component: LayoutComponent,
		canActivateChild: [AuthGuard],
		children: [
			{
				path: '',
				component: AutomationRouteComponent
			}
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class AutomationRouteRoutingModule {}

export const routedComponents = [AutomationRouteComponent];
