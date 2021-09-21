import { Notification } from './../../shared/notification/notification';
import { ErrorHandler, ModalManager, Search } from '../../shared/shared.module';
import { Logger } from '../../shared/logger/logger';
import { Component } from '@angular/core/src/metadata/directives';
import { OnInit, OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { FormGroup } from '@angular/forms/src/model';
import { Masks } from 'app/shared/forms/masks/masks';
import { FormBuilder } from '@angular/forms/src/form_builder';
import { DateTimeHelper } from 'app/shared/globalization/date-time-helper';
import { Validators } from '@angular/forms/src/validators';
import { ClassifSpecialCoffee } from './classif-special-coffee';
import {ClassifSpecialCoffeeService} from "./classif-special-coffee.service";
import {ClassifSpecialCoffeeFilter} from "./classif-special-coffee-filter";
import {TypeCoffee} from "../../pack-type/type-coffee";
import {NumberHelper} from "../../shared/globalization";
import {WarehouseStakeholderAutocomplete} from "../../warehouse-stakeholder/warehouse-stakeholder-autocomplete";
import {CollaboratorAutocomplete} from "../../collaborator/collaborator-autocomplete";
import {WarehouseStakeholderService} from "../../warehouse-stakeholder/warehouse-stakeholder.service";
import {CollaboratorService} from "../../collaborator/collaborator.service";
import {Subscription} from "rxjs";
import {ServiceInstruction} from "../../service-instruction/service-instruction";
import {AuthService} from "../../auth/auth.service";
import {SpecialCoffeeSituation} from "../../classification/special-coffee-situation";
const FileSaver = require('file-saver');

@Component({
  selector: 'classif-special-coffee',
  templateUrl: './classif-special-coffee.component.html'

})
export class ClassifSpecialCoffeeComponent implements OnInit, OnDestroy {
  loading: boolean = false;
  form: FormGroup;
  dateMask: any = Masks.dateMask;
  specialCoffeeSituationTypes = [];
  coffeeSituationTypes = [];
  stakeholderAutocomplete: WarehouseStakeholderAutocomplete;
  collaboratorAutocomplete: CollaboratorAutocomplete;
  stakeholderSubscription: Subscription;
  collaboratorSubscription: Subscription;
  specialCoffeeSituationSubscription: Subscription;
  classifSpecialCoffeeFilter: ClassifSpecialCoffeeFilter;
  specialCoffeeAnalyzed: Boolean = false;

  constructor(
    private errorHandler: ErrorHandler,
    private logger: Logger,
    private formBuilder: FormBuilder,
    private classifSpecialCoffeeService: ClassifSpecialCoffeeService,
    private warehouseStakeholderService: WarehouseStakeholderService,
    private collaboratorService: CollaboratorService,
    private auth: AuthService
  ) {
    this.specialCoffeeSituationTypes.push({ value: 'indicated', name: 'Indicados e não analisados' });
    this.specialCoffeeSituationTypes.push({ value: 'analyzed', name: 'Analisados' });
    this.coffeeSituationTypes = SpecialCoffeeSituation.listByReportSpecialCoffee();
  }

  ngOnInit() {
    this.stakeholderAutocomplete = new WarehouseStakeholderAutocomplete(this.warehouseStakeholderService, this.errorHandler);
    this.collaboratorAutocomplete = new CollaboratorAutocomplete(this.collaboratorService, this.errorHandler);
    this.classifSpecialCoffeeFilter = new ClassifSpecialCoffeeFilter();
    this.buildForm();
  }

  ngOnDestroy() {
    let subscriptions = [
      this.stakeholderSubscription,
      this.collaboratorSubscription,
      this.specialCoffeeSituationSubscription
    ];
    subscriptions.forEach((subscription: Subscription) => {
      if (subscription && !subscription.closed) {
        subscription.unsubscribe();
      }
    });
  }

  submitPdf() {
    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
    });
    if (!this.form.valid) {
      return;
    }
    this.specialCoffeeReportPdf();
  }

  submitCsv() {
    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
    });
    if (!this.form.valid) {
      return;
    }
    this.specialCoffeeReportCsv();
  }

  buildForm() {
    this.specialCoffeeAnalyzed = false;
    this.form = this.formBuilder.group({
      'dateStartString': [
        '',
        [Validators.required],
      ],
      'dateEndString': [
        '',
        [Validators.required],
      ],
      'specialCoffeeSituation': [
        '',
        [Validators.required],
      ],
      'coffeeSituation': [
        '',
        [Validators.required],
      ],
      'collaborator': [{
        value: this.classifSpecialCoffeeFilter.collaborator ? this.classifSpecialCoffeeFilter.collaborator.label : ''
      },
        []
      ],
      'client': [{
        value: this.classifSpecialCoffeeFilter.clientStakeholder ? this.classifSpecialCoffeeFilter.clientStakeholder.label : ''
      },
        []
      ]
    });

    this.stakeholderAutocomplete.value = this.classifSpecialCoffeeFilter.clientStakeholder;
    this.collaboratorAutocomplete.value = this.classifSpecialCoffeeFilter.collaborator;

    this.stakeholderSubscription = this.stakeholderAutocomplete.valueChange.subscribe((value) => {
      const id = value ? value.id : null;
      this.form.get('client').setValue(id);
      this.classifSpecialCoffeeFilter.clientStakeholder = this.stakeholderAutocomplete.value;
    });

    this.collaboratorSubscription = this.collaboratorAutocomplete.valueChange.subscribe((value) => {
      const id = value ? value.id : null;
      this.form.get('collaborator').setValue(id);
      this.classifSpecialCoffeeFilter.collaborator = this.collaboratorAutocomplete.value;
    });

    this.specialCoffeeSituationSubscription = this.form.get('specialCoffeeSituation').valueChanges.subscribe((specialCoffeeSituation) => {
      if (specialCoffeeSituation ==  'analyzed') {
        this.specialCoffeeAnalyzed = true;
        this.form.controls["coffeeSituation"].setValidators(Validators.required);
        this.form.controls["coffeeSituation"].updateValueAndValidity();
      } else {
        this.specialCoffeeAnalyzed = false;
        this.form.controls["coffeeSituation"].setValidators(null);
        this.form.controls["coffeeSituation"].updateValueAndValidity();
      }
    });
  }

  isArmazemGeral(): boolean {
    let isArmazemGeral = this.auth.findParameterValue('SERVICE_INSTRUCTION_FOR');
    return isArmazemGeral !== null && isArmazemGeral === 'Armazém Geral'
  }

  specialCoffeeReportPdf() {
    this.loading = true;
    this.classifSpecialCoffeeFilter = new ClassifSpecialCoffeeFilter();
    let dateStart = this.form.value.dateStartString;
    let dateEnd = this.form.value.dateEndString;

    dateStart = DateTimeHelper.fromDDMMYYYYHHmm(dateStart);
    dateEnd = DateTimeHelper.fromDDMMYYYY(dateEnd, true);

    this.classifSpecialCoffeeFilter.dateStart = +new Date(dateStart ? dateStart : 0);
    this.classifSpecialCoffeeFilter.dateEnd = +new Date(dateEnd ? dateEnd : 0);
    this.classifSpecialCoffeeFilter.specialCoffeeSituation = this.form.value.specialCoffeeSituation;
    this.classifSpecialCoffeeFilter.coffeeSituation = this.form.value.coffeeSituation;
    this.classifSpecialCoffeeFilter.clientStakeholder = this.stakeholderAutocomplete.value;
    this.classifSpecialCoffeeFilter.collaborator = this.collaboratorAutocomplete.value;

    let blob: Promise<Blob> = this.classifSpecialCoffeeService.find(this.classifSpecialCoffeeFilter);
    blob.then((b) => {
      if (b.size === 0) {
        Notification.error('Não foi encontrado informações para abrir o relatório!');
      } else {
        let urlReport = window.URL.createObjectURL(b);
        window.open(urlReport);
      }
      this.loading = false;
    });
  }

  specialCoffeeReportCsv() {
    this.loading = true;
    this.classifSpecialCoffeeFilter = new ClassifSpecialCoffeeFilter();
    let dateStart = this.form.value.dateStartString;
    let dateEnd = this.form.value.dateEndString;

    dateStart = DateTimeHelper.fromDDMMYYYYHHmm(dateStart);
    dateEnd = DateTimeHelper.fromDDMMYYYY(dateEnd, true);

    this.classifSpecialCoffeeFilter.dateStart = +new Date(dateStart ? dateStart : 0);
    this.classifSpecialCoffeeFilter.dateEnd = +new Date(dateEnd ? dateEnd : 0);
    this.classifSpecialCoffeeFilter.specialCoffeeSituation = this.form.value.specialCoffeeSituation;
    this.classifSpecialCoffeeFilter.coffeeSituation = this.form.value.coffeeSituation;
    this.classifSpecialCoffeeFilter.clientStakeholder = this.stakeholderAutocomplete.value;
    this.classifSpecialCoffeeFilter.collaborator = this.collaboratorAutocomplete.value;

    this.classifSpecialCoffeeService.findCsv(this.classifSpecialCoffeeFilter).then((classifSpecialCoffee: Array<ClassifSpecialCoffee>) => {
      if (classifSpecialCoffee.length === 0) {
        Notification.error('Não foi encontrado informações para abrir o relatório!');
      }
      let csv = 'Numero do lote: ' + ';'
              + (this.isArmazemGeral()?'Código do cliente:':'Código do cooperado:') + ';'
              + (this.isArmazemGeral()?'Nome do cliente:':'Nome do cooperado:') + ';'
              + 'Sacas:' + ';'
              + 'Data entrada do lote:' + ';'
              + 'Bebida:' + ';'
              + 'Observação de Café Especial:' + ';'
              + 'Tipo do Lote:' + ';'
              + 'Situação Café Especial:' + ';'
              + 'Pontuação:' + ';'
              + 'Peneira 16+:' + ';'
              + 'Quebra:' + ';'
              + 'Teor de umidade:' + ';'
              + 'Padrão:' + ';'
              + 'Padrão Especial: \n';
      classifSpecialCoffee.forEach(data => {
          let batchCode = data.batchCode;
          let collaboratorCode = data.collaboratorCode;
          let collaboratorName = data.collaboratorName;
          let ownerCode = data.ownerCode;
          let ownerName = data.ownerName;
          let sacks = data.sacks;
          let entryDate = DateTimeHelper.toDDMMYYYYHHmm(data.entryDate);
          let drink = (data.drink)?data.drink:'-';
          let observationSpecialCoffee = (data.observationSpecialCoffee)?data.observationSpecialCoffee:'-';
          let batchTypeCoffee = TypeCoffee.fromData(data.batchTypeCoffee);
          let specialCoffeeSituation = (data.specialCoffeeSituation)?data.specialCoffeeSituation:'-';
          let pointing = (data.pointing)?data.pointing:'-';
          let strainer16 = (data.strainer16)?data.strainer16:'-';
          let sampler = (data.sampler)?data.sampler:'-';
          let specialSampler = (data.specialSampler)?data.specialSampler:'-';
          let breaking = (data.breaking)?data.breaking:'-';
          let moistureContent = (data.moistureContent)?data.moistureContent:'-';
          csv += batchCode + ';';
          csv += (this.isArmazemGeral()? ownerCode :collaboratorCode) + ';';
          csv += (this.isArmazemGeral()? ownerName :collaboratorName) + ';';
          csv += sacks + ';';
          csv += entryDate + ';';
          csv += drink + ';';
          csv += observationSpecialCoffee + ';';
          csv += (batchTypeCoffee.name?batchTypeCoffee.name:'-') + ';';
          csv += specialCoffeeSituation + ';';
          csv += pointing + ';';
          csv += strainer16 + ';';
          csv += breaking + ';';
          csv += moistureContent + ';';
          csv += sampler + ';';
          csv += specialSampler + '\n';
      });

      FileSaver.saveAs(new Blob([csv], { type: "text/csv;charset=utf-8" }), 'RelatorioCafeSpecial.csv');
      this.loading = false;
    });
  }
}
