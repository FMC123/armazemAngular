import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { AnalyzeSpecialCoffeeListComponent } from './analyze-special-coffee-list/analyze-special-coffee-list.component';
import {AnalyzeSpecialCoffeeFormComponent} from "./analyze-special-coffee-form/analyze-special-coffee-form.component";
import {AnalyzeSpecialCoffeeFormResolve} from "./analyze-special-coffee-form/analyze-special-coffee-form-resolve.service";
import {AnalyzeSpecialCoffeeDetailsComponent} from "./analyze-special-coffee-details/analyze-special-coffee-details.component";
import {AnalyzeSpecialCoffeeDetailsResolve} from "./analyze-special-coffee-details/analyze-special-coffee-details-resolve.service";

@NgModule({
	imports: [
		RouterModule.forChild([
			{
				path: 'analyze-special-coffee',
				component: LayoutComponent,
				canActivateChild: [AuthGuard],
				children: [
					{
						path: '',
						component: AnalyzeSpecialCoffeeListComponent
					},
          {
            path: 'analyze/:id',
            component: AnalyzeSpecialCoffeeFormComponent,
            resolve: {
              classification: AnalyzeSpecialCoffeeFormResolve
            }
          },
          {
            path: ':id',
            component: AnalyzeSpecialCoffeeDetailsComponent,
            resolve: {
              classification: AnalyzeSpecialCoffeeDetailsResolve
            }
          }
				]
			}
		])
	],
	providers: [AnalyzeSpecialCoffeeFormResolve,
              AnalyzeSpecialCoffeeDetailsResolve],
	exports: [RouterModule]
})
export class AnalyzeSpecialCoffeeRoutingModule {}
