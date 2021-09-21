import { Component, OnInit, OnDestroy } from '@angular/core';
import { Notification } from './../../shared/notification/notification';
import { ErrorHandler, ModalManager, Search } from '../../shared/shared.module';
import { Logger } from '../../shared/logger/logger';
import { Page } from '../../shared/page/page';
import { IndicatedSpecialCoffeeService } from '../indicated-special-coffee.service';
import { ClassificationVersion } from '../../classification/classification-version';
import {User} from "../../user/user";
import {UserService} from "../../user/user.service";
import {ClassificationVersionFilter} from "./classification-version-filter";
import {ClassificationProcessStatus} from "../../classification/classification-process-status";
import {SpecialCoffeeSituation} from "../../classification/special-coffee-situation";

@Component({
	selector: 'app-indicated-special-coffee-list',
	templateUrl: './indicated-special-coffee-list.component.html'
})
export class IndicatedSpecialCoffeeListComponent
	implements OnInit, OnDestroy {
	loading: boolean;
	error: boolean;
	page: Page<ClassificationVersion> = new Page<ClassificationVersion>();
  filter = new ClassificationVersionFilter();
  awaitingSample = ClassificationProcessStatus.AWAITING_SAMPLE;
  pendingRequest = ClassificationProcessStatus.PENDING_REQUEST;

	get classificationsVersions(): ClassificationVersion[] {
		return this.page.data;
	}

	constructor(
		private indicatedSpecialCoffeeService: IndicatedSpecialCoffeeService,
		private errorHandler: ErrorHandler,
		private logger: Logger
	) {}

	ngOnInit() {
		Notification.clearErrors();
    this.page.changeQuery.subscribe(() => {
      this.loadList();
    });
		this.loadList(true);
  }

  filterList(filter) {
    this.filter = filter;
    this.loadList();
  }

  loadList(firstLoading = false) {
    this.error = false;
    if (firstLoading) {
      this.filter.classificationProcessStatus = ClassificationProcessStatus.PENDING_REQUEST.code;
    }
    this.indicatedSpecialCoffeeService
      .listPaged(this.filter, this.page)
      .then(() => {
        this.loading = false;
      })
      .catch(error => this.handleError(error));
  }

	ngOnDestroy() {
		this.page.changeQuery.unsubscribe();
	}

	handleError(error) {
		this.error = true;
		this.loading = false;
		return this.errorHandler.fromServer(error);
	}

  requestSample(classificationVersionId) {
    this.error = false;
    this.loading = true;
    this.indicatedSpecialCoffeeService.updateClassificationProcessStatus(classificationVersionId, ClassificationProcessStatus.AWAITING_SAMPLE)
      .then(() => {
        this.loading = false;
        Notification.success('Amostra solicitada com sucesso!');
        this.loadList();
      })
      .catch(error => this.handleError(error));
  }

  sampleReceived(classificationVersionId) {
    this.error = false;
    this.loading = true;
    this.indicatedSpecialCoffeeService.updateClassificationProcessStatus(classificationVersionId, ClassificationProcessStatus.SAMPLE_RECEIVED)
      .then(() => {
        this.loading = false;
        Notification.success('Amostra recebida com sucesso!');
        this.loadList();
      })
      .catch(error => this.handleError(error));
  }
}
