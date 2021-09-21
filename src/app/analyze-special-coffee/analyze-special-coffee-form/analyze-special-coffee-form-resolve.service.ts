import { Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { ErrorHandler } from '../../shared/errors/error-handler';
import {ClassificationVersion} from "../../classification/classification-version";
import {ClassificationService} from "../../classification/classification.service";

@Injectable()
export class AnalyzeSpecialCoffeeFormResolve implements Resolve<ClassificationVersion> {
	constructor(
		private service: ClassificationService,
		private router: Router,
		private errorHandler: ErrorHandler
	) {}

	resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
		if (!route.params['id']) {
			const classification = ClassificationVersion.fromData();
			return Promise.resolve(classification);
		}

		const id = route.params['id'];

		return this.service
			.findVersion(id)
			.then(classification => {
				if (classification) {
					return classification;
				} else {
					this.router.navigate(['/analyze-special-coffee']);
					return false;
				}
			})
			.catch(error => this.errorHandler.fromServer(error));
	}
}
