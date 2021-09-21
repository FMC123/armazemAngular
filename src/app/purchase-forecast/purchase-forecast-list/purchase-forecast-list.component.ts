import { PurchaseForecastFilter } from './purchase-forecast-filter';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalManager } from '../../shared/modals/modal-manager';
import { Observable, Subscription } from 'rxjs/Rx';
import { Page } from '../../shared/page/page';
import { Notification } from '../../shared/notification';
import { ErrorHandler } from '../../shared/errors/error-handler';
import { PurchaseForecastService } from '../purchase-forecast.service';
import { Logger } from '../../shared/logger/logger';
import { PurchaseForecast } from '../purchase-forecast';
import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
	selector: 'app-purchase-forecast-list',
	templateUrl: 'purchase-forecast-list.component.html'
})
export class PurchaseForecastListComponent implements OnInit, OnDestroy {
	loading: boolean;
	error: boolean;
	page: Page<PurchaseForecast> = new Page<PurchaseForecast>();
	refresherSubscription: Subscription;
	selectModal = new ModalManager();
	filter = new PurchaseForecastFilter();

	constructor(
		private service: PurchaseForecastService,
		private errorHandler: ErrorHandler,
		private router: Router,
		private route: ActivatedRoute,
		private logger: Logger
	) {}

	ngOnInit() {
		Notification.clearErrors();

		this.loadList();
		this.page.changeQuery.subscribe(() => {
			this.loadList();
		});
		this.setupAutoRefresher();
	}

	ngOnDestroy() {
		if (this.refresherSubscription && !this.refresherSubscription.closed) {
			this.refresherSubscription.unsubscribe();
		}

		this.refresherSubscription = null;

		this.page.changeQuery.unsubscribe();
	}

	setupAutoRefresher() {
		this.refresherSubscription = Observable.timer(5000, 5000).subscribe(() => {
			this.loadList(true);
		});
	}

	filterList(filter) {
		this.filter = filter;
		this.loadList();
	}

	loadList(skipLoading = false) {
		this.error = false;
		if (!skipLoading) {
			this.loading = true;
		}
		this.service
			.listPagedWithStatus(this.filter, this.page)
			.then(() => {
				this.loading = false;
			})
			.catch(error => this.handleError(error));
	}

	onSelect(transportation, purchaseForecast) {
		this.router.navigate(['/transportation', 'in', transportation.id, 'edit'], {
			queryParams: { purchaseForecastId: purchaseForecast.id }
		});
	}

	handleError(error) {
		this.error = true;
		this.loading = false;
		return this.errorHandler.fromServer(error);
	}
}
