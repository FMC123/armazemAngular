import { EconomicGroupService } from '../../../economic-group/economic-group.service';
import { EconomicGroup } from '../../../economic-group/economic-group';
import { PersonType } from './../../person-type';
import { ServiceItem } from '../../../service-item/service-item';
import { ServiceItemService } from '../../../service-item/service-item.service';
import { ServiceGroupService } from '../../../service-group/service-group.service';
import { ServiceGroup } from '../../../service-group/service-group';
import { Subscription } from 'rxjs/Rx';
import { Country } from '../../../country/country';
import { Uf } from '../../../uf/uf';
import { City } from '../../../city/city';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Masks } from './../../../shared/forms/masks/masks';
import { ErrorHandler } from './../../../shared/errors/error-handler';
import { ModalManager } from './../../../shared/modals/modal-manager';
import { AuthService } from './../../../auth/auth.service';
import { Warehouse } from './../../../warehouse/warehouse';
import { Notification } from './../../../shared/notification/notification';

import { UfService } from '../../../uf/uf.service';
import { CityService } from '../../../city/city.service';
import { CountryService } from '../../../country/country.service';


import { PersonModalService } from '../person-modal.service';
import { PersonService } from '../../person.service';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Person } from 'app/person/person';

@Component({
  selector: 'app-person-modal-form',
  templateUrl: 'person-modal-form.component.html'
})

export class PersonModalFormComponent implements OnInit, OnDestroy {
  @Input() id: string;
  form: FormGroup;
  loading: boolean = false;
  editing: boolean = false;
  codeChangeAlert: ModalManager = new ModalManager();
  ufs: Array<Uf>;
  countrys: Array<Country>;
  citys: Array<City>;
  submitted: boolean = false;
  ufSubscription: Subscription;
  serviceGroups: Array<ServiceGroup>;
  economicGroups: Array<EconomicGroup>;
  get personsType() {
    return [PersonType.PHYSICAL,
            PersonType.JURIDICAL,
            PersonType.PRODUCER,
            PersonType.INTERNATIONAL];
  }
  cpfMask = Masks.cpfMask;
  cnpjMask = Masks.cnpjMask;
  rgMask = Masks.rgMask;
  integerMask = Masks.integerMask;
  bootMode: string = this.service.bootMode;


  constructor(
    private service: PersonModalService,
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private personService: PersonService,
    private errorHandler: ErrorHandler,
    private countryService: CountryService,
    private cityService: CityService,
    private ufService: UfService,
    private economicGroupService: EconomicGroupService,
  ) { }

  ngOnInit() {
    Notification.clearErrors();
      if (this.id && !this.service.personEditMoment) {
        this.service.personEditMoment = true;
         this.service.findPerson(this.id).then((person: Person) => {
          this.service.person = person;
          this.person = person;
        });
      }else {
        this.person = this.service.person;
      }

      this.economicGroupService.list().then((economicGroups: Array<EconomicGroup>) => {
        this.economicGroups = economicGroups;
      });


      this.buildForm();

  }

  get person() {
    return this.service.person;
  }

  set person(value) {
    this.service.person = value;
  }

  get newPersonLobby() {
    if (!this.auth.hasPermission('PERSON_NEW')) {
      return true;
    }
    return false;
  }

  ngOnDestroy() {
  /*   if (this.ufSubscription && !this.ufSubscription.closed) {
      this.ufSubscription.unsubscribe();
    } */
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      personType: [
        {value: (this.person && this.person.personType) ? this.person.personType : '', disabled : this.notValid},
        [ Validators.required ]
      ],
      active: [
        this.person.active ? this.person.active : '',
        [Validators.required]
      ],
      name: [this.person.name ? this.person.name : '', [Validators.required]],
      tradingName: [this.person.tradingName ? this.person.tradingName : ''],
      rg: [this.person.rg ? this.person.rg : ''],
      producerRegistration: [
        this.person.producerRegistration ? this.person.producerRegistration : ''
      ],
      document: [
        {value: this.person.document ? this.person.document : '', disabled: this.notValid},
        [Validators.required]
      ],
      stateRegistration: [
        this.person.stateRegistration ? this.person.stateRegistration : '',
        [Validators.required]
      ],
      economicGroupId: [
        this.person.economicGroup ? this.person.economicGroup.id : ''
      ],
    });
  }

  save() {
    this.submitted = true;
    Object.keys(this.form.controls).forEach(key => {
      this.form.controls[key].markAsDirty();
    });

    if (this.produtor) {
      this.form.get('producerRegistration').enable();
      this.form.get('stateRegistration').disable();
    } else if (this.pessoaJuridica) {
      this.form.get('producerRegistration').disable();
      this.form.get('stateRegistration').enable();
    } else if (this.pessoaFisica) {
      this.form.get('producerRegistration').disable();
      this.form.get('stateRegistration').disable();
    } else if (this.internacional) {
      this.form.get('producerRegistration').disable();
      this.form.get('stateRegistration').disable();
    }
    if (!this.form.valid) {
      return;
    }
    this.loading = true;
    this.person.personType = this.form.get('personType').value;
    this.person.active = this.form.value.active;
    this.person.name = this.form.value.name;
    this.person.tradingName = this.form.value.tradingName;
    if (this.form.value.rg){
      this.person.rg = this.form.value.rg.replace(/\D/g, '');
    }
    if (this.produtor) {
      this.person.producerRegistration = this.form.value.producerRegistration.replace(/\D/g, '');
    }
      this.person.document = this.form.get('document').value ? this.form.get('document').value.replace(/\D/g, '') : '';
    if (this.pessoaJuridica) {
      this.person.stateRegistration = this.form.value.stateRegistration.replace(/\D/g, '');
    }
    this.person.economicGroup = this.economicGroups.find(eg => eg.id === this.form.value.economicGroupId);

    this.personService
      .save(this.person)
      .then(person => {
        this.service.personEditMoment = false;
        if (person.id) {
        Notification.success('Pessoa salvo com sucesso!');
        this.service.select.emit(person.id);
        }
      })
      .catch(error => this.handleError(error));
  }

  get notValid(): boolean {
    if (this.person && this.person.id) {
      return true;
    }else {
      return false;
    }
  }

  get pessoaFisica() {
    return this.form.get('personType').value === PersonType.PHYSICAL.code;
  }

  get pessoaJuridica() {
    return this.form.get('personType').value === PersonType.JURIDICAL.code;
  }

  get produtor() {
    return this.form.get('personType').value === PersonType.PRODUCER.code;
  }

  get internacional() {
    return this.form.get('personType').value === PersonType.INTERNATIONAL.code;
  }

  private handleCriticalError(error) {
    this.handleError(error).catch(() => {
      this.router.navigate(['/error']);
    });
  }

  private handleError(error) {
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }

  returnListPerson(){
    this.service.reset();
  }
}
