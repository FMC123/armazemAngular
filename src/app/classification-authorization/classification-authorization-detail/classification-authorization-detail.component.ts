import { ModalManager } from '../../shared/modals/modal-manager';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Notification } from '../../shared/notification';
import { ClassificationAuthorizationService } from '../classification-authorization.service';
import { ClassificationVersion } from '../../classification/classification-version';

@Component({
	selector: 'app-classification-authorization-detail',
	templateUrl: './classification-authorization-detail.component.html'
})
export class ClassificationAuthorizationDetailComponent implements OnInit {
	classificationVersion: ClassificationVersion;
	constructor(private route: ActivatedRoute) {}

	ngOnInit() {
		Notification.clearErrors();
		this.route.data.forEach(
			(data: { classificationVersion: ClassificationVersion }) => {
				this.classificationVersion = data.classificationVersion;
			}
		);
	}
}
