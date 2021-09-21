import { NgModule } from "@angular/core/src/metadata/ng_module";
import { SharedModule } from "app/shared/shared.module";
import { DailyEntryComponent } from "app/report/daily-entry/daily-entry.component";
import { DailyEntryRouting } from "app/report/daily-entry/daily-entry-routing.module";
import { DailyEntryService } from "app/report/daily-entry/daily-entry.service";


@NgModule({
  imports: [
    SharedModule,
    DailyEntryRouting
  ],
  declarations: [
    DailyEntryComponent
  ],
  exports: [
    DailyEntryComponent
  ],
  providers: [
    DailyEntryService
  ]

})
export class DailyEntryModule { }
