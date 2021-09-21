import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';
import { StackFormComponent } from './stack-form/stack-form.component';
import { StackDetailsComponent } from './stack-list-details/stack-list-details.component';
import { StackListInfoComponent } from './stack-list-details/stack-list-info.component';
import { StackRoutingModule } from './stack.routing';
import { StackService } from './stack.service';

@NgModule({
  imports: [
    SharedModule,
    StackRoutingModule,
  ],
  declarations: [
    StackFormComponent,
    StackListInfoComponent,
    StackDetailsComponent,
  ],
  providers: [
    StackService,
  ]
})

export class StackModule { }
