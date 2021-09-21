import { Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ErrorHandler } from 'app/shared/errors/error-handler';
import { IndicationSpecialCoffee } from "./indication-special-coffee";
import { IndicationSpecialCoffeService } from './indication-special-coffee.service';

@Injectable()
export class IndicationSpecialCoffeeResolve
    implements Resolve<IndicationSpecialCoffee> {
    constructor(
        private service: IndicationSpecialCoffeService,
        private router: Router,
        private errorHandler: ErrorHandler
    ) { }

    resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
        let id = route.params['id'];
        return id;
    }
}