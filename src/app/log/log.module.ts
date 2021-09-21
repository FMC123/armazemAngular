import { SharedModule } from '../shared/shared.module';
import { LogModalComponent } from './log-modal.component';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [
    SharedModule
  ],
  exports: [
    LogModalComponent
  ],
  declarations: [
    LogModalComponent
  ],
  providers: [],
})
export class LogModule { }
