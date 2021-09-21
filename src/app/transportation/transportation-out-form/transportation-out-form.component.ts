import { VehiclePlateService } from '../../vehicle-plate/vehicle-plate.service';
import { DriverService } from '../../driver/driver.service';
import { Observable, Subscription } from 'rxjs/Rx';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Carrier } from '../../carrier/carrier';
import { CarrierService } from '../../carrier/carrier.service';
import { PackType } from '../../pack-type/pack-type';
import { ErrorHandler } from '../../shared/errors/error-handler';
import { Masks } from '../../shared/forms/masks/masks';
import { Notification } from '../../shared/notification/notification';
import { Transportation } from '../transportation';
import { TransportationStatus } from '../transportation-status';
import { TransportationType } from '../transportation-type';
import { TransportationService } from '../transportation.service';
import {ProductTransportationType} from "../product-transportation-type";
import {CustomValidators} from "../../shared/forms/validators/custom-validators";
import {FiscalNote} from "../../fiscal-note/fiscal-note";
import {CollaboratorAutocomplete} from "../../collaborator/collaborator-autocomplete";
import {WarehouseStakeholderAutocomplete} from "../../warehouse-stakeholder/warehouse-stakeholder-autocomplete";
import {CollaboratorService} from "../../collaborator/collaborator.service";
import {WarehouseStakeholderService} from "../../warehouse-stakeholder/warehouse-stakeholder.service";
import {ParameterService} from "../../parameter/parameter.service";
import {FiscalNoteType} from "../../fiscal-note/fiscal-note-type";
import {PackStockMovementGroup} from "../../pack-stock/pack-stock-movement-group";
import {DateTimeHelper, NumberHelper} from "../../shared/globalization";
import {PackStockMovementGroupRecordType} from "../../pack-stock/pack-stock-movement-group-record-type";
import {TransportationFiscalNoteCertificate} from "../transportation-fiscal-note/certificate/transportation-fiscal-note-certificate";
import {AuthService} from "../../auth/auth.service";
import {TransportationFiscalNoteService} from "../transportation-fiscal-note/transportation-fiscal-note.service";
import {PackStockService} from "../../pack-stock/pack-stock.service";
import { Driver } from '../../driver/driver';
import { DriverAutocomplete } from "../../driver/driver-autocomplete";
import {ModalManager} from "../../shared/modals/modal-manager";

const uuid = require('uuid/v4');

@Component({
  selector: 'app-transportation-out-form',
  templateUrl: './transportation-out-form.component.html'
})
export class TransportationOutFormComponent implements OnInit, OnDestroy {

  submitted = false;
  form: FormGroup;
  loading: boolean = false;

  packTypes: Array<PackType>;
  carriers: Array<Carrier>;
  transportation: Transportation;
  unified = false;
  breadcrumb = null;

  decimalMask: any = Masks.decimalMask;
  dateMask = Masks.dateMask;
  integerMask = Masks.integerMask;
  plate1Mask = Masks.vehiclePlateMask;
  plate2Mask = Masks.vehiclePlateMask;
  plate3Mask = Masks.vehiclePlateMask;

  // driverDatasource: Observable<Array<String>>;
  // driverDatasourceSubscribe: Subscription;
  vehiclePlate1Datasource: Observable<Array<String>>;
  vehiclePlate1DatasourceSubscribe: Subscription;
  vehiclePlate2Datasource: Observable<Array<String>>;
  vehiclePlate2DatasourceSubscribe: Subscription;
  vehiclePlate3Datasource: Observable<Array<String>>;
  vehiclePlate3DatasourceSubscribe: Subscription;
  productTypeSubscription: Subscription;

  packing = false;
  fiscalNote: FiscalNote;
  formFiscalNote: FormGroup;
  collaboratorAutocomplete: CollaboratorAutocomplete;
  collaboratorSubscription: Subscription;
  ownerAutocomplete: WarehouseStakeholderAutocomplete;
  ownerSubscription: Subscription;
  // tempo de espera para requisições em segundos
  debounceTimeValue: number = 2000;
  replaceStakeholderForCollaborator = false;
  isRequestingCollaboratorValidation = false;
  isEditingFiscalNote: boolean = false;
  calculationMode: string;
  sackWeight: number = 60;

  driverAutocomplete: DriverAutocomplete;
  driverSubscription: Subscription;
  alertDriverExpired: ModalManager = new ModalManager();
  driverAlertMessage: string;

  get editing() {
    return !!this.transportation && !!this.transportation.id;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private transportationService: TransportationService,
    private errorHandler: ErrorHandler,
    private carrierService: CarrierService,
    private driverService: DriverService,
    private vehiclePlateService: VehiclePlateService,
    private collaboratorService: CollaboratorService,
    private warehouseStakeholderService: WarehouseStakeholderService,
    private parameterService: ParameterService,
    private authService: AuthService,
    private transportationFiscalNoteService: TransportationFiscalNoteService,
    private packStockService: PackStockService,
  ) { }

