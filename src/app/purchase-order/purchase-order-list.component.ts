import { Component, OnInit } from '@angular/core';
import { Search } from 'app/shared/search/search';
import { ErrorHandler } from 'app/shared/errors/error-handler';
import { Notification } from 'app/shared/notification/notification';
import { Page } from 'app/shared/page/page';
import { PurchaseOrder } from './purchase-order';
import { PurchaseOrderService } from './purchase-order.service';
import { PurchaseOrderFilter } from './purchase-order-filter';
import { Masks } from 'app/shared/forms/masks/masks';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Warehouse } from 'app/warehouse/warehouse';
import { AuthService } from 'app/auth/auth.service';
import { PackTypeService } from 'app/pack-type/pack-type.service';
import { PackType } from 'app/pack-type/pack-type';
import { PurchaseOrderStatus } from './purchase-order-status';
import { WarehouseStakeholderAutocomplete } from 'app/warehouse-stakeholder/warehouse-stakeholder-autocomplete';
import { Subscription } from 'rxjs';
import { WarehouseStakeholderService } from 'app/warehouse-stakeholder/warehouse-stakeholder.service';
import { ModalManager } from 'app/shared/shared.module';
import { BalanceService } from 'app/balance/balance.service';

@Component({
  selector: 'purchase-order-list',
  templateUrl: './purchase-order-list.component.html'
})
export class PurchaseOrderListComponent implements OnInit {
  loading: boolean;
  page: Page<PurchaseOrder> = new Page<PurchaseOrder>();

  search: Search = new Search();
  filter: PurchaseOrderFilter;
  form: FormGroup;

  integerMask = Masks.integerMask;
  dateMask = Masks.dateMask;
  decimalMask = Masks.decimalMask;

  warehouses: Array<Warehouse>;
  packTypes: Array<PackType>;
  status: Array<PurchaseOrderStatus>;

  ownerAutocomplete: WarehouseStakeholderAutocomplete;
  ownerSubscription: Subscription;

  confirmDeleteModal: ModalManager = new ModalManager();
  purchaseOrderToRemove: PurchaseOrder;

  // para verificar se a tela da balança  é unificada com a da portaria
  unifiedBalanceLobby: boolean;

  // total de sacas para descarregar
  totalSacksForDischarging: number = 0;

  constructor(private purchaseOrderService: PurchaseOrderService,
    private packTypeService: PackTypeService,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private warehouseStakeholderService: WarehouseStakeholderService,
    private balanceService: BalanceService,
    private errorHandler: ErrorHandler) { }

  /**
   * Inicialização da página
   */
  ngOnInit() {

    this.ownerAutocomplete = new WarehouseStakeholderAutocomplete(this.warehouseStakeholderService, this.errorHandler);

    this.loadList();

    this.status = PurchaseOrderStatus.list();

    this.auth.listWarehouses().then(warehouses => {
      this.warehouses = warehouses;
    });

    this.packTypeService.list().then(packTypes => {
      this.packTypes = packTypes;
    });

    this.balanceService.unifiedWithLobby().then(value => {
      this.unifiedBalanceLobby = value;
    });

    this.page.changeQuery.subscribe(() => {
      this.loadList();
    });
    this.search
      .subscribe(() => {
        this.loadList();
      });

    this.buildForm();
  }

  /**
   * Destruição dos recursos 
   */
  ngOnDestroy() {
    let subscriptions = [this.ownerSubscription];
    subscriptions.forEach((subscription: Subscription) => {
      if (subscription && !subscription.closed) {
        subscription.unsubscribe();
      }
    });
  }

  /**
   * Construção do formulário
   */
  buildForm() {
    this.form = this.formBuilder.group({
      'downloadForecastDateStartString': [''],
      'downloadForecastDateEndString': [''],
      'clientId': [''],
      'loadingWarehouseId': [''],
      'packTypeId': [''],
      'purchaseOrderCode': [''],
      'status': ['']
    });

    this.ownerAutocomplete.value = null;
    this.ownerSubscription = this.ownerAutocomplete.valueChange.subscribe((value) => {
      const id = value ? value.id : null;
      this.form.get('clientId').setValue(id);
    });
  }

  /**
   * Filtro de busca
   */
  doFilter() {
    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
    });

    if (!this.form.valid) {
      return;
    }

    this.filter = PurchaseOrderFilter.fromData(this.form.value);
    this.loadList();
  }

  /**
   * Para mostrar/esconder os detalhes do registro selecionado
   * 
   * @param purchaseOrder
   */
  showDetails(purchaseOrder: PurchaseOrder) {

    if (purchaseOrder.showDetailsInformation) {
      purchaseOrder.showDetailsInformation = false;
    }
    else {
      purchaseOrder.showDetailsInformation = true;
    }
  }

  /**
   * Listagem de dados
   */
  loadList() {
    this.loading = true;
    return this.purchaseOrderService.listPaged(this.filter, this.page).then((page) => {
      this.page = page;
      this.loading = false;

      // busca por total de sacas
      this.getTotals();

    }).catch(error => this.handleError(error));
  }

  /**
   * Recupera totais
   */
  getTotals() {
    this.loading = true;
    return this.purchaseOrderService.totals(this.filter).then((purchaseOrderTotal) => {
      this.totalSacksForDischarging = purchaseOrderTotal.totalForDischarging;
      this.loading = false;
    }).catch(error => this.handleError(error));
  }

  /**
   * Para confirmar remoção
   * @param purchaseOrder 
   */
  confirmDeletion(purchaseOrder: PurchaseOrder) {
    this.purchaseOrderToRemove = purchaseOrder;
    this.confirmDeleteModal.open(true);
  }

  /**
   * Remoção do registro
   */
  delete() {
    if (this.purchaseOrderToRemove) {
      this.loading = true;
      this.purchaseOrderService.delete(this.purchaseOrderToRemove.id).then(() => {
        this.loading = false;
        Notification.success('Ordem de compra removida com sucesso!');
        this.loadList();
      }).catch(error => this.handleError(error));
    }
  }

  /**
   * Manipulação de erros
   * @param error 
   */
  handleError(error) {
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }
}