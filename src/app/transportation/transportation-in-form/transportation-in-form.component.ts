import {VehiclePlateService} from '../../vehicle-plate/vehicle-plate.service';
import {DriverService} from '../../driver/driver.service';
import {Observable, Subscription} from 'rxjs/Rx';
import {TransportationStatus} from '../transportation-status';
import {Carrier} from '../../carrier/carrier';
import {CarrierService} from '../../carrier/carrier.service';
import {FiscalNote} from '../../fiscal-note/fiscal-note';
import {PackType} from '../../pack-type/pack-type';
import {Transportation} from '../transportation';
import {TransportationFiscalNoteCertificate} from '../transportation-fiscal-note/certificate/transportation-fiscal-note-certificate';
import {TransportationType} from '../transportation-type';
import {TransportationService} from '../transportation.service';
import {ErrorHandler} from './../../shared/errors/error-handler';
import {Masks} from './../../shared/forms/masks/masks';
import {Notification} from './../../shared/notification/notification';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {TransportationFiscalNoteService} from '../transportation-fiscal-note/transportation-fiscal-note.service';
import {CustomValidators} from '../../shared/forms/validators/custom-validators';
import {CollaboratorService} from '../../collaborator/collaborator.service';
import {WarehouseStakeholderService} from '../../warehouse-stakeholder/warehouse-stakeholder.service';
import {CollaboratorPropertyService} from '../../collaborator-property/collaborator-property.service';
import {Farm} from '../../farm/farm';
import {CollaboratorAutocomplete} from '../../collaborator/collaborator-autocomplete';
import {WarehouseStakeholderAutocomplete} from '../../warehouse-stakeholder/warehouse-stakeholder-autocomplete';
import {Drink} from '../../drink/drink';
import {DrinkService} from '../../drink/drink.service';
import {Strainer} from '../../strainer/strainer';
import {StrainerService} from '../../strainer/strainer.service';
import {AuthService} from '../../auth/auth.service';
import {ParameterService} from '../../parameter/parameter.service';
import {DateTimeHelper, NumberHelper} from '../../shared/globalization';
import {KilosSacksConverterService} from 'app/shared/kilos-sacks-converter/kilos-sacks-converter.service';
import {FiscalNoteType} from '../../fiscal-note/fiscal-note-type';
import {Page} from '../../shared/page/page';
import {PurchaseForecast} from '../../purchase-forecast/purchase-forecast';
import {PurchaseForecastService} from '../../purchase-forecast/purchase-forecast.service';
import {PurchaseForecastFilter} from '../../purchase-forecast/purchase-forecast-list/purchase-forecast-filter';
import {PurchaseForecastCertificate} from 'app/purchase-forecast/purchase-forecast-certificate';
import {ModalManager} from '../../shared/modals/modal-manager';
import {PackTypeService} from 'app/pack-type/pack-type.service';
import {PurchaseOrder} from 'app/purchase-order/purchase-order';
import {PurchaseOrderService} from 'app/purchase-order/purchase-order.service';
import {ProductTransportationType} from "../product-transportation-type";
import {PackStockMovementGroup} from "../../pack-stock/pack-stock-movement-group";
import {PackStockMovementGroupRecordType} from "../../pack-stock/pack-stock-movement-group-record-type";
import {PackStockService} from "../../pack-stock/pack-stock.service";
import {WarehouseStakeholder} from "../../warehouse-stakeholder/warehouse-stakeholder";
import {DriverAutocomplete} from "../../driver/driver-autocomplete";

const uuid = require('uuid/v4');

@Component({
  selector: 'app-transportation-in-form',
  templateUrl: './transportation-in-form.component.html'
})
export class TransportationInFormComponent implements OnInit, OnDestroy {
  submitted = false;
  formTransportation: FormGroup;
  formFiscalNote: FormGroup;
  loading: boolean = false;
  packTypes: Array<PackType>;
  carriers: Array<Carrier>;
  notes: Array<FiscalNote> = [];
  transportation: Transportation;
  fiscalNote: FiscalNote;
  unified = false;
  breadcrumb = null;
  dateMask = Masks.dateMask;
  decimalMask: any = Masks.decimalMask;
  decimalMaskTransportationSackUnityValue: any = Masks.decimalMaskTransportationSackUnityValue;
  integerMask = Masks.integerMask;
  driverDatasource: Observable<Array<String>>;
  vehiclePlate1Datasource: Observable<Array<String>>;
  vehiclePlate2Datasource: Observable<Array<String>>;
  vehiclePlate3Datasource: Observable<Array<String>>;
  plate1Mask = Masks.vehiclePlateMask;
  plate2Mask = Masks.vehiclePlateMask;
  plate3Mask = Masks.vehiclePlateMask;
  replaceStakeholderForCollaborator = false;
  collaboratorAutocomplete: CollaboratorAutocomplete;
  collaboratorSubscription: Subscription;
  ownerSubscription: Subscription;
  senderSubscription: Subscription;
  barCodeSubscription: Subscription;
  formTransportationSubscription: Subscription;
  productTypeSubscription: Subscription;
  formFiscalNoteSubscription: Subscription;
  ownerAutocomplete: WarehouseStakeholderAutocomplete;
  senderAutocomplete: WarehouseStakeholderAutocomplete;
  farms: Array<Farm> = [];
  drinks: Array<Drink> = [];
  strainers: Array<Strainer> = [];
  invoiceFieldBlock = false;
  hidePurchaseField: boolean;
  page: Page<PurchaseForecast> = new Page<PurchaseForecast>();
  purchaseFilter: PurchaseForecastFilter;
  noteFiscalIndex: string;
  // certificados para serem adicionados a nota, vindo da previsão
  certificatesToAdd: Array<PurchaseForecastCertificate>;
  fiscalNoteCodeFromParamUrl: string = null;
  // permissão de entrada e saída automática
  automaticAllowEntryAndOut: boolean = false;
  // para confirmar salvar sem nota fiscal
  saveConfirmWithoutFiscalNote: ModalManager = new ModalManager();
  // para confirmar se tem certificado na nota fiscal
  confirmHaveCertificateFiscalNote: ModalManager = new ModalManager();
  // para confimar adição de nota fiscal sem ordem de compra
  confirmFiscalNoteWithoutPurchaseOrder: ModalManager = new ModalManager();
  confirmedFiscalNoteWithoutPurchaseOrder: boolean = false;
  // para exibir ou não as previsões de compra
  showPurchaseForecast: boolean = true;
  // para exibir ou não a ordem de compra
  showPurchaseOrder: boolean = false;
  purchaseOrders: Array<PurchaseOrder> = [];
  // para saber quando está editando um nota fiscal da lista,
  // para não carregar os filtros de busca de previsões de compra
  isEditingFiscalNote: boolean = false;
  // tempo de espera para requisições em segundos
  debounceTimeValue: number = 2000;
  // para verificar se está fazendo requisição para recuperar ordem de compras
  isRequestingPurchaseOrders = false;
  isRequestingCollaboratorValidation = false;
  // para confirmação de sacas extrapoladas
  confirmExtrapolatedQuantitySacks: ModalManager = new ModalManager();