  ngOnInit() {
    Notification.clearErrors();
    this.driverAutocomplete = new DriverAutocomplete(this.driverService, this.errorHandler);

    this.carrierService.list().then((carriers) => {
      this.carriers = carriers;
    });

    this.collaboratorAutocomplete = new CollaboratorAutocomplete(
      this.collaboratorService,
      this.errorHandler
    );
    this.ownerAutocomplete = new WarehouseStakeholderAutocomplete(
      this.warehouseStakeholderService,
      this.errorHandler
    );

    this.parameterService
      .replaceStakeholderForCollaborator()
      .then(replaceStakeholderForCollaborator => {
        this.replaceStakeholderForCollaborator = replaceStakeholderForCollaborator;
        this.buildFormFiscalNote();
    });


    this.parameterService.sacksInKilos().then( res => {
      this.sackWeight = res;
      this.buildForm();
    });

    this.parameterService.findByKey('BATCH_OPERATION_QUANTITY_CALCULATION_MODE').then( res => {
      this.calculationMode = res.value;
      this.buildForm();
    });

    this.route.data.forEach((data: { transportation: Transportation, unified: boolean }) => {
      this.unified = data.unified;
      this.buildBreadcrumb();

      this.transportation = data.transportation;

      this.fiscalNote = new FiscalNote();

      this.packing = this.transportation.productType == ProductTransportationType.PACKING.code;
      if(this.packing)
      {
        this.transportation.fiscalNotes.forEach(fiscalNote =>{
          this.packStockService.findByFiscalNote(fiscalNote.id).then(packStock => {
            fiscalNote.packStockMovementGroup = packStock;
          });
        });
      }

      this.buildForm();
      this.buildFormFiscalNote();

      // this.driverDatasource = Observable.create((observer: any) => {
      //   observer.next(this.form.get('driverId').value);
      // }).mergeMap((token) => Observable.fromPromise(this.driverService.search(token)));
      // this.driverDatasourceSubscribe = this.driverDatasource.subscribe();

      this.vehiclePlate1Datasource = Observable.create((observer: any) => {
        observer.next(this.form.get('vehiclePlate1').value);
      }).mergeMap((token) => Observable.fromPromise(this.vehiclePlateService.search(token, 1)));
      this.vehiclePlate1DatasourceSubscribe = this.vehiclePlate1Datasource.subscribe();

      this.vehiclePlate2Datasource = Observable.create((observer: any) => {
        observer.next(this.form.get('vehiclePlate2').value);
      }).mergeMap((token) => Observable.fromPromise(this.vehiclePlateService.search(token, 2)));
      this.vehiclePlate2DatasourceSubscribe = this.vehiclePlate2Datasource.subscribe();

      this.vehiclePlate3Datasource = Observable.create((observer: any) => {
        observer.next(this.form.get('vehiclePlate3').value);
      }).mergeMap((token) => Observable.fromPromise(this.vehiclePlateService.search(token, 3)));
      this.vehiclePlate3DatasourceSubscribe = this.vehiclePlate3Datasource.subscribe();

    });
  }

  ngOnDestroy() {
      this.clearSubscriptions();
  }

