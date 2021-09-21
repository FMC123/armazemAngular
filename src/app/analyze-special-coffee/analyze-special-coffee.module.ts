import { NgModule } from '@angular/core';
import { SharedModule } from './../shared/shared.module';
import { AnalyzeSpecialCoffeeRoutingModule } from './analyze-special-coffee-routing.module';
import { AnalyzeSpecialCoffeeListComponent } from './analyze-special-coffee-list/analyze-special-coffee-list.component';
import { AnalyzeSpecialCoffeeService } from './analyze-special-coffee.service';
import {AnalyzeSpecialCoffeeListFilterComponent} from "./analyze-special-coffee-list/analyze-special-coffee-list-filter.component";
import {AnalyzeSpecialCoffeeFormComponent} from "./analyze-special-coffee-form/analyze-special-coffee-form.component";
import {ClassificationItemFormComponent} from "./analyze-special-coffee-form/classification-item-form.component";
import {AnalyzeSpecialCoffeeDetailsComponent} from "./analyze-special-coffee-details/analyze-special-coffee-details.component";

@NgModule({
	imports: [SharedModule, AnalyzeSpecialCoffeeRoutingModule],
	declarations: [
    AnalyzeSpecialCoffeeDetailsComponent,
    AnalyzeSpecialCoffeeFormComponent,
		AnalyzeSpecialCoffeeListComponent,
    AnalyzeSpecialCoffeeListFilterComponent,
    ClassificationItemFormComponent
	],
	providers: [AnalyzeSpecialCoffeeService]
})
export class AnalyzeSpecialCoffeeModule {}
