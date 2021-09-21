import { BalanceTransportationInService } from '../balance-transportation-in.service';

import {Component, Input, OnInit} from '@angular/core';
import {ProductTransportationType} from "../../../transportation/product-transportation-type";
import {ParameterService} from "../../../parameter/parameter.service";

@Component({
	selector: 'app-balance-transportation-fiscal-note-list',
	templateUrl: 'balance-transportation-fiscal-note-list.component.html'
})
export class BalanceTransportationFiscalNoteListComponent implements OnInit {
	opened = true;
  packing = false;
  @Input() balanceTransportationService: any;

  nameWithCodeParameter: boolean;

	constructor(private parameters: ParameterService) {}

	ngOnInit() {
	  this.nameWithCodeParameter = this.parameters.clientCodeBeforeName();
  }

	get fiscalNotes() {
    let transportation = this.balanceTransportationService.transportation;
    this.packing = transportation.productType == ProductTransportationType.PACKING.code;
		return this.balanceTransportationService.transportation.fiscalNotes;
	}

	changeSelected(event: any, fiscalNote) {
		if(!(fiscalNote.batchOperation && fiscalNote.batchOperation.id)){
			fiscalNote.selected = event.currentTarget.checked;
		} else {
			event.currentTarget.checked = false;
		}
	}

}
