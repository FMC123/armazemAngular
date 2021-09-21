import {Injectable} from "@angular/core";
import {AuthService} from "../auth/auth.service";
import {ActivatedRouteSnapshot, Resolve, Router} from "@angular/router";
import {ErrorHandler} from "../shared/errors/error-handler";
import {ClassificationService} from "./classification.service";
import {Observable} from "rxjs";
import {ClassificationVersion} from "./classification-version";

@Injectable()
export class ClassificationVersionAllResolveService implements Resolve<Array<ClassificationVersion>> {
  constructor(
    private auth: AuthService,
    private router: Router,
    private errorHandler: ErrorHandler,
    private service: ClassificationService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    return this.service
      .sync(this.auth.accessToken.warehouse.id, null)
      .then(list => {
        return list || [];
      })
      .catch((error) => this.errorHandler.fromServer(error));
  }
}
