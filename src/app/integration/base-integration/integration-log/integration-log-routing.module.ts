import { IntegrationLogListComponent } from './integration-log-list/integration-log-list.component';
import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';
import { LayoutComponent } from "app/layout/layout.component";


@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'integration/integration-log',
        component: LayoutComponent,
        children: [
          {
            path: '',
            component: IntegrationLogListComponent
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
export class FunctionLogRoutingModule { }
