import { Component, OnInit,Input } from '@angular/core';
import {
	FormBuilder,
	FormGroup,
	Validators
} from '@angular/forms';
import { ModalManager } from '../../shared/modals/modal-manager';
import { Notification } from '../../shared/notification';
import { FiscalNote } from '../../fiscal-note/fiscal-note';
import { Masks } from '../../shared/forms/masks/masks';
import { BatchOperation } from 'app/batch-operation/batch-operation';
import { ErrorHandler } from '../../shared/errors/error-handler';
import {TransportationFiscalNoteService} from '../transportation-fiscal-note/transportation-fiscal-note.service';
import {NumberHelper} from "../../shared/globalization";
import {PackStockMovement} from "../../pack-stock/pack-stock-movement";
import {PackType} from "../../pack-type/pack-type";
import {PackStockMovementGroup} from "../../pack-stock/pack-stock-movement-group";
import {PackTypeService} from "../../pack-type/pack-type.service";

@Component({
	selector: 'app-pack-stock-movement-list-transportation',
	templateUrl: 'pack-stock-movement-list-transportation.component.html'
})
export class PackStockMovementListTransportationComponent implements OnInit {
	closeConfirm = new ModalManager();
    loading: boolean;
    error: boolean;
	form: FormGroup;
  packStockMovement: PackStockMovement;
  @Input() fiscalNote: FiscalNote;
  decimalMask = Masks.decimalMask;
  integerMask = Masks.integerMask;
  packType: PackType;
  quantityVariation: number;
  unitValue: number;
	idPackStockMovementTemp: number;
  packTypes: Array<PackType>;

	constructor(
		private formBuilder: FormBuilder,
        private service: TransportationFiscalNoteService,
        private packTypeService: PackTypeService,
        private errorHandler: ErrorHandler,
	) {}

	ngOnInit() {
		Notification.clearErrors();
    this.idPackStockMovementTemp = 0;
		this.buildForm();
    this.packTypeService.list().then(packTypes => {
      this.packTypes = packTypes.filter(pt => pt.trackStock);
    });
  }

	buildForm() {
		this.form = this.formBuilder.group({
      packTypeId: [
				this.packStockMovement && this.packStockMovement.packType ? this.packStockMovement.packType.id || '' : '',[Validators.required]
			],
      quantityVariation: [this.packStockMovement ? this.packStockMovement.quantityVariation || '' : '', [Validators.required]
      ],
      unitValue: [this.packStockMovement ? this.packStockMovement.unitValueString || '' : '',[Validators.required]
			]
		});
  }

  edit(packStockMovement:PackStockMovement) {
        this.packStockMovement = packStockMovement;
        if(this.packStockMovement.id)
        {
          this.packStockMovement.tempId = this.packStockMovement.id;
        }
        this.buildForm();
	}

	beforeRemove(packStockMovement: PackStockMovement) {
		this.packStockMovement = packStockMovement;
		this.closeConfirm.open(null);
	}

	remove() {
	  if(this.packStockMovement.id)
    {
      this.fiscalNote.packStockMovementGroup.movements = this.fiscalNote.packStockMovementGroup.movements.filter(p => p.id !== this.packStockMovement.id);
    }else if(this.packStockMovement.tempId){
      this.fiscalNote.packStockMovementGroup.movements = this.fiscalNote.packStockMovementGroup.movements.filter(p => p.tempId !== this.packStockMovement.tempId);
    }
    this.fillPackStockMovementEmpty()
    this.buildForm();
    this.loading = false;
	}

	save() {
		Object.keys(this.form.controls).forEach(key => {
			this.form.controls[key].markAsDirty();
		});

		if (!this.form.valid) {
			return;
    }

    this.loading = true;
    if (!this.packStockMovement) {
            this.fillPackStockMovementEmpty()
            this.packStockMovement.quantityVariation = 0.00;
            this.packStockMovement.unitValue = 0.00;
            this.packStockMovement.packType = null;
    }
    let packType = this.packTypes.find(pt => pt.id === this.form.value.packTypeId);
    this.packStockMovement.packType = packType;
    this.packStockMovement.quantityVariation = this.form.get('quantityVariation').value;
    this.packStockMovement.unitValue = NumberHelper.fromPTBR(this.form.get('unitValue').value);

    if(!this.packStockMovement.tempId) {
      this.idPackStockMovementTemp++;
      this.packStockMovement.tempId = this.idPackStockMovementTemp+"";
      this.fiscalNote.packStockMovementGroup.movements.push(this.packStockMovement);
      this.loading = false;
      this.fillPackStockMovementEmpty()
      this.buildForm();
    }
    else {
      let newPackStockMovements = [];
      this.fiscalNote.packStockMovementGroup.movements.forEach(f => {
        newPackStockMovements.push(f.tempId !== this.packStockMovement.tempId ? f : this.packStockMovement)
      })
      this.fiscalNote.packStockMovementGroup.movements = newPackStockMovements;
      this.loading = false;
      this.fillPackStockMovementEmpty()
      this.buildForm();
    }

    //Calcula o total da notafiscal
    this.fiscalNote.totalPrice = 0;
    this.fiscalNote.packStockMovementGroup.movements.forEach(p => {
      this.fiscalNote.totalPrice = this.fiscalNote.totalPrice + p.totalValue;
    })
  }

    handleError(error) {
        this.error = true;
        this.loading = false;
        return this.errorHandler.fromServer(error);
      }

	fillPackStockMovementEmpty() {
		this.packStockMovement = new PackStockMovement(
			undefined,
      undefined,
			0,
			0,
      undefined
		);
	}
}
