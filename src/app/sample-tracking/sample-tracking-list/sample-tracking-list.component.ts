import { Component, OnDestroy, OnInit } from '@angular/core';
import { Page } from "../../shared/page/page";
import { Search } from "../../shared/search/search";
import { SampleTracking } from "../sample-tracking";
import { ErrorHandler, ModalManager } from "../../shared/shared.module";
import { Logger } from "../../shared/logger/logger";
import { SampleTrackingService } from "../sample-tracking.service";
import { SampleTrackingListFilter } from "./sample-tracking-list-filter";
import { Notification } from "../../shared/notification/notification";
import { User } from "../../user/user";
import { UserService } from "../../user/user.service";
import { DepartmentService } from "../../department/department.service";
import { Department } from "../../department/department";
import { KilosSacksConverterService } from 'app/shared/kilos-sacks-converter/kilos-sacks-converter.service';
import { SampleTrackingStatus } from '../sample-tracking-status';

@Component({
  selector: 'app-sample-tracking-list',
  templateUrl: 'sample-tracking-list.component.html',
  providers: []
})

export class SampleTrackingListComponent implements OnInit, OnDestroy {
  loading: boolean;
  error: boolean;
  deleteConfirm: ModalManager = new ModalManager();
  users: Array<User> = [];
  departments: Array<Department> = [];
  page: Page<SampleTracking> = new Page<SampleTracking>();

  codeLabelSearch: Search = new Search();
  batchCodeSearch: Search = new Search();
  departmentSearch: Search = new Search();
  userSearch: Search = new Search();

  sampleTrackingListFilter: SampleTrackingListFilter = new SampleTrackingListFilter();

  statusConfirmed = SampleTrackingStatus.CONFIRMED.code;

  constructor(private sampleTrackingService: SampleTrackingService,
    private userService: UserService,
    private departmentService: DepartmentService,
    private errorHandler: ErrorHandler,
    private kilosSacksConverterService: KilosSacksConverterService) {

  }

  ngOnInit(): void {

    this.userService
      .list()
      .then(users => {
        this.users = users;
      })
      .catch(error => this.errorHandler.fromServer(error));

    this.departmentService
      .list()
      .then(departments => {
        this.departments = departments;
      })
      .catch(error => this.errorHandler.fromServer(error));

    this.loadList();
    this.page.changeQuery.subscribe(() => {
      this.loadList();
    });
    this.codeLabelSearch
      .subscribe(() => {
        this.loadList();
      });
    this.batchCodeSearch
      .subscribe(() => {
        this.loadList();
      });
    this.departmentSearch
      .subscribe(() => this.loadList());
    this.userSearch
      .subscribe(() => this.loadList());
  }

  loadList() {
    this.error = false;
    this.loading = true;

    this.sampleTrackingListFilter = new SampleTrackingListFilter();
    this.sampleTrackingListFilter.codeOrLabel = this.codeLabelSearch.value;
    this.sampleTrackingListFilter.batchCodeTerm = this.batchCodeSearch.value;
    this.sampleTrackingListFilter.departmentId = this.departmentSearch.value;
    this.sampleTrackingListFilter.createUserId = this.userSearch.value;

    this.sampleTrackingService.listPaged(this.sampleTrackingListFilter, this.page).then(() => {
      this.loading = false;
    }).catch(error => this.handleError(error));
  }

  ngOnDestroy() {
    this.page.changeQuery.unsubscribe();
    this.codeLabelSearch.destroy();
    this.batchCodeSearch.destroy();
    this.departmentSearch.destroy();
    this.userSearch.destroy();
  }

  handleError(error) {
    this.error = true;
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }

  delete(id: string | number) {
    this.sampleTrackingService.delete(id).then(() => {
      Notification.success('Excluído com sucesso!');
      this.loadList();
    }).catch(() => this.loading = false);
  }

  calculateTotalSacks(sampleTracking: SampleTracking): Number {

    let totalSacks = sampleTracking.markupGroup.samples.reduce((totalPerMarkupGroupSample, markupGroupSample) => {

      return totalPerMarkupGroupSample += markupGroupSample.sample.batches.reduce((total, batch) => {

        return total += this.kilosSacksConverterService.kilosToSacks(batch.balance, batch);;

      }, 0);

    }, 0);

    return totalSacks;

  }

  calculateTotalQuantity(sampleTracking: SampleTracking): Number {

    let totalQuantity = sampleTracking.markupGroup.samples.reduce((totalPerMarkupGroupSample, markupGroupSample) => {

      return totalPerMarkupGroupSample += markupGroupSample.sample.batches.reduce((total, batch) => {

        return total += batch.balance;

      }, 0);

    }, 0);

    return totalQuantity;
  }
}
