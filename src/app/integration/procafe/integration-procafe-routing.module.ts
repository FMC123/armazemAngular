import {RouterModule} from "@angular/router";
import {NgModule} from "@angular/core";
import {LayoutComponent} from "../../layout/layout.component";
import {IntegrationProcafeListComponent} from "./integration-procafe-list/integration-procafe-list.component";


@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'integration/procafe',
        component: LayoutComponent,
        children: [
          {
            path: '',
            component: IntegrationProcafeListComponent
          }
        ]
      }
    ])
  ],
  providers: [],
  exports: [
    RouterModule
  ]
})
export class IntegrationProcafeRoutingModule { }
