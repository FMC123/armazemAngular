import { NgModule } from '@angular/core';

import { StorageUnitMergeRoutingModule, routedComponents } from './storage-unit-merge-routing.module';
import { StorageUnitMergeService } from './storage-unit-merge.service';
import { StorageUnitMergeSearchComponent } from './search/storage-unit-merge-search.component';
import { StorageUnitMergeFormComponent } from 'app/storage-unit/merge/form/storage-unit-merge-form.component';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    StorageUnitMergeRoutingModule,
  ],
  exports: [],
  declarations: [
    ...routedComponents,
    StorageUnitMergeSearchComponent,
    StorageUnitMergeFormComponent,
  ],
  providers: [
    StorageUnitMergeService,
  ],
})
export class StorageUnitMergeModule { }
