import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { AutomationSemaphoreComponent } from './automation-semaphore.component';
import { AutomationSemaphoreService } from './automation-semaphore.service';

@NgModule({
	imports: [SharedModule],
	exports: [AutomationSemaphoreComponent],
	declarations: [AutomationSemaphoreComponent],
	providers: [AutomationSemaphoreService]
})
export class AutomationSemaphoreModule {}
