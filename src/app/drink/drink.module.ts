import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';
import { DrinkChildrenListComponent } from './drink-form/drink-children-list.component';
import { DrinkFormComponent } from './drink-form/drink-form.component';
import { DrinkDetailsComponent } from './drink-list-details/drink-list-details.component';
import { DrinkListInfoComponent } from './drink-list-details/drink-list-info-component';
import { DrinkListComponent } from './drink-list/drink-list.component';
import { DrinkRoutingModule } from './drink-routing.module';
import { DrinkService } from './drink.service';

@NgModule({
  imports: [
    SharedModule,
   DrinkRoutingModule,


  ],
  declarations: [
   DrinkChildrenListComponent,
   DrinkFormComponent,
   DrinkListComponent,
   DrinkListInfoComponent,
   DrinkDetailsComponent

  ],

  providers: [
    DrinkService,
  ]
})
export class DrinkModule { }
