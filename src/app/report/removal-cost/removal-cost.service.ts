import { Headers, Http, ResponseContentType, URLSearchParams } from "@angular/http";
import { AuthService } from "../../auth/auth.service";
import { Endpoints } from "../../endpoints";
import { Injectable } from "@angular/core";
import { MarkupGroup } from "../../markup-group/markup-group";
import { RemovalCost } from "./removal-cost";
import { Batch } from "../../batch/batch";
import { StorageUnit } from "../../storage-unit/storage-unit";

@Injectable()
export class RemovalCostService {
  private headers = new Headers({ 'Content-Type': 'application/json' });
  constructor(private http: Http,
    private auth: AuthService) {
  }

  calculateRemovalCostMarkupGroup(markupGroups: Array<MarkupGroup>): Promise<any> {
    let params = new URLSearchParams();

    if (markupGroups && markupGroups.length) {
      markupGroups.forEach(value => {
        params.append('id', value.id);
      })
    }

    return this.http
      .get(
        Endpoints.removalCostMarkupGroupReport,
        { search: params }
      )
      .toPromise()
      .then(response => {
        return RemovalCost.fromListData(response.json());
      });
  }

  downloadRemovalCostMarkupGroup(markupGroups: Array<MarkupGroup>): Promise<void> {
    let params = new URLSearchParams();

    if (markupGroups && markupGroups.length) {
      markupGroups.forEach(value => {
        params.append('id', value.id);
      })
    }

    return this.http.get(
      Endpoints.removalCostMarkupGroupReport.concat("/pdf"),
      {
        responseType: ResponseContentType.Blob,
        search: params,
      }
    )
      .toPromise()
      .then(response => {
        let url = window.URL.createObjectURL(response.blob());
        window.open(url);
      });
  }

  calculateRemovalCostBatch(batches: Array<Batch>): Promise<any> {
    let params = new URLSearchParams();

    if (batches && batches.length) {
      batches.forEach(value => {
        params.append('id', value.id);
      })
    }

    return this.http
      .get(
        Endpoints.removalCostBatchReport,
        { search: params }
      )
      .toPromise()
      .then(response => {
        return RemovalCost.fromListData(response.json());
      });
  }

  calculateRemovalCostStorageUnit(storageUnits: Array<StorageUnit>): Promise<any> {
    let params = new URLSearchParams();

    if (storageUnits && storageUnits.length) {
      storageUnits.forEach(value => {
        params.append('id', value.id);
      })
    }

    return this.http
      .get(
        Endpoints.removalCostStorageUnitReport,
        { search: params }
      )
      .toPromise()
      .then(response => {
        return RemovalCost.fromListData(response.json());
      });
  }

  downloadRemovalCostMarkupGroupCSV(markupGroups: Array<MarkupGroup>): Promise<Array<RemovalCost>> {
    let params = new URLSearchParams();

    if (markupGroups && markupGroups.length) {
      markupGroups.forEach(value => {
        params.append('id', value.id);
      })
    }

    return this.http.get(
      Endpoints.removalCostMarkupGroupReport.concat("/excel"),
      {
        responseType: ResponseContentType.Json,
        search: params,
      }
    )
      .toPromise()
      .then(response => {
        return RemovalCost.fromListData(response.json());
      });
  }
}
