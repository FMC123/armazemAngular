import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from '../layout/layout.component';
import { AuthGuard } from '../auth/auth.guard';
import { IndicationSpecialCoffeeFindComponent } from './indication-special-coffee-find/indication-special-coffee-find.component';
import { IndicationSpecialCoffeeSaveComponent } from './indication-special-coffee-save/indication-special-coffee-save.component';
import { IndicationSpecialCoffeeDetailComponent } from './indication-special-coffee-detail/indication-special-coffee-detail.component';
import { IndicationSpecialCoffeeResolve } from './indication-special-coffee-resolve.service';

const routes: Routes = [
  {
    path: 'indication-special-coffee',
    component: LayoutComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'find',
        component: IndicationSpecialCoffeeFindComponent
      },
      {
        path: 'save',
        component: IndicationSpecialCoffeeSaveComponent
      },
      {
        path: 'detail/:id',
        component: IndicationSpecialCoffeeDetailComponent,
      },
      {
        path: 'edit/:id',
        component: IndicationSpecialCoffeeSaveComponent,
        resolve: {
          id: IndicationSpecialCoffeeResolve
        },
      },
    ]
  }
];
/*
  resolve: {
          indication: IndicationSpecialCoffeeResolve
        },
*/
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndicationSpecialCoffeeRoutingModule { }

export const routedComponents = [IndicationSpecialCoffeeFindComponent];
