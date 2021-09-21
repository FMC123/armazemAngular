import { ActivatedRouteSnapshot, Resolve, Router } from "@angular/router";
import { PositionService } from "../../position/position.service";
import { Position } from "../../position/position";
import { Observable } from "rxjs/Observable";
import { Injectable } from "@angular/core";
import { PositionType } from "../../position/position-type";
import { AuthService } from "../../auth/auth.service";

@Injectable()
export class SilosLungSilosResolve implements Resolve<Position>{

  constructor(private auth: AuthService,
    private service: PositionService,
    private router: Router) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    return this.service
      .listByWarehouseAndType(this.auth.accessToken.warehouse.id, PositionType.SILO, true)
      .then(positions => {
        if (positions) {
          return Position.fromListData(positions);
        } else {
          return [];
        }
      });
  }
}