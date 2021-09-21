import { EconomicGroup } from '../economic-group/economic-group';
import { CustomerContact } from '../customer-contact/customer-contact';
import { Address } from '../address/address';
import { Masks } from './../shared/forms/masks/masks';
import { PersonType } from './person-type';
import { Country } from '../country/country';
import { ServiceGroup } from '../service-group/service-group';
import { ServiceItem } from '../service-item/service-item';




export class Person {
  static fromListData(listData: Array<any>): Array<Person> {
    return listData.map(data => {
      return Person.fromData(data);
    });
  }

  tempId: string;

  static fromData(data: Person): Person {
    if (!data) {
      return new this();
    }
    let person = new this(
      data.id,
      data.personType,
      data.name,
      data.tradingName,
      data.rg,
      data.producerRegistration,
      data.document,
      data.stateRegistration,
      data.active,
      data.addresses,
      data.customerContacts,
      data.economicGroup,
    );
    return person;
  }

  get personTypeName() {
    return PersonType.fromData(this.personType).name;
  }

  get documentFormat() {
    if (!this.document) {
      return '';
    }

    if (
      this.document.length === 14 &&
      this.personType === PersonType.JURIDICAL.code
    ) {
      return this.document.replace(
        /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
        '$1.$2.$3/$4-$5'
      );
    } else if (
      this.document.length === 11 &&
      (this.personType === PersonType.PHYSICAL.code ||
        this.personType === PersonType.PRODUCER.code)
    ) {
      return this.document.replace(
        /^(\d{3})(\d{3})(\d{3})(\d{2})/,
        '$1.$2.$3-$4'
      );
    }

    return this.document;
  }

  get rgFormat() {
    if (
      this.rg &&
      (this.personType === PersonType.PHYSICAL.code ||
        this.personType === PersonType.PRODUCER.code)
    ) {
      return this.rg.replace(/^(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4');
    }
    return '';
  }

  constructor(
    public id?: string,
    public personType?: string,
    public name?: string,
    public tradingName?: string,
    public rg?: string,
    public producerRegistration?: string,
    public document?: string,
    public stateRegistration?: string,
    public active?: boolean,
    public addresses?: Array<Address>,
    public customerContacts?: Array<CustomerContact>,
    public economicGroup ?: EconomicGroup,
  ) {
    if (economicGroup) {
      this.economicGroup = EconomicGroup.fromData(economicGroup);
    }
    if (addresses) {
      this.addresses = Address.fromListData(<any>addresses);
    }

    if (customerContacts) {
      this.customerContacts = CustomerContact.fromListData(<any>customerContacts);
    }

  }
}
