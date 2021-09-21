import { Component, OnInit, OnDestroy } from '@angular/core';
import { Search } from '../../shared/search/search';
import { StorageUnitBatchLog } from '../storage-unit-batch-log';
import { StorageUnitBatchLogService } from '../storage-unit-batch-log.service';
import { Logger } from '../../shared/logger/logger';
import { ErrorHandler } from '../../shared/errors/error-handler';
import { Notification } from '../../shared/notification/notification';
import { AccessToken } from '../../auth/access-token';
import { Page } from '../../shared/page/page';
import { StorageUnitBatchLogFilter } from 'app/storage-unit-batch-log/storage-unit-batch-log-list/storage-unit-batch-log-filter';
import { BatchOperationFilter } from 'app/batch-operation/batch-operation-list/batch-operation-filter';
import {StorageUnitMovementType} from "../storage-unit-movement-type";

@Component({
  selector: 'app-storage-unit-batch-log-list',
  templateUrl: './storage-unit-batch-log-list.component.html'
})
export class StorageUnitBatchLogListComponent implements OnInit {
  loading: boolean;
  page: Page<StorageUnitBatchLog> = new Page<StorageUnitBatchLog>();

  search: Search = new Search();
  filter: StorageUnitBatchLogFilter;

  constructor(private storageUnitLogService: StorageUnitBatchLogService,
    private errorHandler: ErrorHandler,
    private logger: Logger) { }

  ngOnInit() {
    this.page.setItemsPerPage(40);
    this.loadList();
    this.page.changeQuery.subscribe(() => {
      this.loadList();
    });
    this.search
      .subscribe(() => {
        this.loadList();
      });
  }

  filterList(filter: StorageUnitBatchLogFilter) {
    this.filter = filter;
    this.loadList();
  }

  loadList() {
    this.loading = true;
    return this.storageUnitLogService.listPaged(this.filter, this.page).then((page) => {
      this.page = page;
      this.loading = false;
    }).catch(error => this.handleError(error));
  }

  handleError(error) {
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }

  batchOperationLabel(storageBatchLog: StorageUnitBatchLog){
    var label = "";
    if(storageBatchLog.batch.batchOperation){
      label += storageBatchLog.batch.batchOperation.batchOperationCode
    }
    if(storageBatchLog.sellCode){
      label += "\n" + storageBatchLog.sellCode;
    }
    return label;
  }

}
