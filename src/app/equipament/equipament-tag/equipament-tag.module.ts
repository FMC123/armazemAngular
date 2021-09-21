import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { EquipamentTagFormComponent } from './equipament-tag-form/equipament-tag-form.component';
import { EquipamentTagListComponent } from './equipament-tag-list/equipament-tag-list.component';
import { EquipamentTagRoutingModule } from './equipament-tag-routing.module';
import { EquipamentTagService } from './equipament-tag.service';

@NgModule({
  imports: [
    SharedModule,
    EquipamentTagRoutingModule,
  ],
  declarations: [
    EquipamentTagListComponent,
    EquipamentTagFormComponent,
  ],
  exports: [
    EquipamentTagListComponent,
  ],
  providers: [
    EquipamentTagService,
  ]
})
export class EquipamentTagModule { }
