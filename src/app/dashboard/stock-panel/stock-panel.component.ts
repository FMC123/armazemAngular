import { Component, OnInit, OnDestroy } from '@angular/core';
import { StockPanel } from './stock-panel';
import { StockPanelService } from './stock-panel.service';
import { ErrorHandler } from '../../shared/shared.module';
import { Subscription, Observer } from 'rxjs';
import { Observable } from 'rxjs/Observable';

@Component({
	selector: 'app-stock-panel',
	templateUrl: 'stock-panel.component.html'
})
export class StockPanelComponent implements OnInit, OnDestroy {
	loading = true;
	error = false;
	collapsed = false;
	stockPanel: StockPanel;
	subscription: Subscription;

	constructor(
		private stockPanelService: StockPanelService,
		private errorHandler: ErrorHandler
	) {}

	ngOnInit() {
		this.loading = true;
		this.load();
	}

	subscribe() {
		const period = 30 * 1000;

		this.subscription = Observable.timer(period, period).subscribe(() => {
			this.load();
		});
	}

	ngOnDestroy() {
		if (this.subscription && !this.subscription.closed) {
			this.subscription.unsubscribe();
		}
	}

	load() {
		this.stockPanelService
			.load()
			.then(stockPanel => {
				this.stockPanel = stockPanel;
				this.loading = false;
				this.error = false;
			})
			.catch(error => {
				this.errorHandler.fromServer(error);
				this.loading = false;
				this.error = true;
			});
	}

  collapse() {
    this.collapsed = !this.collapsed;
  }
}
