import { Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { ErrorHandler } from 'app/shared/errors/error-handler';
import { SamplePack } from '../sample-pack';
import { SamplePackService } from '../sample-pack.service';
import { SamplePackStatus } from '../sample-pack-status';

@Injectable()
export class SamplePackFormResolve implements Resolve<SamplePack> {
	constructor(
		private service: SamplePackService,
		private router: Router,
		private errorHandler: ErrorHandler
	) {}

	resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
		if (!route.params['id']) {
			const sample = new SamplePack();
			sample.code = 'Automático';
			sample.statusObject = SamplePackStatus.QUEUED;
			return Promise.resolve(sample);
		}
		let id = route.params['id'];
		return this.service
			.find(id)
			.then(samplePack => {
				if (samplePack) {
					return samplePack;
				} else {
					this.router.navigate(['/sample-pack']);
					return false;
				}
			})
			.catch(error => this.errorHandler.fromServer(error));
	}
}
