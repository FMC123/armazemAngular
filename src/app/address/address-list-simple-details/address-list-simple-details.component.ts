import { Address } from '../address';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-address-list-simple-details',
  templateUrl: './address-list-simple-details.component.html'
})
export class AddressListSimpleDetailsComponent implements OnInit {
  @Input() public addresses: Array<Address> = [];

  constructor() { }

  ngOnInit() { }
}
