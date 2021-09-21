import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { SamplePackReceiveRoutingModule } from './sample-pack-receive-routing.module';
import { SamplePackReceiveFormComponent } from './sample-pack-receive-form/sample-pack-receive-form.component';
import { SamplePackReceiveListComponent } from './sample-pack-receive-list/sample-pack-receive-list.component';
import { SamplePackReceiveDetailComponent } from './sample-pack-receive-detail/simple-pack-receive-detail.component';
import { SamplePackReceiveService } from './sample-pack-receive.service';
import { SampleReceiveService } from './sample-receive.service';

@NgModule({
	imports: [SharedModule, SamplePackReceiveRoutingModule],
	declarations: [
		SamplePackReceiveFormComponent,
		SamplePackReceiveListComponent,
		SamplePackReceiveDetailComponent
	],
	exports: [],
	providers: [SamplePackReceiveService, SampleReceiveService]
})
export class SamplePackAuthModule { }
