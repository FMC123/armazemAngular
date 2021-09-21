import {SharedModule} from "../shared/shared.module";
import {NgModule} from "@angular/core";
import {SampleArchiveRoutingModule} from "./sample-archive-routing.module";
import {SampleArchiveListComponent} from "./sample-list-archive/sample-archive-list.component";
import {SampleArchiveListFilterComponent} from "./sample-list-archive/sample-archive-list-filter.component";
import {SampleMovemHistListFormComponent} from "./sample-form-archive/sample-movem-hist-list-form/sample-movem-hist-list-form.component";
import {SampleMovementsComponent} from "./sample-form-archive/sample-movements/sample-movements.component";
import {SampleMovementsInfoComponent} from "./sample-form-archive/sample-movements/sample-movements-info.component";
import {SampleMovementsResolve} from "./sample-form-archive/sample-movements/sample-movements-resolve.service";

@NgModule({
  imports: [SharedModule, SampleArchiveRoutingModule],
  declarations: [
    SampleArchiveListComponent,
    SampleArchiveListFilterComponent,
    SampleMovemHistListFormComponent,
    SampleMovementsComponent,
    SampleMovementsInfoComponent
  ],
  exports: [],
  providers: [SampleMovementsResolve]
})

export class SampleArchiveModule {}
