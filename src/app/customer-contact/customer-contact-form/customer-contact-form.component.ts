import { Person } from '../../person/person';
import { PersonMemoryService } from '../../person/person-memory.service';
import { Masks } from './../../shared/forms/masks/masks';
import { CustomerContact } from '../customer-contact';
import { ErrorHandler } from '../../shared/errors/error-handler';
import { Notification } from './../../shared/notification/notification';
import { CustomerContactService } from '../customer-contact.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
const uuid = require('uuid/v4');

@Component({
  selector: 'app-customer-contact-form',
  templateUrl: './customer-contact-form.component.html'
})

export class CustomerContactFormComponent implements OnInit {
  @Input() id: string;
  @Input() person: Person;
  customerContact: CustomerContact;
  form: FormGroup;
  loading: boolean = false;
  phoneMask = Masks.phoneMask;
  integerMask = Masks.integerMask;
  submitted: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private customerContactService: CustomerContactService,
    private personMemoryService: PersonMemoryService,
    private errorHandler: ErrorHandler,
  ) { }

  get editing(){
    return !!this.customerContact && !!this.customerContact.id;
  }

  ngOnInit(): void {
    Notification.clearErrors();
    this.id = this.personMemoryService.customerContactId;
    this.person = this.personMemoryService.person;
    if (this.id) {
      this.customerContact = this.personMemoryService.findCustomerContact(this.id);
    }else {
      this.customerContact = new CustomerContact();
      this.customerContact.tempId = uuid();
    }
    this.buildForm();
  }



  buildForm() {
    if ( this.editing ) {
      this.form = this.formBuilder.group({
        'name': [this.customerContact.name || '', Validators.required],
        'phone': [this.customerContact.phone || '', [ Validators.required]],
        'extensionLine': [this.customerContact.extensionLine || '', ],
        'cellPhone': [this.customerContact.cellPhone || '', ],
        'fax': [this.customerContact.fax || '', ],
        'email': [this.customerContact.email || '', Validators.required],
        'main': [this.customerContact.main || false, Validators.required],
        'url': [this.customerContact.url || ''],
        'indSendReport': [this.customerContact.indSendReport || false, Validators.required],
        'indSendPackingTicketWeight': [this.customerContact.indSendPackingTicketWeight || false, Validators.required]
      });
    }else {
      this.form = this.formBuilder.group({
        'name': [this.customerContact.name || '', Validators.required],
        'phone': [this.customerContact.phone || '',[ Validators.required]],
        'extensionLine': [this.customerContact.extensionLine || '', ],
        'cellPhone': [this.customerContact.cellPhone || '', ],
        'fax': [this.customerContact.fax || '', ],
        'email': [this.customerContact.email || '', Validators.required],
        'main': [this.customerContact.main || false, Validators.required],
        'url': [this.customerContact.url || ''],
        'indSendReport': [this.customerContact.indSendReport || false, Validators.required],
        'indSendPackingTicketWeight': [this.customerContact.indSendPackingTicketWeight || false, Validators.required]
      });
    }
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
    this.customerContact.name = this.form.value.name;
    this.customerContact.phone = this.form.value.phone.replace(/\D/g, '');
    this.customerContact.extensionLine = this.form.value.extensionLine.replace(/\D/g, '');
    this.customerContact.cellPhone = this.form.value.cellPhone.replace(/\D/g, '');
    this.customerContact.fax = this.form.value.fax.replace(/\D/g, '');
    this.customerContact.email = this.form.value.email;
    this.customerContact.main = this.form.value.main;
    this.customerContact.url = this.form.value.url;
    this.customerContact.indSendReport = this.form.value.indSendReport;
    this.customerContact.indSendPackingTicketWeight = this.form.value.indSendPackingTicketWeight;
    this.personMemoryService.saveCustomerContact(this.customerContact);
    Notification.success('Contato adicionado com sucesso!');
    this.loading = false;
  }

  handleError(error) {
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }

  returnFormPerson() {
    this.personMemoryService.returnForm();
  }

}
