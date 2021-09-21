import { Component, OnInit, OnDestroy } from '@angular/core';
import { Notification } from './../../shared/notification/notification';
import { ErrorHandler, ModalManager, Search } from '../../shared/shared.module';
import { Logger } from '../../shared/logger/logger';
import { Page } from '../../shared/page/page';
import { ClassificationAuthorizationService } from '../classification-authorization.service';
import { ClassificationVersion } from '../../classification/classification-version';

@Component({
	selector: 'app-classification-authorization-list',
	templateUrl: './classification-authorization-list.component.html'
})
export class ClassificationAuthorizationListComponent
	implements OnInit, OnDestroy {
	loading: boolean;
	error: boolean;
	page: Page<ClassificationVersion> = new Page<ClassificationVersion>();
	search: Search = new Search();

	get classificationsVersions(): ClassificationVersion[] {
		return this.page.data;
	}

	constructor(
		private classificationService: ClassificationAuthorizationService,
		private errorHandler: ErrorHandler,
		private logger: Logger
	) {}

	ngOnInit() {
		Notification.clearErrors();
		this.loadList();

		this.page.changeQuery.subscribe(() => {
			this.loadList();
		});

		this.search.subscribe(() => {
			this.loadList();
		});
	}

	loadList() {
		this.error = false;
		this.loading = true;
		this.classificationService
			.listPaged(this.search.value, this.page)
			.then(() => {
				this.loading = false;
			})
			.catch(error => this.handleError(error));
	}

	ngOnDestroy() {
		this.page.changeQuery.unsubscribe();
		this.search.destroy();
	}

	handleError(error) {
		this.error = true;
		this.loading = false;
		return this.errorHandler.fromServer(error);
	}
}
