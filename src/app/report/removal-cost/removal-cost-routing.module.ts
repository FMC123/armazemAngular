import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { LayoutComponent } from "../../layout/layout.component";
import { AuthGuard } from "../../auth/auth.guard";
import { RemovalCostComponent } from "./removal-cost.component";

const routes: Routes = [
  {
    path: 'removal-cost',
    component: LayoutComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: '',
        component: RemovalCostComponent,
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class RemovalCostRouting {
}

export const routedComponents = [RemovalCostComponent];
