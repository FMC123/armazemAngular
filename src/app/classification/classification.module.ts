import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from './../shared/shared.module';

import { ClassificationListComponent } from './classification-list/classification-list.component';
import { ClassificationRoutingModule } from './classification-routing.module';
import { UserService } from '../user/user.service';
import { ClassificationService } from './classification.service';
import { ClassificationFormComponent } from './classification-form/classification-form.component';
import { ClassificationItemFormComponent } from './classification-form/classification-item-form.component';
import { ClassificationDetailsComponent } from './classification-details/classification-details.component';
import { ClassificationListSampleComponent } from './classification-list/sample/classification-list-sample.component';
import {ClassificationVersionAllResolveService} from "./classification-version-all-resolve.service";

@NgModule({
	imports: [SharedModule, ClassificationRoutingModule],
	declarations: [
		ClassificationListComponent,
		ClassificationFormComponent,
		ClassificationItemFormComponent,
		ClassificationDetailsComponent,
		ClassificationListSampleComponent,
	],
	exports: [
		ClassificationFormComponent,
		ClassificationItemFormComponent,
	],
	providers: [
	  ClassificationService,
    ClassificationVersionAllResolveService
  ]
})
export class ClassificationModule { }
