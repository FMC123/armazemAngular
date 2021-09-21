import { MarkupGroupsResolve } from './markup-groups-resolve.service';
import { SharedModule } from '../shared/shared.module';
import { MarkupGroupService } from './markup-group.service';
import { NgModule } from '@angular/core';


@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [],
  declarations: [],
  providers: [
    MarkupGroupService,
    MarkupGroupsResolve,
  ],
})
export class MarkupGroupModule { }
