import { AuthService } from '../../auth/auth.service';
import { ParameterService } from '../../parameter/parameter.service';
import { Search } from '../../shared/search/search';
import { Masks } from '../../shared/forms/masks/masks';
import { Component, OnInit, OnDestroy }      from '@angular/core';
import { ShippingAuthorizationService } from './../shipping-authorization.service';
import { ShippingAuthorization } from './../shipping-authorization';
import { Notification } from './../../shared/notification/notification';
import { ErrorHandler, ModalManager } from '../../shared/shared.module';
import { Logger } from '../../shared/logger/logger';
import { Page } from '../../shared/page/page';
import { FormGroup } from '@angular/forms/src/model';
import { FormBuilder } from '@angular/forms/src/form_builder';
import { ShippingAuthorizationFilter } from './shipping-authorization-filter';


@Component({
  selector: 'app-shipping-authorization-list',
  templateUrl: './shipping-authorization-list.component.html'
})
export class ShippingAuthorizationListComponent implements OnInit, OnDestroy {
  loading: boolean;
  error: boolean;
  deleteConfirm: ModalManager = new ModalManager();
  closeConfirm: ModalManager = new ModalManager();
  batchOperationModal = new ModalManager();

  page: Page<ShippingAuthorization> = new Page<ShippingAuthorization>();
  form: FormGroup;
  filter = new ShippingAuthorizationFilter();
  search = new Search;
  dateMask: any = Masks.dateMask;
  previousDate: string = null;

  get shippingAuthorizations(): ShippingAuthorization[]{
    return this.page.data;
  }

  constructor(
    private shippingAuthorizationService: ShippingAuthorizationService,
    private parameterService: ParameterService,
    private errorHandler: ErrorHandler,
    private logger: Logger,
    private formBuilder: FormBuilder,
    private auth: AuthService,
  ) {}

  ngOnInit() {
    Notification.clearErrors();
    this.buildForm();
    this.loadList();

    this.page.changeQuery.subscribe(() => {
      this.loadList();
    });

    this.search
        .subscribe(() => {
          this.loadList();
        });
  }

  buildForm() {
    this.form = this.formBuilder.group({
      'search': [''],
      'searchStartDate': [''],
      'searchEndDate': [''],
    });
  }

  filterList() {
    this.filter = new ShippingAuthorizationFilter(
      this.form.get('search').value,
      this.form.get('searchStartDate').value,
      this.form.get('searchEndDate').value
    );

    this.loadList();
  };

  loadList() {
    this.error = false;
    this.loading = true;
    this.shippingAuthorizationService.listPaged(this.filter, this.page).then(() => {
      this.loading = false;
    }).catch(error => this.handleError(error));
  }

  delete(id: string | number) {
    this.shippingAuthorizationService.delete(id).then(() => {
      Notification.success('Autorização de embarque excluída com sucesso!');
      this.loadList();
    }).catch(error => this.handleError(error));
  }

  get allowClose() {
    return this.auth.accessToken.admin || this.auth.accessToken.leader;
  }

  close(id: string | number) {
    this.shippingAuthorizationService.close(id).then(() => {
      Notification.success('Autorização de embarque finalizada com sucesso!');
      this.loadList();
    }).catch(error => this.handleError(error));
  }

  ngOnDestroy() {
    this.page.changeQuery.unsubscribe();
    this.search.destroy();
  }

  handleError(error) {
    this.error = true;
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }
}
