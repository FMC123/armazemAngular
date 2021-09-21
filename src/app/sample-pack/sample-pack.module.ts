import { NgModule } from '@angular/core';
import { SharedModule } from './../shared/shared.module';
import { SamplePackRoutingModule } from './sample-pack-routing.module';
import { SamplePackFormComponent } from './sample-pack-form/sample-pack-form.component';
import { SamplePackListComponent } from './sample-pack-list/sample-pack-list.component';
import { SamplePackService } from './sample-pack.service';
import { SamplePackDetailComponent } from './sample-pack-detail/simple-pack-detail.component';
import { SampleService } from '../sample/sample.service';

@NgModule({
	imports: [SharedModule, SamplePackRoutingModule],
	declarations: [
		SamplePackFormComponent,
		SamplePackListComponent,
		SamplePackDetailComponent
	],
	exports: [],
	providers: [SamplePackService, SampleService]
})
export class SamplePackModule {}
