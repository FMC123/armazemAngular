import {Notification} from '../../shared/notification';
import {ErrorHandler} from '../../shared/errors/error-handler';
import {Logger} from '../../shared/logger/logger';
import {Router} from '@angular/router';
import {BatchSwapHistoryService} from '../batch-swap-history.service';
import {BatchSwapHistoryFilter} from './batch-swap-history-filter';
import {ModalManager} from '../../shared/modals/modal-manager';
import {Observable, Subscription} from 'rxjs/Rx';
import {Page} from '../../shared/page/page';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {ParameterService} from "../../parameter/parameter.service";
import {BatchSwapHistory} from "../batch-swap-history";

@Component({
  selector: 'app-batch-swap-list',
  templateUrl: 'batch-swap-history-list.component.html'
})

export class BatchSwapHistoryListComponent implements OnInit, OnDestroy {
  loading: boolean;
  error: boolean;
  page: Page<BatchSwapHistory> = new Page<BatchSwapHistory>();
  refresherSubscription: Subscription;
  filter = new BatchSwapHistoryFilter();
  // deleteConfirm = new ModalManager();
  // cancelConfirm = new ModalManager();

  constructor(
    private service: BatchSwapHistoryService,
    private parameterService: ParameterService,
    private errorHandler: ErrorHandler,
    private router: Router,
    private logger: Logger,
  ) {
  }

  ngOnInit() {
    Notification.clearErrors();
    this.loadList();
    this.page.changeQuery.subscribe(() => {
      this.loadList();
    });
    this.setupAutoRefresher();
  }

  ngOnDestroy() {
    if (this.refresherSubscription) {
      this.refresherSubscription.unsubscribe();
    }
    this.page.changeQuery.unsubscribe();
  }

  setupAutoRefresher() {
    this.refresherSubscription = Observable.timer(5000, 5000).subscribe(() => {
      this.loadList(true);
    });
  }

  filterList(filter) {
    this.filter = filter;
    this.loadList();
  }

  loadList(skipLoading = false) {
    this.error = false;

    if (!skipLoading) {
      this.loading = true;
    }

    this.service
      .listPaged(this.filter, this.page)
      .then(() => {
        this.loading = false;
      }).catch(error => this.handleError(error));
  }

  // delete(
  //   id: string
  // ) {
  //   this.loading = true;
  //   return this.service
  //     .delete(id)
  //     .then(() => {
  //       Notification.success('Funfou');
  //       this.loadList();
  //     })
  //     .catch(error => this.handleError(error));
  // }

  handleError(error) {
    this.error = true;
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }
}
