import {DepartmentService} from "../department.service";
import {Department} from "../department";
import {Observable} from "rxjs/Observable";
import {ActivatedRouteSnapshot, Resolve, Router} from "@angular/router";
import {Injectable} from "@angular/core";

@Injectable()
export class DepartmentFormResolve implements Resolve<Department> {
  constructor(private service: DepartmentService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    if (!route.params['id']) {
      return Promise.resolve(new Department());
    }
    let id = route.params['id'];
    return this.service.find(id).then(department => {
      if (department) {
        return department;
      } else {
        this.router.navigate(['/department']);
        return false;
      }
    });
  }
}
