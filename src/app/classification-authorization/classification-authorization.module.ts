import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from './../shared/shared.module';
import { UserService } from '../user/user.service';
import { ClassificationAuthorizationRoutingModule } from './classification-authorization-routing.module';
import { ClassificationAuthorizationListComponent } from './classification-authorization-list/classification-authorization-list.component';
import { ClassificationAuthorizationDetailComponent } from './classification-authorization-detail/classification-authorization-detail.component';
import { ClassificationAuthorizationInfoComponent } from './classification-authorization-detail/classification-authorization-info.component';
import { ClassificationAuthorizationService } from './classification-authorization.service';
import { ClassificationAuthorizationFormComponent } from './classification-authorization-form/classification-authorization-form.component';
import { ClassificationAuthorizationItemFormComponent } from './classification-authorization-form/classification-authorization-item-form.component';

@NgModule({
	imports: [SharedModule, ClassificationAuthorizationRoutingModule],
	declarations: [
		ClassificationAuthorizationFormComponent,
		ClassificationAuthorizationListComponent,
		ClassificationAuthorizationInfoComponent,
		ClassificationAuthorizationDetailComponent,
		ClassificationAuthorizationItemFormComponent
	],
	providers: [ClassificationAuthorizationService]
})
export class ClassificationAuthorizationModule {}
