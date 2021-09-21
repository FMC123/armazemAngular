import { NgModule } from '@angular/core';
import {RouterModule} from "@angular/router";
import {LayoutComponent} from "../layout/layout.component";
import {WarrantControlListComponent} from "./warrant-control-list/warrant-control-list.component";
import {WarrantControlDetailComponent} from "./warrant-control-detail/warrant-control-detail.component";
import {WarrantControlFormComponent} from "./warrant-control-form/warrant-control-form.component";
import {WarrantControlDetailInfoComponent} from "./warrant-control-detail-info/warrant-control-detail-info.component";
import {AuthGuard} from "../auth/auth.guard";
@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'warrant-control',
        component: LayoutComponent,
        canActivateChild: [AuthGuard],
        children: [
          {
            path: '',
            component: WarrantControlListComponent
          },
          {
            path: 'new',
            component: WarrantControlFormComponent,
          },
          {
            path: ':id',
            component: WarrantControlDetailComponent
          },
          {
            path: 'info/:id',
            component: WarrantControlDetailInfoComponent
          },
          {
            path: 'new/:client_id',
            component: WarrantControlFormComponent
          },
          {
            path: 'edit/:id',
            component: WarrantControlFormComponent
          },
        ]
      }
    ])
  ],
  providers: [
  ],
  exports: [
    RouterModule
  ]
})
export class WarrantRoutingModule { }
