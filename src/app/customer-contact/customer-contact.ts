import { Person } from '../person/person';

export class CustomerContact {

  tempId: string;

static fromListData(listData: Array<CustomerContact>): Array<CustomerContact> {
    return listData.map((data) => {
      return CustomerContact.fromData(data);
    });
  }

static formatPhone(data: string): string {
    if (data.length > 12){
      return data.replace(/^(\d{2})(\d{2})(\d{5})(\d{4})/, '+$1($2) $3-$4');
    } else if (data.length > 11){
      return data.replace(/^(\d{2})(\d{2})(\d{4})(\d{4})/, '+$1($2) $3-$4');
    }else if (data.length > 10) {
      return data.replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else {
      return data.replace(/^(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
  }

static fromData(data: CustomerContact): CustomerContact {
    if (!data) { return new this(); }
    let CustomerContact = new this(
      data.id,
      data.name,
      data.phone,
      data.extensionLine,
      data.cellPhone,
      data.fax,
      data.email,
      data.main,
      data.url,
      data.indSendReport,
      data.indSendPackingTicketWeight,
      data.person
    );
    return CustomerContact;
  }

  constructor(public id?: string,
              public name?: string,
              public phone?: string,
              public extensionLine ?: string,
              public cellPhone?: string,
              public fax?: string,
              public email?: string,
              public main?: boolean,
              public url?: string,
              public indSendReport?: boolean,
              public indSendPackingTicketWeight?: boolean,
              public person?: Person) {}
}
