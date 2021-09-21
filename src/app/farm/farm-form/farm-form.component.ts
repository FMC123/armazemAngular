import { ErrorHandler } from '../../shared/errors/error-handler';
import { Person } from '../../person/person';
import { TypeAddress } from '../../address/type-address';
import { AddressService } from '../../address/address.service';
import { Address } from '../../address/address';
import { Subscription } from 'rxjs/Rx';
import { UfService } from '../../uf/uf.service';
import { CityService } from '../../city/city.service';
import { CountryService } from '../../country/country.service';
import { Uf } from '../../uf/uf';
import { City } from '../../city/city';
import { Country } from '../../country/country';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validator, Validators } from '@angular/forms';

import { Notification } from './../../shared/notification/notification';
import { Farm } from '../farm';
import { FarmService } from '../farm.service';


@Component({
  selector: 'farm-form',
  templateUrl: './farm-form.component.html'
})
export class FarmFormComponent implements OnInit, OnDestroy {

  farm: Farm;
  address: Address;
  form: FormGroup;
  loading: boolean = false;
  ufs: Array<Uf>;
  countrys: Array<Country>;
  citys: Array<City>;
  submitted: boolean = false;
  ufSubscription: Subscription;
  typeaddress: Array<TypeAddress>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private farmService: FarmService,
    private addressService: AddressService,
    private countryService: CountryService,
    private cityService: CityService,
    private ufService: UfService,
    private errorHandler: ErrorHandler,
  ) { }

  get typesAddress() {
    return [
      TypeAddress.COMMERCIAL,
      TypeAddress.CORRESPONDENCE
    ]
  }


  ngOnInit() {
    Notification.clearErrors();
    this.route.data.forEach((data: { farm: Farm }) => {
      this.farm = data.farm;
      if (this.farm.id) {
        this.farm.address = data.farm.address;
      } else {
        this.farm.address = new Address;
      }

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

  ngOnDestroy() {
    if (this.ufSubscription && !this.ufSubscription.closed) {
      this.ufSubscription.unsubscribe();
    }
  }

  buildForm() {
    this.form = this.formBuilder.group({
      'code': [this.farm.code || ''],
      'name': [this.farm.name || '', [Validators.required]],
      'stateRegistration': [this.farm.stateRegistration || '', [Validators.required]],
      'cnpj': [this.farm.cnpj || '', [Validators.required]],
      'latitude': [this.farm.latitude || ''],
      'longitude': [this.farm.longitude || ''],
      'farmSize': [this.farm.farmSize || '', [Validators.required]],
      'farmPercentage': [this.farm.farmPercentage || '100', [Validators.required]],
      'farmSizeUnit': [this.farm.farmSizeUnit || 'hm²', [Validators.required]],
      'publicPlace': [this.farm.address.publicPlace || '', [Validators.required]],
      'number': [this.farm.address.number || '', [Validators.required]],
      'complement': [this.farm.address.complement || '', [Validators.required], []],
      'neighbourhood': [this.farm.address.neighbourhood || '', [Validators.required]],
      'zipCode': [this.farm.address.zipCode || '', [Validators.required]],
      'countryId': [this.farm.address.country ? this.farm.address.country.id : '', [Validators.required]],
      'cityId': [this.farm.address.city ? this.farm.address.city.id : '', [Validators.required]],
      'ufId': [this.farm.address.uf ? this.farm.address.uf.id : '', [Validators.required]],
    });

    this.ufSubscription = this.form.get('ufId').valueChanges.subscribe(() => {
      let uf = this.form.get('ufId').value;
      this.cityService.listByUf(uf).then((citys: Array<City>) => {
        this.citys = citys;
      });
    });
  }

  save() {
    this.submitted = true;
    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
    });
    if (!this.form.valid) {
      return;
    }

    this.loading = true;
    this.farm.code = this.form.value.code;
    this.farm.name = this.form.value.name;
    this.farm.stateRegistration = this.form.value.stateRegistration;
    this.farm.cnpj = this.form.value.cnpj;
    this.farm.latitude = this.form.value.latitude;
    this.farm.longitude = this.form.value.longitude;
    this.farm.farmSize = this.form.value.farmSize;
    this.farm.farmPercentage = this.form.value.farmPercentage;
    this.farm.farmSizeUnit = this.form.value.farmSizeUnit;
    this.farm.address.publicPlace = this.form.value.publicPlace;
    this.farm.address.number = this.form.value.number;
    this.farm.address.complement = this.form.value.complement;
    this.farm.address.zipCode = this.form.value.zipCode;
    this.farm.address.neighbourhood = this.form.value.neighbourhood;
    this.farm.address.country = new Country();
    this.farm.address.country.id = this.form.value.countryId;
    this.farm.address.city = new City();
    this.farm.address.city.id = this.form.value.cityId;
    this.farm.address.uf = new Uf();
    this.farm.address.uf.id = this.form.value.ufId;

    this.farmService.save(this.farm).then((farm) => {
      Notification.success('Fazenda salva com sucesso!');
      this.router.navigate(['/farm']);
    }).catch((error) => this.handleError(error));
  }

  handleError(error) {
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }
}