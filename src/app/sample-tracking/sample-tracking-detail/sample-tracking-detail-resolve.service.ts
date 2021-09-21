import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve, Router} from "@angular/router";
import {ErrorHandler} from "../../shared/errors/error-handler";
import {Observable} from "rxjs/Observable";
import {SampleTrackingService} from "../sample-tracking.service";
import {SampleTracking} from "../sample-tracking";

@Injectable()
export class SampleTrackingDetailsResolve implements Resolve<SampleTracking> {
  constructor(
    private service: SampleTrackingService,
    private router: Router,
    private errorHandler: ErrorHandler) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    if (!route.params['id']) {
      this.router.navigate(['/sample-tracking']);
      return false;
    }
    let id = route.params['id'];
    return this.service.find(id).then(sampleTracking => {
      if (sampleTracking) {
        return sampleTracking;
      } else {
        this.router.navigate(['/sample-tracking']);
        return false;
      }
    }).catch((error) => this.errorHandler.fromServer(error));
  }

}
