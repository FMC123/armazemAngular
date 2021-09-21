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
	selector: 'app-fiscal-note-list-form',
	templateUrl: 'fiscal_note_list_form.component.html'
})
export class FiscalNoteListFormComponent implements OnInit {
	closeConfirm = new ModalManager();
    loading: boolean;
    error: boolean;
	form: FormGroup;
	fiscalNote: FiscalNote;
	fiscalNotes: FiscalNote[] = [];
	dateMask = Masks.dateMask;
	integerMask = Masks.integerMask;
	decimalMask = Masks.decimalMask;
	@Input() batchOperation: BatchOperation;
	@Input() dataInicial: String;
	@Input() dataFinal: String;

	constructor(
		private formBuilder: FormBuilder,
        private service: TransportationFiscalNoteService,
        private errorHandler: ErrorHandler,
	) {}

	ngOnInit() {
		Notification.clearErrors();
		this.service
			.listFiscalNoteByBatchOperation(this.batchOperation.id)
			.then(data => {
				this.fiscalNotes = []
				data.forEach(fiscal => {
					this.fiscalNotes.push(fiscal)
				})
			});
		this.buildForm();
	}

	buildForm() {
		this.form = this.formBuilder.group({
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
				this.fiscalNote ? this.fiscalNote.totalPrice || '' : '',
				[Validators.required]
			]
		});
  }

  edit(fiscalNote:FiscalNote) {
    this.fiscalNote = fiscalNote;
    this.buildForm();
	  this.setFiscalNoteValueInput();
	}

	beforeRemove(fiscalNote: FiscalNote) {
		this.fiscalNote = fiscalNote;
		this.closeConfirm.open(null);
	}

	remove() {
		this.loading = true;
		this.service.remove(this.fiscalNote)
		.then( () => {
			this.fiscalNotes = this.fiscalNotes.filter(f => f.id !== this.fiscalNote.id);
			this.fillFiscalNoteEmpty()
			this.buildForm();
			this.loading = false;
		})
		.catch(error => this.handleError(error))
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
        this.fiscalNote.code = this.form.get('fiscalNoteNumber').value;
        this.fiscalNote.totalPrice = + NumberHelper.fromPTBR(this.form.get('fiscalNoteValue').value);
        this.fiscalNote.emissionDateString = this.form.get('fiscalNoteDate').value;
        this.fiscalNote.batchOperation = this.batchOperation;
		this.fiscalNote.serie = this.form.get('fiscalNoteSerie').value;
        if(!this.fiscalNote.id) {
            this.service.insert(this.fiscalNote)
            .then(fiscal => {
                this.fiscalNotes.push(fiscal);
                this.loading = false;
                this.fillFiscalNoteEmpty()
                this.buildForm();
            })
            .catch(error => this.handleError(error))
        }
        else {
            this.service.update(this.fiscalNote)
            .then(fiscalNote => {
                let newFiscalNotes = [];
                this.fiscalNotes.forEach(f => {
                    newFiscalNotes.push(f.id !== this.fiscalNote.id ? f : fiscalNote)
				})
                this.fiscalNotes = newFiscalNotes;
                this.loading = false;
                this.fillFiscalNoteEmpty()
                this.buildForm();
            })
            .catch(error => this.handleError(error))
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

  setFiscalNoteValueInput() {
	  this.form.get('fiscalNoteValue').setValue(NumberHelper.toPTBR(this.form.value.fiscalNoteValue));
  }
}
