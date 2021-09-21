import { Address } from '../../address';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-address-modal-list-simple-details',
  templateUrl: './address-modal-list-simple-details.component.html'
})
export class AddressModalListSimpleDetailsComponent implements OnInit {
  @Input() public addresses: Array<Address> = [];

  constructor() { }

  ngOnInit() { }
}
