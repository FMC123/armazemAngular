import { Injectable } from '@angular/core';
import {Headers, Http, URLSearchParams} from "@angular/http";
import {AuthService} from "../../auth/auth.service";
import {Endpoints} from "../../endpoints";
import {WarehouseStakeholder} from "../warehouse-stakeholder";
import {WarehouseStakeholderCertificate} from "./warehouse-stakeholder-certificate";

@Injectable()
export class WarehouseStakeholderCertificateService {
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http,
              private auth: AuthService) {
  }


  findOne(id: number | string) {
    let url = `${Endpoints.WarehouseStakeholderCertificateUrl}/${id}`;
    return this.http.get(url)
      .toPromise()
      .then(response => {
        let warehouseStakeholderCertificate = WarehouseStakeholderCertificate.fromData(response.json());
        return warehouseStakeholderCertificate;
      });
  }

  findOneValidByStakeholder(stakeholderId: number | string, certificateId: number | string) {
    let url = `${Endpoints.WarehouseStakeholderCertificateUrl}/${stakeholderId}/${certificateId}`;
    return this.http.get(url)
      .toPromise()
      .then(response => {
        let warehouseStakeholderCertificate = WarehouseStakeholderCertificate.fromData(response.json());
        return warehouseStakeholderCertificate;
      });
  }

  listAllValidByWarehouse(): Promise<Array<WarehouseStakeholderCertificate>> {

    return this.http.get(
      `${Endpoints.WarehouseStakeholderCertificateUrl}/warehouse/`
    )
      .toPromise()
      .then(response => {
        return WarehouseStakeholderCertificate.fromListData(response.json());
      });
  }

  findOneValidByWarehouse(certificateId: number | string) {
    let url = `${Endpoints.WarehouseStakeholderCertificateUrl}/warehouse/${certificateId}`;
    return this.http.get(url)
      .toPromise()
      .then(response => {
        let warehouseStakeholderCertificate = WarehouseStakeholderCertificate.fromData(response.json());
        return warehouseStakeholderCertificate;
      });
  }

  listValidByStakeholder(stakeholderId: string | number, search?: string): Promise<Array<WarehouseStakeholderCertificate>> {
    return this.http.get(
      `${Endpoints.WarehouseStakeholderCertificateUrl}/list/${stakeholderId}`
    )
      .toPromise()
      .then(response => {
        return WarehouseStakeholderCertificate.fromListData(response.json());
      });
  }

  listAllByStakeholder(stakeholderId: string | number, search?: string): Promise<Array<WarehouseStakeholderCertificate>> {
    return this.http.get(
      `${Endpoints.WarehouseStakeholderCertificateUrl}/listAll/${stakeholderId}`
    )
      .toPromise()
      .then(response => {
        return WarehouseStakeholderCertificate.fromListData(response.json());
      });
  }

  save(certificate: WarehouseStakeholderCertificate) : Promise<WarehouseStakeholderCertificate>{
    if(certificate.id){
      return this.update(certificate);
    }else{
      return this.create(certificate);
    }
  }

  delete(id: number | string): Promise<void> {
    let url = `${Endpoints.WarehouseStakeholderCertificateUrl}/${id}`;
    return this.http.delete(url,
      { headers: this.auth.appendOrCreateAuthHeader(this.headers) })
      .toPromise()
      .then(() => null);
  }

  private create(certificate: WarehouseStakeholderCertificate): Promise<WarehouseStakeholderCertificate> {
    return this.http
      .post(
        Endpoints.WarehouseStakeholderCertificateUrl,
        certificate,
        { headers: this.auth.appendOrCreateAuthHeader(this.headers) }
      )
      .toPromise()
      .then(res => res.json().data);
  }

  private update(certificate: WarehouseStakeholderCertificate): Promise<WarehouseStakeholderCertificate> {
    const url = `${Endpoints.WarehouseStakeholderCertificateUrl}/${certificate.id}`;
    return this.http
      .put(
        url,
        certificate,
        { headers: this.auth.appendOrCreateAuthHeader(this.headers) }
      )
      .toPromise()
      .then(() => certificate);
  }

}
