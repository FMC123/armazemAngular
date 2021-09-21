import { MarkupGroup } from '../../markup-group/markup-group';
import { MarkupGroupService } from '../../markup-group/markup-group.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { Transportation } from '../../transportation/transportation';
import { TransportationService } from '../../transportation/transportation.service';
import { ShippingAuthorizationService } from '../shipping-authorization.service';
import { ErrorHandler } from 'app/shared/errors/error-handler';

  @Injectable()
  export class ShippingAuthorizationBatchOperationFormResolve implements Resolve<Transportation> {
    constructor(
      private shippingAuthorizationService: ShippingAuthorizationService,
      private transportationService: TransportationService,
      private markupGroupService: MarkupGroupService,
      private router: Router,
      private errorHandler: ErrorHandler
    ) {}

    resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
      return Promise.all([
        this.transportationService.find(route.params['transportationId']),
        this.shippingAuthorizationService.find(route.params['id'])
      ])
        .then((responses) => {
          const transportation = <any> responses[0];
          const shippingAuthorization = <any> responses[1];

          if (!transportation || !shippingAuthorization) {
            this.router.navigate(['/shipping-authorization']);
            return false;
          }

          transportation.batchOperationOut.shippingAuthorization = shippingAuthorization;
          return transportation;
        })
        .then((transportation: Transportation) => {
          if (
            transportation.batchOperationOut.markupGroup
            && transportation.batchOperationOut.markupGroup.id
          ) {
            return this.markupGroupService.find(transportation.batchOperationOut.markupGroup.id)
              .then((markupGroup) => {
                transportation.batchOperationOut.markupGroup = markupGroup;
                return transportation;
              });
          }

          transportation.batchOperationOut.markupGroup = new MarkupGroup();
          return transportation;
        })
        .catch((error) => this.errorHandler.fromServer(error));
    }
  }
