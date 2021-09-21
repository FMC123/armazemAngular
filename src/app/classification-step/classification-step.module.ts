import {NgModule} from "@angular/core";
import {SharedModule} from "../shared/shared.module";
import {ClassificationStepRoutingModule} from "./classification-step-routing.module";
import {ClassificationStepRootComponent} from "./classification-step-root.component";
import {ClassificationStepListComponent} from "./list/classification-step-list.component"
import {ClassificationStepGroupService} from "./group/classification-step-group.service";
import {ClassificationStepUserSelectModalComponent} from "./user/classification-step-user-select-modal.component";
import {ClassificationStepUserService} from "./user/classification-step-user.service";

@NgModule({
  imports: [SharedModule, ClassificationStepRoutingModule],
  declarations: [
    ClassificationStepRootComponent,
    ClassificationStepListComponent,
    ClassificationStepUserSelectModalComponent
  ],
  providers: [
    ClassificationStepGroupService,
    ClassificationStepUserService
  ]
})
export class ClassificationStepModule {

}
