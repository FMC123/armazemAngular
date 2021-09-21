import { Injectable, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { Http } from '@angular/http';
import { Endpoints } from '../endpoints';
import { AutomationSemaphoreLog } from './automation-semaphore-log';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class AutomationSemaphoreService implements OnDestroy {
	subscription: Subscription;
	current: AutomationSemaphoreLog;

	get isOk() {
		return this.current && this.current.status === 'OK';
	}

	constructor(private http: Http, private auth: AuthService) {
		this.subscription = Observable.timer(10000, 10000).subscribe(() => {
			if (!this.auth.authenticated) {
				return;
			}

			this.read()
				.then(current => {
					this.current = current;
				})
				.catch(error => {
					this.current = null;
					console.error(error);
				});
		});
	}

	ngOnDestroy() {
		if (this.subscription && !this.subscription.closed) {
			this.subscription.unsubscribe();
		}
	}

	read() {
		return this.http
			.get(Endpoints.automationSemaphoreUrl)
			.toPromise()
			.then(response => {
				return AutomationSemaphoreLog.fromData(response.json());
			});
	}
}