  clearSubscriptions() {
    let subscriptions = [
      this.driverSubscription,
      this.vehiclePlate1DatasourceSubscribe,
      this.vehiclePlate2DatasourceSubscribe,
      this.vehiclePlate3DatasourceSubscribe,
      this.productTypeSubscription,
      this.collaboratorSubscription,
      this.ownerSubscription
    ];

    subscriptions.forEach((subscription: Subscription) => {
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

    output.push(['Movimento de Saída', null]);

    this.breadcrumb = output;
  }

  get backLink() {
    if (this.unified) {
      return ['/balance'];
    }

    return ['/lobby'];
  }

  buildForm() {
    this.form = this.formBuilder.group({
      'productType': [this.transportation.productType ? this.transportation.productType || '' : ProductTransportationType.COFFEE.code, Validators.required],
      'carrierId': [this.transportation.carrier ? this.transportation.carrier.id || '' : ''],
      'driverId': [ this.transportation.driver ? this.transportation.driver.id : '', Validators.required],
      'vehiclePlate1': [this.transportation.vehiclePlate1 || '', Validators.required],
      'vehiclePlate2': [this.transportation.vehiclePlate2 || ''],
      'vehiclePlate3': [this.transportation.vehiclePlate3 || ''],
    });

    this.driverAutocomplete.value = this.transportation.driver;
    this.driverSubscription = this.driverAutocomplete.valueChange.subscribe((value) => {
      const id = value ? value.id : null;
      if (value && value.cnhExpirationDate < Date.now()) {
        this.driverAlertMessage = `A carteira de motorista de ${value.name} venceu no dia ${DateTimeHelper.toDDMMYYYY(value.cnhExpirationDate)}.`;
        this.alertDriverExpired.open(null);
      }
      this.form.get('driverId').setValue(id);
      this.transportation.driver = this.driverAutocomplete.value;
    });

    this.productTypeSubscription = this.form.get('productType').valueChanges.subscribe(() => {
      this.packing = this.form.get('productType').value == ProductTransportationType.PACKING.code;
    });

  }

  buildFormFiscalNote() {
    this.formFiscalNote = this.formBuilder.group({
      code: [this.fiscalNote.code || '', Validators.required],
      serie: [this.fiscalNote.serie || '', Validators.required],
      emissionDateString: [this.fiscalNote.emissionDateString || '', Validators.required],
      totalPrice: [this.fiscalNote.totalPriceString || '', Validators.required],
      collaboratorId: new FormControl(
        this.fiscalNote.collaborator
          ? this.fiscalNote.collaborator.id || ''
          : '',
        this.replaceStakeholderForCollaborator ? Validators.required : null,
        this.replaceStakeholderForCollaborator
          ? this.collaboratorHasStackholderValidator()
          : null
      ),
      ownerStakeholderId: [
        this.fiscalNote.ownerStakeholder
          ? this.fiscalNote.ownerStakeholder.id || ''
          : '',
        !this.replaceStakeholderForCollaborator ? Validators.required : null
      ]
    });

    this.collaboratorAutocomplete.value = this.fiscalNote.collaborator;

    this.collaboratorSubscription = this.collaboratorAutocomplete.valueChange.debounceTime(this.debounceTimeValue).subscribe(
      value => {
        const id = value ? value.id : null;
        this.formFiscalNote.get('collaboratorId').setValue(id);
      }
    );

    this.ownerAutocomplete.value = this.fiscalNote.ownerStakeholder;

    this.ownerSubscription = this.ownerAutocomplete.valueChange.debounceTime(this.debounceTimeValue).subscribe(
      value => {
        const id = value ? value.id : null;
        this.formFiscalNote.get('ownerStakeholderId').setValue(id);
      }
    );
  }

  collaboratorHasStackholderValidator() {

    return (control: AbstractControl) => {

      // para garantir que não acontece multiplas requisições
      if (this.isRequestingCollaboratorValidation == true) {
        return Promise.resolve(null);
      }

      if (!control.value) {
        return Promise.resolve(null);
      }

      this.isRequestingCollaboratorValidation = true;

      return this.collaboratorService.find(control.value).then(collaborator => {

        if (!collaborator || !collaborator.person || !collaborator.person.id) {
          return Promise.resolve(null);
        }

        return this.warehouseStakeholderService.findByPerson(collaborator.person.id).then(stakeholder => {

          let exists = stakeholder && stakeholder.id;
          this.isRequestingCollaboratorValidation = false;

          return exists
            ? null
            : { collaboratorHasStackholderValidator: true };
        })
          .catch(error => {
            console.error(error);
            this.isRequestingCollaboratorValidation = false;
          });

      }).catch(error => {
        console.error(error);
        this.isRequestingCollaboratorValidation = false;
      });
    };
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

    return this.isFiscalNoteCodeExistent().then((existent) => {
      if (existent) {
        this.formFiscalNote.get('code').setErrors({ alreadyInUse: true });
      }
    }).then(() => {
      //Somar a quantidade de embalagens vinda da lista
      let sumQuantity:number = 0;

      if(this.packing && this.fiscalNote.packStockMovementGroup)
      {
        this.fiscalNote.packStockMovementGroup.movements.forEach(movement => {
          sumQuantity = Number(sumQuantity) + Number(movement.quantityVariation);
        });
      }

      this.fiscalNote.code = this.formFiscalNote.value.code
      this.fiscalNote.serie = this.formFiscalNote.value.serie
      this.fiscalNote.emissionDateString = this.formFiscalNote.value.emissionDateString;
      this.fiscalNote.totalPrice = NumberHelper.fromPTBR(this.formFiscalNote.value.totalPrice);
      this.fiscalNote.ownerStakeholder = this.ownerAutocomplete.value;
      this.fiscalNote.senderStakeholder = this.ownerAutocomplete.value;
      this.fiscalNote.quantity = (this.packing) ? sumQuantity : 0;
      this.fiscalNote.noteType = FiscalNoteType.TRANSPORTATION_OUT.code;
      this.fiscalNote.collaborator = this.collaboratorAutocomplete.value;

      //Cria o agrupador de embalagens
      if(this.packing)
      {
        if(this.fiscalNote.packStockMovementGroup == undefined)
        {
          this.fiscalNote.packStockMovementGroup = new PackStockMovementGroup();
        }
        this.fiscalNote.packStockMovementGroup.indStockOut = true;
        this.fiscalNote.packStockMovementGroup.registrationDateString = DateTimeHelper.toDDMMYYYY(new Date().getTime());
        this.fiscalNote.packStockMovementGroup.observation = 'Saída de embalagem';
        this.fiscalNote.packStockMovementGroup.owner = this.ownerAutocomplete.value;
        this.fiscalNote.packStockMovementGroup.document = this.formFiscalNote.value.code;
        this.fiscalNote.packStockMovementGroup.recordType = PackStockMovementGroupRecordType.AUTOMATIC.code;
      }

      if (this.replaceStakeholderForCollaborator) {
        return this.warehouseStakeholderService
          .findByPerson(this.fiscalNote.collaborator.person.id)
          .then(stakeholder => {
            this.fiscalNote.senderStakeholder = stakeholder;
            this.fiscalNote.ownerStakeholder = stakeholder;
            this.fiscalNote.packStockMovementGroup.owner = stakeholder;
            this.addFiscalNote();
          }).catch(() => { });
      }
      else {
        this.addFiscalNote();
      }

    }).catch(error => {
      this.loading = false;
      this.errorHandler.fromServer(error);
    });
  }

  /**
   * Adiciona efetivamente a nota fiscal na listagem (na memória)
   *
   */
  private addFiscalNote() {

    this.loading = false;

    const isEdit = this.transportation.fiscalNotes.some((fiscalNoteInList) => {
      if (this.fiscalNote === fiscalNoteInList) {
        return true;
      }
    });

    if (!isEdit) {
      this.transportation.fiscalNotes.push(this.fiscalNote);
    }

    this.resetFormFiscalNote();
  }

  resetFormFiscalNote() {
    this.fiscalNote = new FiscalNote();
    this.buildFormFiscalNote();
    this.isEditingFiscalNote = false;
    this.fiscalNote.packStockMovementGroup = new PackStockMovementGroup();
  }

  fillWith9ZerosLeft(value: string) {
    let leadingString = '000000000' + value;
    return leadingString.slice(leadingString.length - 9);
  }

  isFiscalNoteCodeExistent() {

    if (!this.authService.findParameterBoolean('UNIQUE_FISCAL_NOTE_CODE_BY_COLLABORATOR')) {
      return Promise.resolve(false);
    }

    const value = this.fillWith9ZerosLeft(
      this.formFiscalNote.get('code').value
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

  save() {
    this.submitted = true;

    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
    });

    if (
      !this.form.valid
    ) {
      return;
    }

    this.loading = true;

    this.transportation.carrier = this.carriers.find(c => c.id === this.form.value.carrierId);
    this.transportation.vehiclePlate1 = this.form.value.vehiclePlate1;
    this.transportation.vehiclePlate2 = this.form.value.vehiclePlate2;
    this.transportation.vehiclePlate3 = this.form.value.vehiclePlate3;
    // this.transportation.driverName = this.form.value.driverName;
    this.transportation.type = TransportationType.OUT.code;
    this.transportation.productType = this.form.value.productType;

    return this.transportationService.save(this.transportation).then((transportation) => {
      Notification.success('Saída salva com sucesso!');

      if (transportation.status === TransportationStatus.AUTORIZACAO_EFETUADA.code) {
        this.router.navigate(['/balance', 'out', transportation.id]);
      } else {
        this.router.navigate(this.backLink);
      }
    }).catch((error) => this.handleError(error));
  }

  handleError(error) {
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }

  clean() {
    this.clearSubscriptions();
    this.buildFormFiscalNote();
    this.buildForm();
    this.resetFormFiscalNote();
    this.transportation.fiscalNotes = [];
  }

  openFiscalNoteForm(fiscalNote: FiscalNote) {
    this.fiscalNote = fiscalNote;

    if (!this.fiscalNote) {
      this.fiscalNote = new FiscalNote();
    }

    this.isEditingFiscalNote = true;
    this.buildFormFiscalNote();
  }

  /*maxCapacity(): string{
    if(!this.transportation.maxWeight) {
      this.transportation.maxWeight = 0;
    }
    return NumberHelper.toPTBR(this.calculationMode === 'NF' ? this.transportation.maxWeight / 60 : this.transportation.maxWeight )
  }*/

  /*calcMaxCapacity(maxCapacity: string){
    let maxC = NumberHelper.fromPTBR(maxCapacity ? maxCapacity : '0');
    this.transportation.maxWeight = this.calculationMode === 'NF' ? maxC * 60 : maxC;
  }*/

}
