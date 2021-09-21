import { Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ErrorHandler } from 'app/shared/errors/error-handler';
import { ClassificationAuthorizationService } from '../classification-authorization.service';
import { ClassificationVersion } from '../../classification/classification-version';

@Injectable()
export class ClassificationAuthorizationFormResolve
	implements Resolve<ClassificationVersion> {
	constructor(
		private service: ClassificationAuthorizationService,
		private router: Router,
		private errorHandler: ErrorHandler
	) {}

	resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
		if (!route.params['id']) {
			const classificationVersion = ClassificationVersion.fromData();
			return Promise.resolve(classificationVersion);
		}

		const id = route.params['id'];

		return this.service
			.findVersion(id)
			.then(classificationVersion => {
				if (classificationVersion) {
					return classificationVersion;
				} else {
					this.router.navigate(['/classification-authorization']);
					return false;
				}
			})
			.catch(error => this.errorHandler.fromServer(error));
	}
}
