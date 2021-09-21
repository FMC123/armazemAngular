import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { LayoutComponent } from "../../layout/layout.component";
import { AuthGuard } from "../../auth/auth.guard";
import { CustomerInventoryComponent } from "./customer-inventory.component";

const routes: Routes = [
  {
    path: 'customer-inventory',
    component: LayoutComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: '',
        component: CustomerInventoryComponent,
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class CustomerInventoryRouting {
}

export const routedComponents = [CustomerInventoryComponent];
