import {Endpoints} from '../endpoints';
import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';

import {AuthService} from '../auth/auth.service';
import {ServiceInstructionItem} from "../service-instruction/service-instruction-item";
import {ServiceOrder} from "./service-order";


@Injectable()
export class ServiceOrderService {
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http,
              private auth: AuthService) {
  }

  listByInstruction(serviceInstructionId): Promise<Array<ServiceOrder>> {
    return this.http.get(Endpoints.serviceChargeURL + '/service-instruction/' + serviceInstructionId)
      .toPromise()
      .then(response => {
        let data = response.json().map(so => {
          return {
            id: so.id,
            sacksQuantity: so.serviceItemSackQuantity,
            service: so.serviceItem,
          }
        });
        return ServiceOrder.fromListData(data);
      });
  }

  listByInstructionAndItem(serviceInstructionId, itemId): Promise<Array<ServiceOrder>> {
    return this.http.get(
      Endpoints.serviceChargeURL +
      '/service-instruction/' +
      serviceInstructionId +
      '/item/' +
      itemId
    )
      .toPromise()
      .then(response => {
        return ServiceOrder.fromListData(response.json());
      });
  }

  save(
    serviceInstructionId: string,
    serviceInstructionsItemsToCharge: Array<ServiceInstructionItem>
  ): Promise<any> {
    return this.create(serviceInstructionId, serviceInstructionsItemsToCharge);
  }

  private create(
    serviceInstructionId: string,
    serviceInstructionsItemsToCharge: Array<ServiceInstructionItem>
  ): Promise<any> {
    const url = `${Endpoints.serviceChargeURL + '/generatePartialCharging/'}`
    return this.http
      .post(
        Endpoints.serviceChargeURL +
        '/generatePartialCharging/' +
        serviceInstructionId,
        JSON.stringify(serviceInstructionsItemsToCharge),
        {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(() => null);
  }
}
