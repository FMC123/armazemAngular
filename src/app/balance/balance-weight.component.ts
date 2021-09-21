import { NavigationExtras, Router } from '@angular/router';
import { BalanceService } from './balance.service';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';

@Component({
	selector: 'app-balance-weight',
	templateUrl: 'balance-weight.component.html'
})
export class BalanceWeightComponent implements OnInit, OnDestroy {
	private subscription: Subscription;

	constructor(private service: BalanceService, private router: Router) {}

	ngOnInit() {
		this.subscription = Observable.timer(2000, 2000).subscribe(() => {
			this.service.refreshWeight();
		});
	}

	ngOnDestroy() {
		if (this.subscription && !this.subscription.closed) {
			this.subscription.unsubscribe();
		}
	}

	get weight() {
		return this.service.weight;
	}

	get scale() {
		return this.service.scale;
	}

	selectNewScale() {
		this.router.navigate(['/balance']).then(() => {
			this.service.scale = null;
		});
	}
}