  confirmedExtrapolatedQuantitySacks: boolean = false;
  extrapolatedQuantitySacks: number = 0;
  packing = false;
  fiscalNoteNumberOfDigits = '9';
  senderStakeholderFormModal = new ModalManager();
  ownerStakeholderFormModal = new ModalManager();
  newPurchaseOrderFormModal = new ModalManager();

  driverAutocomplete: DriverAutocomplete;
  driverSubscription: Subscription;
  alertDriverExpired: ModalManager = new ModalManager();
  driverAlertMessage: string;

  get editing() {
    return !!this.transportation && !!this.transportation.id;
  }

  constructor(private route: ActivatedRoute,
              private router: Router,
              private formBuilder: FormBuilder,
              private transportationService: TransportationService,
              private transportationFiscalNoteService: TransportationFiscalNoteService,
              private errorHandler: ErrorHandler,
              private carrierService: CarrierService,
              private driverService: DriverService,
              private vehiclePlateService: VehiclePlateService,
              private collaboratorService: CollaboratorService,
              private warehouseStakeholderService: WarehouseStakeholderService,
              private collaboratorPropertyService: CollaboratorPropertyService,
              private drinkService: DrinkService,
              private strainerService: StrainerService,
              private authService: AuthService,
              private parameterService: ParameterService,
              private kilosSacksConverterService: KilosSacksConverterService,
              private purchaseService: PurchaseForecastService,
              private purchaseOrderService: PurchaseOrderService,
              private packTypeService: PackTypeService,
              private packStockService: PackStockService) {
  }

  ngOnInit() {
    Notification.clearErrors();
    this.loading = true;
    this.checkInOutAutomaticPermission();

    this.showPurchaseForecast = this.parameterService.useEntryForecastTransportation();
    this.showPurchaseOrder = this.parameterService.usePurchaseOrderTransportation();

    this.carrierService.list().then(carriers => {
      this.carriers = carriers;
      this.loading = false;
    });

    this.packTypeService.list().then(packTypes => {
      this.packTypes = packTypes;
    });

    this.route.data.forEach(
      (data: { transportation: Transportation; unified: boolean }) => {
        this.unified = data.unified;
        this.buildBreadcrumb();

        this.transportation = data.transportation;
        this.fiscalNote = new FiscalNote();
        this.packing = this.transportation.productType == ProductTransportationType.PACKING.code;
        if (this.packing) {
          this.transportation.fiscalNotes.forEach(fiscalNote => {
            this.packStockService.findByFiscalNote(fiscalNote.id).then(packStock => {
              fiscalNote.packStockMovementGroup = packStock;
            });
          });
        }

        this.collaboratorAutocomplete = new CollaboratorAutocomplete(
          this.collaboratorService,
          this.errorHandler
        );
        this.ownerAutocomplete = new WarehouseStakeholderAutocomplete(
          this.warehouseStakeholderService,
          this.errorHandler
        );
        this.senderAutocomplete = new WarehouseStakeholderAutocomplete(
          this.warehouseStakeholderService,
          this.errorHandler
        );

        this.drinkService.list().then(drinks => {
          this.drinks = drinks;
        });

        this.strainerService.list().then(strainers => {
          this.strainers = strainers;
        });

        this.driverAutocomplete = new DriverAutocomplete(this.driverService, this.errorHandler);

        this.parameterService
          .replaceStakeholderForCollaborator()
          .then(replaceStakeholderForCollaborator => {
            this.replaceStakeholderForCollaborator = replaceStakeholderForCollaborator;
            this.buildFormFiscalNote();
          });

        this.transportationFiscalNoteService
          .invoiceFieldBlock()
          .then(invoiceFieldBlock => {
            this.invoiceFieldBlock = invoiceFieldBlock;
            this.buildFormFiscalNote();
          });

        this.transportationFiscalNoteService
          .hiddenPurchaseFiled()
          .then(hidePurchaseField => {
            this.hidePurchaseField = hidePurchaseField;
            this.buildFormFiscalNote();
          });

        this.buildFormFiscalNote();
        this.buildFormTransportation();


        // this.driverDatasource = Observable.create((observer: any) => {
        //   observer.next(this.formTransportation.get('driverName').value);
        // }).mergeMap(token =>
        //   Observable.fromPromise(this.driverService.search(token))
        // );

        this.vehiclePlate1Datasource = Observable.create((observer: any) => {
          observer.next(this.formTransportation.get('vehiclePlate1').value);
        }).mergeMap(token =>
          Observable.fromPromise(this.vehiclePlateService.search(token, 1))
        );

        this.vehiclePlate2Datasource = Observable.create((observer: any) => {
          observer.next(this.formTransportation.get('vehiclePlate2').value);
        }).mergeMap(token =>
          Observable.fromPromise(this.vehiclePlateService.search(token, 2))
        );

        this.vehiclePlate3Datasource = Observable.create((observer: any) => {
          observer.next(this.formTransportation.get('vehiclePlate3').value);
        }).mergeMap(token =>
          Observable.fromPromise(this.vehiclePlateService.search(token, 3))
        );

        let hasPurchaseForecast = !!this.transportation
          .purchaseForecastFiscalNote;
        if (hasPurchaseForecast) {
          this.openFiscalNoteForm(
            this.transportation.purchaseForecastFiscalNote
          );
        }
        let fiscalNoteLenght = this.parameterService.fiscalNoteNumberOfDigits() || '9';
        if (fiscalNoteLenght && parseInt(fiscalNoteLenght) > 0) {
          this.fiscalNoteNumberOfDigits = fiscalNoteLenght;
        }
      }
    );

    // se tem código da nota fiscal nos parâmetros, recupera-o
    this.route.queryParams.subscribe(params => {
      if (params['fiscalNoteCode'] != null) {
        this.fiscalNoteCodeFromParamUrl = params['fiscalNoteCode'];
      }
    });
  }

