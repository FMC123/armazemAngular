import { Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ErrorHandler } from '../../shared/shared.module';
import {SamplePack} from "../../sample-pack/sample-pack";
import {SamplePackReceiveService} from "../sample-pack-receive.service";
import {SamplePackStatus} from "../../sample-pack/sample-pack-status";

@Injectable()
export class SamplePackReceiveFormResolve implements Resolve<SamplePack> {
	constructor(
		private service: SamplePackReceiveService,
		private router: Router,
		private errorHandler: ErrorHandler
	) { }

	resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
		if (!route.params['id']) {
			const sample = new SamplePack();
			sample.code = 'Automático';
			sample.statusObject = SamplePackStatus.QUEUED;
			return Promise.resolve(sample);
		}
		const id = route.params['id'];
		return this.service
			.find(id)
			.then(samplePack => {
				if (samplePack) {
					return samplePack;
				} else {
					this.router.navigate(['/sample-pack-receive']);
					return false;
				}
			})
			.catch(error => this.errorHandler.fromServer(error));
	}
}
