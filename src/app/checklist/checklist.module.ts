
import {SharedModule} from "../shared/shared.module";
import {ChecklistService} from "./checklist.service";
import {NgModule} from "@angular/core";

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
  ],
  providers: [
    ChecklistService,
  ]
})
export class ChecklistModule {
}