  ngOnDestroy() {
    this.clearSubscriptions();
  }

  clearSubscriptions() {
    const subscriptions = [
      this.collaboratorSubscription,
      this.ownerSubscription,
      this.senderSubscription,
      this.barCodeSubscription,
      this.formTransportationSubscription,
      this.formFiscalNoteSubscription,
      this.productTypeSubscription
    ];

    subscriptions.forEach(subscription => {
      if (subscription && !subscription.closed) {
        subscription.unsubscribe();
      }
    });
  }

  buildBreadcrumb() {
    let output = [];

    output.push(['Início', '']);

    if (this.unified) {
      output.push(['Balança', '/balance']);
    } else {
      output.push(['Portaria', '/lobby']);
    }

    output.push(['Movimento de Entrada', null]);

    this.breadcrumb = output;
  }

  get backLink() {
    if (this.unified) {
      return ['/balance'];
    }

    return ['/lobby'];
  }

  barCodeValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      const value = control.value;

      if (value && value.length !== 44) {
        return {invalid: true};
      }

      return null;
    };
  }

  /**
   * Verifica a permissão de entrada e saída automática
   */
  checkInOutAutomaticPermission() {
    this.automaticAllowEntryAndOut = this.authService.findParameterBoolean('AUTOMATIC_ALLOW_ENTRY_AND_OUT');
  }

  /**
   * Para verificar se á obrigatório o nota fiscal.
   * Quando o parâmetro de permissão de entrada e saída automática for negativo,
   * a nota não é obrigatória.
   */
  isFiscalNoteMandatory(): boolean {
    return (this.automaticAllowEntryAndOut == true);
  }

  isFiscalNoteCodeExistent() {

    if (!this.authService.findParameterBoolean('UNIQUE_FISCAL_NOTE_CODE_BY_COLLABORATOR')) {
      return Promise.resolve(false);
    }

    const value = this.fillWithZerosLeft(
      this.formFiscalNote.get('code').value, parseInt(this.fiscalNoteNumberOfDigits) || 9
    );

    const collaboratorId = this.formFiscalNote.get('collaboratorId').value;

    if (!value) {
      return Promise.resolve(false);
    }

    if (!collaboratorId) {
      return Promise.resolve(false);
    }

    const existsInMemory = this.transportation.fiscalNotes.some((fiscalNoteInList) => {
      if (this.fiscalNote === fiscalNoteInList) {
        return false;
      }

      if (!fiscalNoteInList.collaborator) {
        return false;
      }

      if (fiscalNoteInList.collaborator.id !== collaboratorId) {
        return false;
      }

      return fiscalNoteInList.code === value;
    });

    if (existsInMemory) {
      return Promise.resolve(true);
    }

    return this.transportationFiscalNoteService
      .exists(value, this.fiscalNote.id, collaboratorId);
  }

  leaddingZeroes(event: any) {
    event.target.value = this.fillWithZerosLeft(event.target.value, parseInt(this.fiscalNoteNumberOfDigits) || 9);
  }

  fillWith9ZerosLeft(value: string) {
    return this.fillWithZerosLeft(value, 9);
  }

  fillWithZerosLeft(value: string, qtdOfZeros = 9) {
    let leadingString = '';
    for (let i = qtdOfZeros; i > 0; i--) leadingString += '0';
    leadingString += value;
    return leadingString.slice(leadingString.length - qtdOfZeros);
  }

  get totalPriceString() {
    if (!this.packing) {
      let quantity = this.formFiscalNote.value.quantity;
      let unitPrice = NumberHelper.fromPTBR(
        this.formFiscalNote.value.unitPriceString
      );

      return NumberHelper.toPTBR(quantity * unitPrice);
    } else {
      return this.fiscalNote.totalPriceString;
    }
  }

  collaboratorHasStackholderValidator() {

    return (control: AbstractControl) => {

      // para garantir que não acontece multiplas requisições
      if (this.isRequestingCollaboratorValidation == true) {
        return Promise.resolve(null);
      }

      if (!control.value) {
        this.getPurchaseOrdersByStakeholder(null);
        return Promise.resolve(null);
      }

      this.isRequestingCollaboratorValidation = true;

      return this.collaboratorService.find(control.value).then(collaborator => {

        if (!collaborator || !collaborator.person || !collaborator.person.id) {
          this.getPurchaseOrdersByStakeholder(null);
          return Promise.resolve(null);
        }

        return this.warehouseStakeholderService.findByPerson(collaborator.person.id).then(stakeholder => {

          let exists = stakeholder && stakeholder.id;
          this.getPurchaseOrdersByStakeholder(stakeholder.id);
          this.isRequestingCollaboratorValidation = false;

          return exists
            ? null
            : {collaboratorHasStackholderValidator: true};
        })
          .catch(error => {
            this.getPurchaseOrdersByStakeholder(null);
            console.error(error);
            this.isRequestingCollaboratorValidation = false;
          });

      }).catch(error => {
        console.error(error);
        this.isRequestingCollaboratorValidation = false;
      });
    };
  }

  loadDataFromBarCode() {
    if (!this.formFiscalNote.get('barCode').valid) {
      return;
    }

    let barCode: string = this.formFiscalNote.get('barCode').value;

    let code = barCode.substring(25, 25 + 9);
    let cnpj = barCode.substring(6, 6 + 14);

    this.formFiscalNote.get('code').setValue(code);

    this.warehouseStakeholderService.findByDocument(cnpj).then(stakeholder => {
      if (stakeholder) {
        this.formFiscalNote.get('senderStakeholderId').setValue(stakeholder.id);
      } else {
        this.formFiscalNote.get('senderStakeholderId').setValue('');
      }
    });
  }

  loadListPurchaseForecast(value) {
    // para buscar os dados de previões de compra, deve ter habilitação para mostrar
    // e nõa ser edição de dados (pois a tela está lenta devido a quantidade de requisições)
    if (this.showPurchaseForecast && !this.isEditingFiscalNote) {
      this.purchaseFilter = new PurchaseForecastFilter(
        null,
        value.trasnportationValues.carrierId,
        value.trasnportationValues.driverName,
        value.trasnportationValues.vehiclePlate1,
        value.trasnportationValues.vehiclePlate2,
        value.trasnportationValues.vehiclePlate3,
        (value.trasnportationValues.originWeightString != '0,00' ? value.trasnportationValues.originWeightString : null),
        value.fiscalNoteValues.barCode,
        value.fiscalNoteValues.code,
        value.fiscalNoteValues.emissionDateString,
        value.fiscalNoteValues.quantity,
        (value.fiscalNoteValues.unitPriceString != '0,00' ? value.fiscalNoteValues.unitPriceString : null),
        value.fiscalNoteValues.collaboratorId,
        value.fiscalNoteValues.farmId
      );
      this.purchaseService.listPaged(this.purchaseFilter, this.page);
    }
  }

  /**
   * Salva nota fiscal em memória.
   *
   * @param confirmationHasCertificate confirmação para saber se tem certificado
   */
  salvarNf(confirmationHasCertificate: boolean) {
    this.loading = true;

    Object.keys(this.formFiscalNote.controls).forEach(key => {
      this.formFiscalNote.controls[key].markAsDirty();
    });

    if (!this.formFiscalNote.valid) {
      this.loading = false;
      return;
    }

    // verifica se precisa de confirmação para ordem de compra não preenchida
    if (this.needConfirmFiscalNoteWithoutPurchaseOrder()) {
      this.loading = false;
      this.confirmFiscalNoteWithoutPurchaseOrder.open(null);
      return;
    }

    // verifica se precisa confirmar se a quantidade de sacas do nota fiscal,
    // extrapolou a quantidade prevista na ordem de compra
    if (this.needConfirmExtrapolatedQuantitySacks()) {
      this.loading = false;
      this.confirmExtrapolatedQuantitySacks.open(null);
      return;
    }

    // precisa de confirmação para saber se tem certificado,
    // para abrir seleção de certificado automaticamente.
    if (!this.packing) {
      if (confirmationHasCertificate == null) {
        this.loading = false;
        this.confirmHaveCertificateFiscalNote.open(null);
        return;
      } else {
        this.confirmHaveCertificateFiscalNote.close();
      }
    }

    return this.isFiscalNoteCodeExistent().then((existent) => {
      if (existent) {
        this.formFiscalNote.get('code').setErrors({alreadyInUse: true});
      }
    }).then(() => {
      //Somar a quantidade de embalagens vinda da lista
      let sumQuantity: number = 0;

      if (this.packing && this.fiscalNote.packStockMovementGroup) {
        this.fiscalNote.packStockMovementGroup.movements.forEach(movement => {
          sumQuantity = Number(sumQuantity) + Number(movement.quantityVariation);
        });
      }

      this.fiscalNote.purchaseCode = this.formFiscalNote.value.purchaseCode;
      this.fiscalNote.barCode = this.formFiscalNote.value.barCode;
      this.fiscalNote.code = this.formFiscalNote.value.code;
      this.fiscalNote.quantity = (this.packing) ? sumQuantity : this.formFiscalNote.value.quantity;
      this.fiscalNote.unitPriceString = this.formFiscalNote.value.unitPriceString;
      this.fiscalNote.emissionDateString = this.formFiscalNote.value.emissionDateString;
      this.fiscalNote.senderStakeholder = this.senderAutocomplete.value;
      this.fiscalNote.ownerStakeholder = this.ownerAutocomplete.value;
      this.fiscalNote.drink = this.drinks.find(
        d => d.id === this.formFiscalNote.value.drinkId
      );
      this.fiscalNote.strainer = this.strainers.find(
        s => s.id === this.formFiscalNote.value.strainerId
      );
      this.fiscalNote.baseValueForTaxString = this.formFiscalNote.value.baseValueForTaxString;
      this.fiscalNote.taxIcmsPercentString = this.formFiscalNote.value.taxIcmsPercentString;
      this.fiscalNote.grossWeightString = this.formFiscalNote.value.grossWeightString;
      this.fiscalNote.netWeight = this.quantityNetWeight;
      this.fiscalNote.noteType = FiscalNoteType.TRANSPORTATION_IN.code;
      this.fiscalNote.collaborator = this.collaboratorAutocomplete.value;
      this.fiscalNote.farm = this.farms.find(f => f.id === this.formFiscalNote.value.farmId);
      this.fiscalNote.packType = this.packTypes.find(p => p.id === this.formFiscalNote.value.packTypeId);
      this.fiscalNote.purchaseOrder = this.purchaseOrders.find(p => p.id === this.formFiscalNote.value.purchaseOrderId);

      //Cria o agrupador de embalagens
      if (this.packing) {
        if (this.fiscalNote.packStockMovementGroup == undefined) {
          this.fiscalNote.packStockMovementGroup = new PackStockMovementGroup();
        }
        this.fiscalNote.packStockMovementGroup.indStockOut = false;
        this.fiscalNote.packStockMovementGroup.registrationDateString = DateTimeHelper.toDDMMYYYY(new Date().getTime());
        this.fiscalNote.packStockMovementGroup.owner = this.ownerAutocomplete.value;
        this.fiscalNote.packStockMovementGroup.observation = 'Entrada de embalagem';
        this.fiscalNote.packStockMovementGroup.document = this.formFiscalNote.value.code;
        this.fiscalNote.packStockMovementGroup.recordType = PackStockMovementGroupRecordType.AUTOMATIC.code;
      }

      // adiciona certificados se existirem na previsão de entrada
      if (this.certificatesToAdd != null && this.certificatesToAdd.length > 0) {

        if (this.fiscalNote.certificates == null) {
          this.fiscalNote.certificates = [];
        }

        for (const i in this.certificatesToAdd) {
          let tfnc = new TransportationFiscalNoteCertificate(null, null, null, this.certificatesToAdd[i].certificate);
          this.fiscalNote.certificates.push(tfnc);
        }
      }

      if (this.replaceStakeholderForCollaborator) {
        return this.warehouseStakeholderService
          .findByPerson(this.fiscalNote.collaborator.person.id)
          .then(stakeholder => {
            this.fiscalNote.senderStakeholder = stakeholder;
            this.fiscalNote.ownerStakeholder = stakeholder;
            this.addFiscalNote(confirmationHasCertificate);
          }).catch(() => {
          });
      } else {
        this.addFiscalNote(confirmationHasCertificate);
      }

    }).catch(error => {
      this.loading = false;
      this.errorHandler.fromServer(error);
    });
  }

  /**
   * Adiciona efetivamente a nota fiscal na listagem (na memória)
   *
   * @param confirmationHasCertificate
   */
  private addFiscalNote(confirmationHasCertificate: boolean) {

    this.loading = false;

    const isEdit = this.transportation.fiscalNotes.some((fiscalNoteInList) => {
      if (this.fiscalNote === fiscalNoteInList) {
        return true;
      }
    });

    if (!isEdit) {
      this.transportation.fiscalNotes.push(this.fiscalNote);
    }

    // se tem confirmação de certificado deve abair tela de adição,
    // para isso guarda nota fiscal no serviço, para ser consultado posteriormente
    if (confirmationHasCertificate) {
      TransportationFiscalNoteService.fiscalNoteToAddCertificate = this.fiscalNote;
    } else {
      TransportationFiscalNoteService.fiscalNoteToAddCertificate = null;
    }

    this.resetFormFiscalNote();
  }

  openFiscalNoteForm(fiscalNote: FiscalNote) {
    this.fiscalNote = fiscalNote;

    if (!this.fiscalNote) {
      this.fiscalNote = new FiscalNote();
    }

    this.isEditingFiscalNote = true;
    this.buildFormFiscalNote();
  }

  addOrUpdateFiscalNote(fiscalNote: FiscalNote) {
    if (!fiscalNote.id && !fiscalNote.tempId) {
      fiscalNote.tempId = uuid();
      this.transportation.fiscalNotes.push(fiscalNote);
    }
  }

  buildFormTransportation() {
    this.formTransportation = this.formBuilder.group({
      productType: [this.transportation.productType ? this.transportation.productType || '' : ProductTransportationType.COFFEE.code, Validators.required],
      carrierId: [
        this.transportation.carrier ? this.transportation.carrier.id || '' : ''
      ],
      vehiclePlate1: [
        this.transportation.vehiclePlate1 || '',
        Validators.required
      ],
      vehiclePlate2: [this.transportation.vehiclePlate2 || ''],
      vehiclePlate3: [this.transportation.vehiclePlate3 || ''],
      // driverName: [this.transportation.driverName || '', Validators.required],
      driverId: [this.transportation.driver ? this.transportation.driver.id : '', Validators.required],
      originWeightString: [this.transportation.originWeightString || '']
    });

    this.driverAutocomplete.value = this.transportation.driver;
    this.driverSubscription = this.driverAutocomplete.valueChange.subscribe((value) => {
        const id = value ? value.id : null;
        if (value && value.cnhExpirationDate < Date.now()) {
          this.driverAlertMessage = `A carteira de motorista de ${value.name} venceu no dia ${DateTimeHelper.toDDMMYYYY(value.cnhExpirationDate)}.`;
          this.alertDriverExpired.open(null);
        }
        this.formTransportation.get('driverId').setValue(id);
        this.transportation.driver = this.driverAutocomplete.value;
      }
    );

    this
      .formTransportationSubscription = this.formTransportation.valueChanges.debounceTime(this.debounceTimeValue).subscribe(
      () => {
        this.refreshFilterAndLoadListPurchaseForecast();
      }
    );

    this
      .productTypeSubscription = this.formTransportation.get('productType').valueChanges.subscribe(() => {
      this.packing = this.formTransportation.get('productType').value == ProductTransportationType.PACKING.code;

      if (!this.packing) {
        this.formFiscalNote.get('quantity').enable;
      } else {
        this.formFiscalNote.get('quantity').disable()
      }

    });
  }

  refreshFilterAndLoadListPurchaseForecast() {
    let values = {
      trasnportationValues: this.formTransportation.value,
      fiscalNoteValues: this.formFiscalNote.value
    };

    this.loadListPurchaseForecast(values);
  }

  buildFormFiscalNote() {

    this.formFiscalNote = this.formBuilder.group({
      purchaseCode: [this.fiscalNote.purchaseCode || ''],
      barCode: [this.fiscalNote.barCode || '', this.barCodeValidator()],
      code: [
        this.fiscalNote.code || '',
        [Validators.required]
      ],
      emissionDateString: [
        this.fiscalNote.emissionDateString || '',
        Validators.required
      ],
      drinkId: [this.fiscalNote.drink ? this.fiscalNote.drink.id || '' : ''],
      strainerId: [this.fiscalNote.strainer ? this.fiscalNote.strainer.id || '' : ''],
      quantity: [
        this.fiscalNote.quantity || '',
        [Validators.required, CustomValidators.minValidator(1)]
      ],
      unitPriceString: [this.fiscalNote.unitPriceString || ''],
      baseValueForTaxString: [this.fiscalNote.baseValueForTaxString || ''],
      taxIcmsPercentString: [this.fiscalNote.taxIcmsPercentString || ''],
      grossWeightString: [this.fiscalNote.grossWeightString || ''],
      netWeightString: [this.fiscalNote.netWeightString || ''],
      collaboratorId: new FormControl(
        this.fiscalNote.collaborator
          ? this.fiscalNote.collaborator.id || ''
          : '',
        this.replaceStakeholderForCollaborator ? Validators.required : null,
        this.replaceStakeholderForCollaborator
          ? this.collaboratorHasStackholderValidator()
          : null
      ),
      farmId: new FormControl(
        this.fiscalNote.farm ? this.fiscalNote.farm.id || '' : '',
        this.replaceStakeholderForCollaborator ? Validators.required : null
      ),
      collaboratorRegistration: [
        this.fiscalNote.collaborator
          ? this.fiscalNote.collaborator.registration || ''
          : ''
      ],
      senderStakeholderId: [
        this.fiscalNote.senderStakeholder
          ? this.fiscalNote.senderStakeholder.id || ''
          : '',
        !this.replaceStakeholderForCollaborator ? Validators.required : null
      ],
      ownerStakeholderId: [
        this.fiscalNote.ownerStakeholder
          ? this.fiscalNote.ownerStakeholder.id || ''
          : '',
        !this.replaceStakeholderForCollaborator ? Validators.required : null
      ],
      packTypeId: [this.fiscalNote.packType ? this.fiscalNote.packType.id || '' : ''],
      purchaseOrderId: [this.fiscalNote.purchaseOrder ? this.fiscalNote.purchaseOrder.id || '' : ''],
    });

    this.collaboratorPropertyService
      .listFarmsBycollaborator(this.formFiscalNote.value.collaboratorId)
      .then(farms => {
        this.farms = farms;
      });

    this.collaboratorAutocomplete.value = this.fiscalNote.collaborator;

    this.collaboratorSubscription = this.collaboratorAutocomplete.valueChange.debounceTime(this.debounceTimeValue).subscribe(
      value => {
        const id = value ? value.id : null;
        this.formFiscalNote.get('collaboratorId').setValue(id);

        // busca fazendas do cliente (as ordens de compra são buscadas em função dentro do campo do cliente)
        this.collaboratorPropertyService.listFarmsBycollaborator(id).then(farms => {
          this.farms = farms;
        });
      }
    );

    this.ownerAutocomplete.value = this.fiscalNote.ownerStakeholder;

    this.ownerSubscription = this.ownerAutocomplete.valueChange.debounceTime(this.debounceTimeValue).subscribe(
      value => {
        const id = value ? value.id : null;
        this.formFiscalNote.get('ownerStakeholderId').setValue(id);

        // busca orderns de commpra, pois depedente do parâmetro o depositante é o cliente
        this.getPurchaseOrdersByStakeholder(id);
      }
    );

    this.senderAutocomplete.value = this.fiscalNote.senderStakeholder;

    this.senderSubscription = this.senderAutocomplete.valueChange.debounceTime(this.debounceTimeValue).subscribe(
      value => {
        const id = value ? value.id : null;
        this.formFiscalNote.get('senderStakeholderId').setValue(id);
      }
    );

    this.barCodeSubscription = this.formFiscalNote.get('barCode').valueChanges
      .debounceTime(350).subscribe(() => {
        this.loadDataFromBarCode();
      });

    this.formFiscalNoteSubscription = this.formFiscalNote.valueChanges.debounceTime(this.debounceTimeValue).subscribe(
      () => {
        console.log(88, this.formFiscalNote.value.code);
        this.refreshFilterAndLoadListPurchaseForecast();
        if (!this.packing) {
          this.formFiscalNote.get('quantity').enable;
        } else {
          this.formFiscalNote.get('quantity').disable()
        }
      }
    );

    // utiliza código da nota fiscal do parâmetro da url somente uma vez
    if (this.fiscalNoteCodeFromParamUrl != null) {
      this.formFiscalNote.get('code').setValue(this.fiscalNoteCodeFromParamUrl);
    }


  }

  fillFiscalNoteWithZeros(event: any) {
    if (this.fiscalNoteNumberOfDigits && Number(this.fiscalNoteNumberOfDigits) > 0) {
      event.target.value = this.fillWithZerosLeft(event.target.value, parseInt(this.fiscalNoteNumberOfDigits));
    }
  }

  private

  pad(num, size) {
    let s = num + '';
    while (s.length < size) s = '0' + s;
    return s.substr(0, size);
  }

  resetFormTransportation() {
    this.buildFormTransportation();
    this.certificatesToAdd = null;
  }

  resetFormFiscalNote() {
    this.fiscalNote = new FiscalNote();
    this.fiscalNoteCodeFromParamUrl = null;
    this.buildFormFiscalNote();
    this.certificatesToAdd = null;
    this.isEditingFiscalNote = false;
    this.confirmedFiscalNoteWithoutPurchaseOrder = false;
    this.extrapolatedQuantitySacks = 0;
    this.confirmedExtrapolatedQuantitySacks = false;
    this.fiscalNote.packStockMovementGroup = new PackStockMovementGroup();
  }

  clean() {
    this.clearSubscriptions();
    this.buildFormFiscalNote();
    this.buildFormTransportation();
    this.resetFormFiscalNote();
    this.transportation.fiscalNotes = [];
    this.certificatesToAdd = null;
  }

  linkForecast(purchaseForecast: PurchaseForecast) {

    if (purchaseForecast.collaborator && purchaseForecast.collaborator.id) {
      this.collaboratorAutocomplete.value = purchaseForecast.collaborator;

      const id = purchaseForecast.collaborator
        ? purchaseForecast.collaborator.id
        : null;

      this.formFiscalNote.get('collaboratorId').setValue(id);

      this.collaboratorPropertyService.listFarmsBycollaborator(id).then(farms => {
        this.farms = farms;
        // seleciona a fazenda
        if (purchaseForecast.farm != null && purchaseForecast.farm != undefined) {
          this.formFiscalNote.get('farmId').setValue(purchaseForecast.farm.id);
        }
      });
    }

    if (purchaseForecast.carrier != null && purchaseForecast.carrier != undefined) {
      this.formTransportation.get('carrierId').setValue(purchaseForecast.carrier.id);
    }

    this.formTransportation.get('driverName').setValue(purchaseForecast.driverName);
    this.formTransportation.get('originWeightString').setValue(purchaseForecast.originWeightString);
    this.formTransportation.get('vehiclePlate1').setValue(purchaseForecast.vehiclePlate1);
    this.formTransportation.get('vehiclePlate2').setValue(purchaseForecast.vehiclePlate2);

    this.formFiscalNote.get('barCode').setValue(purchaseForecast.barCode);
    this.formFiscalNote.get('code').setValue(purchaseForecast.fiscalNoteCode);
    this.formFiscalNote.get('emissionDateString').setValue(purchaseForecast.emissionDateString);

    // converte quantidade líquida em kilos para sacas
    let sacks = this.kilosSacksConverterService.kilosToSacks(purchaseForecast.quantity);
    this.formFiscalNote.get('quantity').setValue(sacks);

    this.formFiscalNote.get('unitPriceString').setValue(purchaseForecast.unitPriceString);
    this.formFiscalNote.get('purchaseCode').setValue(purchaseForecast.purchaseCode);

    if (purchaseForecast.strainer != null && purchaseForecast.strainer != undefined) {
      this.formFiscalNote.get('strainerId').setValue(purchaseForecast.strainer.id);
    }

    if (purchaseForecast.packType != null && purchaseForecast.packType != undefined) {
      this.formFiscalNote.get('packTypeId').setValue(purchaseForecast.packType.id);
    }

    // certificados para adicioar á nota no momento de salvar
    this.certificatesToAdd = purchaseForecast.certificates;
  }

  /**
   * Salva transporte com notas fiscais
   *
   * @param confirmedSaveWithoudFiscalNote Para verificar se já foi confirmado quando não há notas fiscais
   */
  save(confirmedSaveWithoudFiscalNote: boolean) {

    this.submitted = true;

    Object.keys(this.formTransportation.controls).forEach(key => {
      this.formTransportation.controls[key].markAsDirty();
    });

    if (!this.formTransportation.valid) {
      return;
    }

    // precisa confirmar quando não há notas fiscais,
    // somente quando é permitido não ter notas fiscais
    if (!this.isFiscalNoteMandatory()) {

      if (!confirmedSaveWithoudFiscalNote && (!this.transportation.fiscalNotes || !this.transportation.fiscalNotes.length)) {
        this.saveConfirmWithoutFiscalNote.open(null);
        return;
      }

    } else if (!this.transportation.fiscalNotes || !this.transportation.fiscalNotes.length) {
      return;
    }

    this.loading = true;
    this.transportation.carrier = this.carriers.find(
      c => c.id === this.formTransportation.value.carrierId
    );
    this.transportation.vehiclePlate1 = this.formTransportation.value.vehiclePlate1;
    this.transportation.vehiclePlate2 = this.formTransportation.value.vehiclePlate2;
    this.transportation.vehiclePlate3 = this.formTransportation.value.vehiclePlate3;
    this.transportation.originWeightString = this.formTransportation.value.originWeightString;
    this.transportation.driverName = this.formTransportation.value.driverName;
    this.transportation.type = TransportationType.IN.code;
    this.transportation.productType = this.formTransportation.value.productType;

    return this.transportationService.save(this.transportation).then(transportation => {

      Notification.success('Entrada salva com sucesso!');

      if (!this.editing && this.unified
        && transportation.status === TransportationStatus.AUTORIZACAO_EFETUADA.code) {

        this.router.navigate(['/balance', 'in', transportation.id]);

      } else {
        if (this.unified) {
          this.router.navigate(['/balance']);
        } else {
          this.router.navigate(['/lobby']);
        }
      }
    })
      .catch(error => this.handleError(error));
  }

  handleError(error) {
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }

  get quantityNetWeight() {
    return (
      (!this.packing) ? this.formFiscalNote.value.quantity * this.kilosSacksConverterService.sacksInKilos : 0
    );
  }

  /**
   * Busca ordens de compra pelo stakeholder, se o tela requer a exibição.
   */
  getPurchaseOrdersByStakeholder(stakeholderId: string) {

    if (this.showPurchaseOrder) {

      // limpa lista quando não há stakeholder especificado ou ocorreu erro na busca
      if (stakeholderId != null && stakeholderId != '') {

        // para evitar fazer multiplas consultas
        if (this.isRequestingPurchaseOrders == false) {

          this.isRequestingPurchaseOrders = true;

          this.purchaseOrderService.listNotDischarged(stakeholderId).then(list => {
            this.purchaseOrders = list;
            this.isRequestingPurchaseOrders = false;
          }).catch(error => {
            this.purchaseOrders = [];
            this.isRequestingPurchaseOrders = false;
            console.error(error);
          });
        }

      } else {
        this.purchaseOrders = [];
      }
    }
  }

  /**
   * Verifica a necessidade de confirmação de aviso para nota fiscal sem ordem de compra
   */
  needConfirmFiscalNoteWithoutPurchaseOrder(): boolean {

    // caso tenha exibição de ordem de compra,
    // e nenhuma foi selecionada, e ainda não comunicado,
    // precisa informar o usuário
    if (this.showPurchaseOrder && this.confirmedFiscalNoteWithoutPurchaseOrder == false
      && (this.formFiscalNote.value.purchaseOrderId == null || this.formFiscalNote.value.purchaseOrderId == '')
    ) {
      return true;
    }

    return false;
  }

  /**
   * Confirmação do conhecimento que a nota fiscal está sem ordem de compra.
   */
  setConfirmFiscalNoteWithoutPurchaseOrder() {

    this.confirmedFiscalNoteWithoutPurchaseOrder = true;

    if (this.confirmFiscalNoteWithoutPurchaseOrder) {
      this.confirmFiscalNoteWithoutPurchaseOrder.close();
    }

    this.salvarNf(null);
  }


  /**
   * Verifica a necessidade de confirmação de aviso para nota fiscal
   * com valor de sacas extrapolando previsão da ordem de compra.
   * É necessário considerar se há outras notas com a mesmo ordem de compra
   */
  needConfirmExtrapolatedQuantitySacks(): boolean {

    // caso tenha exibição de ordem de compra,
    // e alguma foi selecionada, e ainda não verificado e o valor está extrapolado
    if (this.showPurchaseOrder && this.confirmedExtrapolatedQuantitySacks == false
      && (this.formFiscalNote.value.purchaseOrderId != null && this.formFiscalNote.value.purchaseOrderId != '')
    ) {

      let purchaseOrder = this.purchaseOrders.find(p => p.id === this.formFiscalNote.value.purchaseOrderId);
      if (purchaseOrder) {

        let totalSacks: number = Number(this.formFiscalNote.value.quantity || 0) + Number(purchaseOrder.dischargedQuantity || 0);
        let sacksOrder: number = Number(purchaseOrder.sacksQuantity || 0);

        // considera outras notas fiscais com a mesmo ordem de compra para somar ao total de sacas
        if (this.transportation.fiscalNotes != null && this.transportation.fiscalNotes.length > 0) {
          this.transportation.fiscalNotes.forEach(fiscalNote => {
            if (fiscalNote.purchaseOrder != null && fiscalNote.purchaseOrder.id === purchaseOrder.id
              && fiscalNote.quantity != null) {
              totalSacks += Number(fiscalNote.quantity || 0);
            }
          });
        }

        if (totalSacks > sacksOrder) {
          this.extrapolatedQuantitySacks = (totalSacks - sacksOrder);
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Confirma que será adicionado nota fiscal mesmo com valor de sacas
   * extrapolando previsão da ordem de compra
   */
  setConfirmExtrapolatedQuantitySacks() {

    this.confirmedExtrapolatedQuantitySacks = true;

    if (this.confirmExtrapolatedQuantitySacks) {
      this.confirmExtrapolatedQuantitySacks.close();
    }

    this.salvarNf(null);
  }

  openSenderStakeholderForm() {
    this.senderStakeholderFormModal.open(null);
  }

  senderStakeholderFormSubmit(warehouseStakeholder: WarehouseStakeholder) {
    (<any>jQuery)('.modal').modal('hide');
    this.senderStakeholderFormModal.close();
    if (warehouseStakeholder) {
      this.senderAutocomplete.value = warehouseStakeholder;
    }
  }

  openOwnerStakeholderForm() {
    this.ownerStakeholderFormModal.open(null);
  }

  ownerStakeholderFormSubmit(warehouseStakeholder: WarehouseStakeholder) {
    (<any>jQuery)('.modal').modal('hide');
    this.ownerStakeholderFormModal.close();
    if (warehouseStakeholder) {
      this.ownerAutocomplete.value = warehouseStakeholder;
    }
  }

  openNewPurchaseOrderFormModal() {
    this.newPurchaseOrderFormModal.open(null);
  }

  newPurchaseOrderFormModalSubmit(purchaseOrder: PurchaseOrder) {
    (<any>jQuery)('.modal').modal('hide');
    this.newPurchaseOrderFormModal.close();
    if (purchaseOrder) {
      this.purchaseOrders.push(purchaseOrder);
      this.formFiscalNote.get('purchaseOrderId').setValue(purchaseOrder.id);
    }
  }

}
