import { Component, OnInit,Input } from '@angular/core';
import {
	FormBuilder,
	FormGroup,
	Validators
} from '@angular/forms';
import { ModalManager } from '../../../shared/modals/modal-manager';
import { Notification } from '../../../shared/notification';
import { FiscalNote } from '../../../fiscal-note/fiscal-note';
import { Masks } from '../../../shared/forms/masks/masks';
import { BatchOperation } from 'app/batch-operation/batch-operation';
import { ErrorHandler } from '../../../shared/errors/error-handler';
import {TransportationFiscalNoteService} from '../../../transportation/transportation-fiscal-note/transportation-fiscal-note.service';
import {NumberHelper} from "../../../shared/globalization";
import {PackStockMovement} from "../../../pack-stock/pack-stock-movement";
import {PackType} from "../../../pack-type/pack-type";
import {PackStockMovementGroup} from "../../../pack-stock/pack-stock-movement-group";
import {PackTypeService} from "../../../pack-type/pack-type.service";
import {PackStockService} from "../../../pack-stock/pack-stock.service";

@Component({
	selector: 'app-pack-stock-movement-list-form',
	templateUrl: 'pack-stock-movement-list-form.component.html'
})
export class PackStockMovementListFormComponent implements OnInit {
  private _fiscalNotes: Array<FiscalNote> = [];
  packStockMovementList: Array<PackStockMovement> = [];
  @Input() set fiscalNotes(value: Array<FiscalNote>) {
    this.fillPackStockMovementGroupList(value);
  }

  get fiscalNotes() {
    return this._fiscalNotes;
  }

  constructor(
    private packStockService: PackStockService
	) {}

	ngOnInit() {}

	fillPackStockMovementGroupList(value: Array<FiscalNote>){
    this.packStockMovementList = [];
    value.forEach(fiscalNote =>{
      this.packStockService.findByFiscalNote(fiscalNote.id).then(packStock => {
        this.packStockMovementList = this.packStockMovementList.concat(packStock.movements);
      });
    });

  }
}
