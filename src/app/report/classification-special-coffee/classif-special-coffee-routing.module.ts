import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from 'app/layout/layout.component';
import { AuthGuard } from 'app/auth/auth.guard';
import {ClassifSpecialCoffeeComponent} from "./classif-special-coffee.component";

const routes: Routes = [
  {
    path: 'classif-special-coffee',
    component: LayoutComponent,
    canActivateChild: [ AuthGuard ],
    children: [
      {
        path: '',
        component: ClassifSpecialCoffeeComponent,
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClassifSpecialCoffeeRouting {
}

export const routedComponents = [ClassifSpecialCoffeeComponent];
