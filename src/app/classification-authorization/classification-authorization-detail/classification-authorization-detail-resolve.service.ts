import { Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ClassificationAuthorizationService } from '../classification-authorization.service';
import { ClassificationVersion } from '../../classification/classification-version';

@Injectable()
export class ClassificationAuthorizationDetailResolve
	implements Resolve<ClassificationVersion> {
	constructor(
		private service: ClassificationAuthorizationService,
		private router: Router
	) {}

	resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
		if (!route.params['id']) {
			this.router.navigate(['/classification-authorization']);
			return false;
		}
		let id = route.params['id'];
		return this.service.findVersion(id).then(classificationVersion => {
			if (classificationVersion) {
				return classificationVersion;
			} else {
				this.router.navigate(['/classification-authorization']);
				return false;
			}
		});
	}
}
