import {
	Component,
	EventEmitter,
	Input,
	OnDestroy,
	OnInit,
	Output
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Rx';

import { AuthService } from '../../auth/auth.service';
import { Position } from '../../position/position';
import { PositionService } from '../../position/position.service';
import { ErrorHandler } from '../../shared/errors/error-handler';
import { Masks } from '../../shared/forms/masks/masks';
import { CustomValidators } from '../../shared/forms/validators/custom-validators';
import { Notification } from '../../shared/notification';
import { Stack } from '../../stack/stack';
import { StackService } from '../../stack/stack.service';
import { StorageUnit } from '../storage-unit';
import { StorageUnitService } from '../storage-unit.service';
import { Tag } from 'app/tag/tag';
import { PositionType } from '../../position/position-type';
import { MapPosition } from '../../map/map-position/map-position';
import { PrintTagService } from '../../report/print-tag/print-tag.service';

@Component({
	selector: 'app-storage-unit-move-form-modal',
	templateUrl: 'storage-unit-move-form-modal.component.html'
})
export class StorageUnitMoveFormModalComponent implements OnInit, OnDestroy {
	@Input() storageUnitId: string;
	@Input() positions: Map<string, MapPosition>;
	@Output() close = new EventEmitter();

	storageUnit: StorageUnit;
	form: FormGroup;
	loading = false;
	stacks: Array<Stack>;
	integerMask = Masks.integerMask;

	stackSubscription: Subscription;

	constructor(
		private auth: AuthService,
		private service: StorageUnitService,
		private positionService: PositionService,
		private stackService: StackService,
		private formBuilder: FormBuilder,
		private errorHandler: ErrorHandler,
		private printTagService: PrintTagService
	) {}

	ngOnInit() {
		this.service.findWithBatches(this.storageUnitId).then(storageUnit => {
			this.storageUnit = storageUnit;
			this.buildForm();
		});
	}

	ngOnDestroy() {
		let subscriptions = [this.stackSubscription];

		subscriptions.forEach((subscription: Subscription) => {
			if (subscription && !subscription.closed) {
				subscription.unsubscribe();
			}
		});
	}

	buildForm() {
		this.loading = true;

		this.form = this.formBuilder.group({
			tagCode: [
				this.storageUnit.tag ? this.storageUnit.tag.tagCode || '' : '',
				[Validators.required]
			],
			positionId: [
				this.storageUnit.position ? this.storageUnit.position.id || '' : '',
				[Validators.required]
			],
			stackId: [
				this.storageUnit.stack ? this.storageUnit.stack.id || '' : '',
				[Validators.required]
			],
			stackHeight: [
				this.storageUnit.stackHeight || '1',
				[Validators.required, CustomValidators.minValidator(1)]
			]
		});

		this.stackSubscription = this.form
			.get('positionId')
			.valueChanges.subscribe(value => {
				this.refreshStacks(value);
			});

		let promises = [];

		if (this.storageUnit.position && this.storageUnit.position.id) {
			promises.push(this.refreshStacks(this.storageUnit.position.id));
		}

		return Promise.all(promises)
			.then(() => {
				this.loading = false;
			})
			.catch(error => this.handleError(error));
	}

	save() {
		Object.keys(this.form.controls).forEach(key => {
			this.form.controls[key].markAsDirty();
		});

		if (!this.form.valid) {
			return;
		}

		this.loading = true;

		this.storageUnit.tag = new Tag(null, this.form.value.tagCode);
		const positionType = this.storageUnit.position
			? this.storageUnit.position.type
			: null;
		this.storageUnit.position = new Position(this.form.value.positionId);
		this.storageUnit.position.type = positionType;
		this.storageUnit.stack = this.stacks.find(
			s => s.id === this.form.value.stackId
		);
		this.storageUnit.stackHeight = this.form.value.stackHeight;

		return this.service
			.move(this.storageUnit)
			.then(() => {
				Notification.clearErrors();
				Notification.success('Unidade de armazenamento salva com sucesso!');
				this.loading = false;
				(<any>jQuery)('.modal').modal('hide');
			})
			.catch(error => this.handleError(error));
	}

	get positionsAvailable() {
		if (!this.positions) {
			return [];
		}

		let filteredPositions = Array.from(this.positions.values());

		const uniqueByPositionCode = (elem, pos, arr) => {
			return arr.findIndex(e => e.positionCode === elem.positionCode) === pos;
		};

		filteredPositions = filteredPositions.filter(uniqueByPositionCode);
		filteredPositions = filteredPositions.filter(p => !!p);
		filteredPositions = filteredPositions.sort((a, b) => {
			if (!a.positionCode) {
				return -1;
			}

			if (!b.positionCode) {
				return 1;
			}

			return a.positionCode.localeCompare(b.positionCode);
		});

		let type = this.isSacaria ? PositionType.SACARIA : PositionType.ALA;

		return filteredPositions
			.filter(p => !p.hidden)
			.filter(p => p.type === type.code);
	}

	get isSacaria() {
		return (
			this.storageUnit &&
			this.storageUnit.position &&
			this.storageUnit.position.type === PositionType.SACARIA.code
		);
	}

	handleError(error) {
		this.loading = false;
		return this.errorHandler.fromServer(error);
	}

	private refreshStacks(positionId) {
		if (!positionId) {
			this.stacks = [];
			this.form.get('stackId').setValue('');
			return Promise.resolve();
		}

		return this.stackService.list(positionId).then(stacks => {
			this.stacks = stacks;

			const currentStackId = this.form.get('stackId').value;
			if (!currentStackId || !this.stacks.some(s => s.id === currentStackId)) {
				this.form.get('stackId').setValue(this.stacks[0].id);
			}
		});
	}

	printTag() {
		let tagCode;

		if (this.storageUnit.tag) {
			tagCode = this.storageUnit.tag.tagCode;
		}

		this.loading = true;

		let blob: Promise<Blob> = this.printTagService.findWithBatches(
			tagCode,
			this.storageUnit.batches
		);

		blob.then(b => {
			if (b.size === 0) {
				Notification.error(
					'Não foi encontrado informações para abrir o relatório!'
				);
			} else {
				let urlReport = window.URL.createObjectURL(b);
				window.open(urlReport);
			}
			this.loading = false;
		});
	}
}
