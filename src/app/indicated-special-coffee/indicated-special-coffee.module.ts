import { NgModule } from '@angular/core';
import { SharedModule } from './../shared/shared.module';
import { IndicatedSpecialCoffeeRoutingModule } from './indicated-special-coffee-routing.module';
import { IndicatedSpecialCoffeeListComponent } from './indicated-special-coffee-list/indicated-special-coffee-list.component';
import { IndicatedSpecialCoffeeService } from './indicated-special-coffee.service';
import {IndicatedSpecialCoffeeListFilterComponent} from "./indicated-special-coffee-list/indicated-special-coffee-list-filter.component";

@NgModule({
	imports: [SharedModule, IndicatedSpecialCoffeeRoutingModule],
	declarations: [
		IndicatedSpecialCoffeeListComponent,
    IndicatedSpecialCoffeeListFilterComponent
	],
	providers: [IndicatedSpecialCoffeeService]
})
export class IndicatedSpecialCoffeeModule {}
