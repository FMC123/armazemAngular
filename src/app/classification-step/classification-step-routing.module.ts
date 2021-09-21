import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {LayoutComponent} from "../layout/layout.component";
import {AuthGuard} from "../auth/auth.guard";
import {ClassificationStepRootComponent} from "./classification-step-root.component";

@NgModule(
  {
    imports: [
      RouterModule.forChild([
        {
          path: 'classification-step',
          component: LayoutComponent,
          canActivateChild: [AuthGuard],
          children: [
            {
              path: '',
              component: ClassificationStepRootComponent
            }
          ]
        }
      ])
    ],
    providers: [

    ],
    exports: [RouterModule]
  }
)

export class ClassificationStepRoutingModule {

}
