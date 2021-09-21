import { Masks } from '../../../shared/forms/masks/masks';
import { Person } from '../../../person/person';
import { PersonModalService } from '../../../person/person-modal/person-modal.service';
import { TypeAddress } from '../../type-address';
import { Subscription } from 'rxjs/Rx';
import { UfService } from '../../../uf/uf.service';
import { CityService } from '../../../city/city.service';
import { CountryService } from '../../../country/country.service';
import { Uf } from '../../../uf/uf';
import { City } from '../../../city/city';
import { Country } from '../../../country/country';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Notification } from '../../../shared/notification/notification';
import { Address } from '../../address';
import { AddressService } from '../../address.service';
const uuid = require('uuid/v4');


@Component({
  selector: 'app-address-modal-form',
  templateUrl: './address-modal-form.component.html'
})
export class AddressModalFormComponent implements OnInit, OnDestroy {
  @Input() id: string;
  @Input() person: Person;
  address: Address;
  form: FormGroup;
  loading: boolean = false;
  ufs:  Array<Uf>;
  countrys:  Array<Country>;
  citys:  Array<City>;
  typeaddress: Array<TypeAddress>;
  submitted: boolean = false;
  ufSubscription: Subscription;
  zipCodeMask = Masks.postalCodeMask;
  integerMask = Masks.integerMask;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private addressService: AddressService,
    private countryService: CountryService,
    private cityService: CityService,
    private ufService: UfService,
    private personModalService: PersonModalService,
  ) { }

  get typesAddress(){
    return [
      TypeAddress.COMMERCIAL,
      TypeAddress.CORRESPONDENCE
    ]
  }

  ngOnInit() {
    Notification.clearErrors();
    if (this.id) {
      this.address = this.personModalService.findAddress(this.id);
    }else {
      this.address = new Address();
      this.address.tempId = uuid();
    }
    this.countryService.list().then((countrys: Array<Country>) => {
      this.countrys = countrys;
    });
    this.ufService.list().then((ufs: Array<Uf>) => {
        this.ufs = ufs;
    });
   /*  this.cityService.list().then((citys: Array<City>) => {
        this.citys = citys;
    }); */

    this.buildForm();
  }

  ngOnDestroy() {
    if (this.ufSubscription && !this.ufSubscription.closed) {
      this.ufSubscription.unsubscribe();
    }
  }

  buildForm() {
    this.form = this.formBuilder.group({
          'publicPlace': [this.address.publicPlace || '', [Validators.required]],
          'number': [this.address.number || '', [Validators.required]],
          'complement': [this.address.complement || '', []],
          'neighbourhood': [this.address.neighbourhood || '', [Validators.required]],
          'zipCode': [this.address.zipCode || '', [Validators.required]],
          'typeAddress': [this.address.typeAddress ? this.address.typeAddress : '', Validators.required],
          'main': [this.address.main || false, [ ]],
          'countryId': [this.address.country ? this.address.country : '', [Validators.required]],
          'cityId': [this.address.city ? this.address.city : '', [Validators.required]],
          'ufId': [this.address.uf ? this.address.uf : '', [Validators.required]],

    });

    this.ufSubscription = this.form.get('ufId').valueChanges.subscribe(() => {
      this.loadCity();
    });
  }

  loadCity() {
    let uf = this.form.get('ufId').value;

    if (!uf) {
      this.citys = [];
      return;
    }

    this.cityService.listByUf(uf.id).then((citys: Array<City>) => {
      this.citys = citys;
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
        this.address.publicPlace = this.form.value.publicPlace;
        this.address.number = this.form.value.number;
        this.address.complement = this.form.value.complement;
        this.address.zipCode = this.form.value.zipCode.replace(/\D/g, '');
        this.address.neighbourhood = this.form.value.neighbourhood;
        this.address.country = new Country();
        this.address.country = this.form.value.countryId;
        this.address.city = new City();
        this.address.city = this.form.value.cityId;
        this.address.uf = new Uf();
        this.address.uf = this.form.value.ufId;
        this.address.typeAddress = this.form.value.typeAddress ? this.form.value.typeAddress.code : '';
        this.address.main = this.form.value.main;
        this.personModalService.saveAddress(this.address);
  }

  returnFormPerson() {
    this.personModalService.returnForm();
  }


}
