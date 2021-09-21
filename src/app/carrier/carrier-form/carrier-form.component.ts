import { Person } from '../../person/person';
import { ModalManager } from '../../shared/modals/modal-manager';
import { Masks } from '../../shared/forms/masks/masks';
import { Subscription } from 'rxjs/Rx';
import { City } from '../../city/city';
import { Uf } from '../../uf/uf';
import { Country } from '../../country/country';
import { CityService } from '../../city/city.service';
import { UfService } from '../../uf/uf.service';
import { CountryService } from '../../country/country.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validator, Validators } from '@angular/forms';

import { Notification } from './../../shared/notification/notification';
import { Warehouse } from '../../warehouse/warehouse';
import { Carrier } from '../carrier';
import { CarrierService } from '../carrier.service';
import { WarehouseService } from '../../warehouse/warehouse.service';


@Component({
  selector: 'carrier-form',
  templateUrl: './carrier-form.component.html'
})
export class CarrierFormComponent implements OnInit {

  warehouses: Array<Warehouse>;
  carrier: Carrier;
  form: FormGroup;
  loading: boolean = false;
  ufs: Array<Uf>;
  countrys: Array<Country>;
  citys: Array<City>;
  submitted: boolean = false;
  ufSubscription: Subscription;
  rgMask = Masks.rgMask;
  cpfMask = Masks.cpfMask;
  cnpjMask = Masks.cnpjMask;
  zipCodeMask = Masks.postalCodeMask;
  phoneMask = Masks.phoneMask;
  integerMask = Masks.integerMask;
  personModalManager = new ModalManager();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private carrierService: CarrierService,
    private warehouseService: WarehouseService,
    private countryService: CountryService,
    private cityService: CityService,
    private ufService: UfService,
  ) { }

  ngOnInit() {
    Notification.clearErrors();
    this.route.data.forEach((data: { carrier: Carrier }) => {
      this.carrier = data.carrier;
      this.buildForm();
    });
    this.countryService.list().then((countrys: Array<Country>) => {
      this.countrys = countrys;
    });
    this.ufService.list().then((ufs: Array<Uf>) => {
      this.ufs = ufs;
    });
    this.cityService.list().then((citys: Array<City>) => {
      this.citys = citys;
    });
  }

  get pessoaFisica() {
    return this.form.get('personType').value === '1';
  }

  get pessoaJuridica() {
    return this.form.get('personType').value === '2';
  }

  buildForm() {
    this.form = this.formBuilder.group({
     /*  'code': [this.carrier.code || '', [Validators.required]],
      'personType': [this.carrier.personType || '', [Validators.required]],
      'companyName': [this.carrier.companyName || '', [Validators.required]],
      'contactName': [this.carrier.contactName || '', [Validators.required]],
      'tradingName': [this.carrier.tradingName || ''],
      'address': [this.carrier.address || '', [Validators.required]],
      'neighbourhood': [this.carrier.neighbourhood || '', [Validators.required]],
      'zipCode': [this.carrier.zipCode || '', [Validators.required]],
      'rg': [this.carrier.rg || ''],
      'cnpj': [this.carrier.cnpj || ''],
      'phone': [this.carrier.phone || '', [Validators.required]],
      'fax': [this.carrier.fax || '', [Validators.required]],
      'email': [this.carrier.email || '', [Validators.required]],
      'countryId': [this.carrier.country ? this.carrier.country.id : '', [Validators.required]],
      'cityId': [this.carrier.city ? this.carrier.city.id : '', [Validators.required]],
      'ufId': [this.carrier.uf ? this.carrier.uf.id : '', [Validators.required]], */
      'personId': [this.carrier.person ? this.carrier.person.id || '' : '', [Validators.required]],
    });

   /*  this.ufSubscription = this.form.get('ufId').valueChanges.subscribe(() => {
      let uf = this.form.get('ufId').value;
      // TODO: carregar cidades POR UF
      this.cityService.listByUf(uf).then((citys: Array<City>) => {
        this.citys = citys;
      });
    }); */
  }

  save() {
    this.submitted = true;

    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
    });

    if (!this.form.valid) {
      return;
    }

    /* this.carrier.code = this.form.value.code;
    this.carrier.personType = this.form.value.personType;
    this.carrier.companyName = this.form.value.companyName;
    this.carrier.contactName = this.form.value.contactName;
    this.carrier.tradingName = this.form.value.tradingName;
    this.carrier.address = this.form.value.address;
    this.carrier.neighbourhood = this.form.value.neighbourhood;
    this.carrier.zipCode = this.form.value.zipCode.replace(/\D/g, '');
    this.carrier.rg = this.form.value.rg.replace(/\D/g, '');
    this.carrier.cnpj = this.form.value.cnpj.replace(/\D/g, '');
    this.carrier.phone = this.form.value.phone.replace(/\D/g, '');
    this.carrier.fax = this.form.value.fax.replace(/\D/g, '');
    this.carrier.email = this.form.value.email;
    this.carrier.country = new Country();
    this.carrier.country.id = this.form.value.countryId;
    this.carrier.city = new City();
    this.carrier.city.id = this.form.value.cityId;
    this.carrier.uf = new Uf();
    this.carrier.uf.id = this.form.value.ufId; */
    this.carrier.person = new Person();
    this.carrier.person.id = this.form.value.personId;
    this.carrierService.save(this.carrier).then((carrier) => {
      Notification.success('Transportadora salva com sucesso!');
      this.router.navigate(['/carrier']);
    }).catch(() => this.loading = false);
  }

 /*  selectPerson(person: Person) {
    alert(person.name);
  } */

}
