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

@Component({
	selector: 'app-fiscal-note-list-ownership-transfer-form',
	templateUrl: 'fiscal-note-list-ownership-transfer-form.component.html'
})
export class FiscalNoteListOwnershipTransferFormComponent implements OnInit {
	closeConfirm = new ModalManager();
    loading: boolean;
    error: boolean;
	form: FormGroup;
	fiscalNote: FiscalNote;
  @Input() fiscalNotes: FiscalNote[];
	dateMask = Masks.dateMask;
  decimalMask = Masks.decimalMask;
	@Input() dataInicial: String;
	@Input() dataFinal: String;
	idFiscalNoteTemp: number;

	constructor(
		private formBuilder: FormBuilder,
        private service: TransportationFiscalNoteService,
        private errorHandler: ErrorHandler,
	) {}

	ngOnInit() {
		Notification.clearErrors();
    this.idFiscalNoteTemp = 0;
		this.buildForm();
	}

	buildForm() {
		this.form = this.formBuilder.group({
      fiscalNoteBarCode: [
        this.fiscalNote ? this.fiscalNote.barCode || '' : '',
        []
      ],
			fiscalNoteNumber: [
				this.fiscalNote ? this.fiscalNote.code || '' : '',
				[Validators.required]
			],
			fiscalNoteSerie: [this.fiscalNote ? this.fiscalNote.serie || '' : '', []],
			fiscalNoteDate: [
				this.fiscalNote ? this.fiscalNote.emissionDateString || '' : '',
				[Validators.required]
			],
			fiscalNoteValue: [
				this.fiscalNote ? this.fiscalNote.totalPriceString || '' : '',
				[Validators.required]
			]
		});
    }

    edit(fiscalNote:FiscalNote) {
        this.fiscalNote = fiscalNote;
        this.buildForm();
	}

	beforeRemove(fiscalNote: FiscalNote) {
		this.fiscalNote = fiscalNote;
		this.closeConfirm.open(null);
	}

	remove() {
    this.fiscalNotes = this.fiscalNotes.filter(f => f.id !== this.fiscalNote.id);
    this.fillFiscalNoteEmpty()
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
		if (!this.fiscalNote) {
            this.fillFiscalNoteEmpty()
            this.fiscalNote.grossWeight = 0.00;
            this.fiscalNote.netWeight = 0.00;
            this.fiscalNote.barCode = null;
            this.fiscalNote.baseValueForTax = 0.00;
            this.fiscalNote.taxIcmsPercent = 0.00;
            this.fiscalNote.unitPrice = 0.00;
		}
        this.fiscalNote.noteType = "TRANSPORTATION_OUT";
        this.fiscalNote.barCode = this.form.get('fiscalNoteBarCode').value;
        this.fiscalNote.code = this.form.get('fiscalNoteNumber').value;
        this.fiscalNote.totalPrice = NumberHelper.fromPTBR(this.form.get('fiscalNoteValue').value);
        this.fiscalNote.emissionDateString = this.form.get('fiscalNoteDate').value;
		    this.fiscalNote.serie = this.form.get('fiscalNoteSerie').value;

		    if(!this.fiscalNote.tempId) {
          this.idFiscalNoteTemp++;
          this.fiscalNote.tempId = this.idFiscalNoteTemp+"";
          this.fiscalNotes.push(this.fiscalNote);
          this.loading = false;
          this.fillFiscalNoteEmpty()
          this.buildForm();
        }
        else {
          let newFiscalNotes = [];
          this.fiscalNotes.forEach(f => {
            newFiscalNotes.push(f.tempId !== this.fiscalNote.tempId ? f : this.fiscalNote)
          })
          this.fiscalNotes = newFiscalNotes;
          this.loading = false;
          this.fillFiscalNoteEmpty()
          this.buildForm();
        }
    }

    handleError(error) {
        this.error = true;
        this.loading = false;
        return this.errorHandler.fromServer(error);
      }

	fillFiscalNoteEmpty() {
		this.fiscalNote = new FiscalNote(
			undefined,
			'',
			'',
			0,
			0,
			'',
			null,
			null,
			0,
			null,
			null,
			null,
			'',
			0,
			0,
			0,
			0,
			0,
			null,
			null,
			null,
			null,
			null,
			null,
			null,
			null
		);
	}
}
