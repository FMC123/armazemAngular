import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { IndicatedSpecialCoffeeListComponent } from './indicated-special-coffee-list/indicated-special-coffee-list.component';

@NgModule({
	imports: [
		RouterModule.forChild([
			{
				path: 'indicated-special-coffee',
				component: LayoutComponent,
				canActivateChild: [AuthGuard],
				children: [
					{
						path: '',
						component: IndicatedSpecialCoffeeListComponent
					}
				]
			}
		])
	],
	providers: [],
	exports: [RouterModule]
})
export class IndicatedSpecialCoffeeRoutingModule {}
