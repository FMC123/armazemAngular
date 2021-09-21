import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalManager } from '../../../shared/modals/modal-manager';
import { Notification } from '../../../shared/notification';
import { IndustrializationFiscalNote } from './industrialization-fiscal-note';
import { Masks } from '../../../shared/forms/masks/masks';
import { ErrorHandler } from '../../../shared/errors/error-handler';
import { WarehouseStakeholder } from 'app/warehouse-stakeholder/warehouse-stakeholder';
import { ServiceInstructionService } from 'app/service-instruction/service-instruction.service';

@Component({
	selector: 'app-industrialization-fiscal-note-list-form',
	templateUrl: 'industrialization_fiscal_note_form.component.html'
})
export class IndustrializationFiscalNoteListFormComponent implements OnInit {
	closeConfirm = new ModalManager();
	loading: boolean;
	error: boolean;
	form: FormGroup;
	industrializationFiscalNote: IndustrializationFiscalNote;
	industrializationFiscalNotes: IndustrializationFiscalNote[] = [];
	dateMask = Masks.dateMask;
	integerMask = Masks.integerMask;
	@Input() clienteStakeholder: WarehouseStakeholder;
	@Input() dataInicial: string;
	@Input() dataFinal: string;
	constructor(
		private formBuilder: FormBuilder,
		private errorHandler: ErrorHandler,
		private service: ServiceInstructionService
	) {
	}

	ngOnInit() {
		let initialDate = this.dataInicial.replace("/","-").replace("/","-");
		let finalDate = this.dataFinal.replace("/","-").replace("/","-");
		Notification.clearErrors();
		this.service
			.findByStakeholderAndDate(this.clienteStakeholder.id,initialDate,finalDate)
			.then(data => {
				this.industrializationFiscalNotes = []
				data.forEach(industrializationFiscal => {
					this.industrializationFiscalNotes.push(industrializationFiscal)
				})
			});
		this.buildForm();
	}

	buildForm() {
		this.form = this.formBuilder.group({
			fiscalNoteCode: [
				this.industrializationFiscalNote
					? this.industrializationFiscalNote.code || ''
					: '',
				[Validators.required]
			],
			fiscalNoteDate: [
				this.industrializationFiscalNote
					? this.industrializationFiscalNote.emissionDateString || ''
					: '',
				[Validators.required]
			],
			fiscalNoteValue: [
				this.industrializationFiscalNote
					? this.industrializationFiscalNote.totalPrice || ''
					: '',
				[Validators.required]
			]
		});
	}

	edit(industrializationFiscalNote: IndustrializationFiscalNote) {
		this.industrializationFiscalNote = industrializationFiscalNote;
		this.buildForm();
	}

	beforeRemove(industrializationFiscalNote: IndustrializationFiscalNote) {
		this.industrializationFiscalNote = industrializationFiscalNote;
		this.closeConfirm.open(null);
	}

	remove() {
		this.loading = true;
		this.service.deleteIndustrializationFiscalNote(this.industrializationFiscalNote.id)
		.then( () => {
			this.industrializationFiscalNotes = this.industrializationFiscalNotes.filter(f => f.id !== this.industrializationFiscalNote.id);
			this.fillIndustrializationFiscalNoteEmpty()
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
		if (!this.industrializationFiscalNote) {
			this.fillIndustrializationFiscalNoteEmpty();
		}
		this.industrializationFiscalNote.code = this.form.get(
			'fiscalNoteCode'
		).value;
		this.industrializationFiscalNote.totalPrice = +this.form.get(
			'fiscalNoteValue'
		).value;
		this.industrializationFiscalNote.emissionDateString = this.form.get(
			'fiscalNoteDate'
		).value;

		this.industrializationFiscalNote.clientStakeholder = this.clienteStakeholder;
		if (!this.industrializationFiscalNote.id) {
			this.service.insertIndustrializationFiscalNote(this.industrializationFiscalNote)
            .then( ind => {
                this.industrializationFiscalNotes.push(ind);
                this.loading = false;
                this.fillIndustrializationFiscalNoteEmpty()
                this.buildForm();
            })
            .catch(error => this.handleError(error))
		} else {
			this.service.updateIndustrializationFiscalNote(this.industrializationFiscalNote)
            .then(ind => {
                let newIndustrializationFiscalNote = [];
                this.industrializationFiscalNotes.forEach(f => {
                    newIndustrializationFiscalNote.push(f.id !== this.industrializationFiscalNote.id ? f : ind)
				})
                this.industrializationFiscalNotes = newIndustrializationFiscalNote;
                this.loading = false;
                this.fillIndustrializationFiscalNoteEmpty()
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

	fillIndustrializationFiscalNoteEmpty() {
		this.industrializationFiscalNote = new IndustrializationFiscalNote(null,'',undefined,null,0.0);
	}
}
