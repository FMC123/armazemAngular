import {AuthGuard} from "../auth/auth.guard";
import {RouterModule} from "@angular/router";
import {LayoutComponent} from "../layout/layout.component";
import {NgModule} from "@angular/core";
import {SampleArchiveListComponent} from "./sample-list-archive/sample-archive-list.component";
import {SampleMovementsComponent} from "./sample-form-archive/sample-movements/sample-movements.component";
import {SampleMovementsResolve} from "./sample-form-archive/sample-movements/sample-movements-resolve.service";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'sample-archive',
        component: LayoutComponent,
        canActivateChild: [AuthGuard],
        children: [
          {
            path: '',
            component: SampleArchiveListComponent
          },
          {
            path: ':id',
            component: SampleMovementsComponent,
            resolve: {
              sample: SampleMovementsResolve
            }
          },
        ]
      }
    ])
  ],
  providers: [],
  exports: [RouterModule]
})
export class SampleArchiveRoutingModule {}
