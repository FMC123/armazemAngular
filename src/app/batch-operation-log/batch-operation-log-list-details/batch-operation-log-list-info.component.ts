import { BatchOperationType } from '../../batch-operation/batch-operation-type';
import { BatchOperationStatus } from '../../batch-operation/batch-operation-status';
import { ModalManager } from '../../shared/modals/modal-manager';
import { BatchOperationLog } from '../batch-operation-log';
import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'app-batch-operation-log-list-info',
	templateUrl: './batch-operation-log-list-info.component.html'
})
export class BatchOperationLogListInfoComponent implements OnInit {
	@Input() batchOperationLog: BatchOperationLog;

	logModal: ModalManager = new ModalManager();

	leftColumn: Array<any>;
	rightColumn: Array<any>;

	ngOnInit() {
		if (!this.batchOperationLog) {
			return;
		}

		this.leftColumn = [
			[
				'Código',
				this.batchOperationLog.batchOperationCode
					? this.batchOperationLog.batchOperationCode
					: ''
			],
			[
				'Tipo de operação',
				this.batchOperationLog.operationType
					? this.batchOperationLog.operationType.description
					: ''
			],
			[
				'Status',
				this.batchOperationLog.status
					? new BatchOperationStatus(this.batchOperationLog.status).name
					: ''
			],
			[
				'Tipo ',
				this.batchOperationLog.type
					? new BatchOperationType(this.batchOperationLog.type).name
					: ''
			],
			[
				'Auditor',
				this.batchOperationLog.auditor
					? this.batchOperationLog.auditor.name
					: ''
			],
			[
				'Quantidade de sacas',
				this.batchOperationLog.sacksQuantity
					? this.batchOperationLog.sacksQuantity
					: ''
			],
			[
				'Quantidade de sacas impróprias',
				this.batchOperationLog.improper ? this.batchOperationLog.improper : ''
			],
			[
				'Cliente',
				this.batchOperationLog.owner && this.batchOperationLog.owner.person
					? `${this.batchOperationLog.owner.person.name}`
					: ''
			],
			[
				'Quantidade de embalagem normal',
				this.batchOperationLog.normal ? this.batchOperationLog.normal : ''
			],
			[
				'Quantidade de embalagem de plástico',
				this.batchOperationLog.plastic ? this.batchOperationLog.plastic : ''
			],
			[
				'Quantidade de embalagem impróprias',
				this.batchOperationLog.improper ? this.batchOperationLog.improper : ''
			],
			['Notas', this.batchOperationLog.note ? this.batchOperationLog.note : ''],
			[
				'Data de criação',
				this.batchOperationLog.createdDate
					? this.batchOperationLog.createdDateString
					: ''
			]
		];

		this.rightColumn = [
			[
				'Peso bruto',
				this.batchOperationLog.grossWeight
					? this.batchOperationLog.grossWeightString
					: ''
			],
			[
				'Peso bruto informado manualmente',
				this.batchOperationLog.grossWeightTyped ? 'Sim' : 'Não'
			],
			[
				'Peso bruto pesado em',
				this.batchOperationLog.grossWeightScale
					? this.batchOperationLog.grossWeightScale.description || ''
					: ''
			],
			[
				'Peso bruto pesado por',
				this.batchOperationLog.grossWeighedBy
					? this.batchOperationLog.grossWeighedBy.login || ''
					: ''
			],
			[
				'Peso da tara',
				this.batchOperationLog.tareWeight
					? this.batchOperationLog.tareWeightString
					: ''
			],
			[
				'Peso bruto informado manualmente',
				this.batchOperationLog.tareWeightTyped ? 'Sim' : 'Não'
			],
			[
				'Peso da tara pesado em',
				this.batchOperationLog.tareWeightScale
					? this.batchOperationLog.tareWeightScale.description || ''
					: ''
			],
			[
				'Peso da tara pesado por',
				this.batchOperationLog.taraWeighedBy
					? this.batchOperationLog.taraWeighedBy.login || ''
					: ''
			],
			['Peso líquido', this.batchOperationLog.netWeightCalcString],
			[
				'Peso do Produto',
				this.batchOperationLog.productWeight
					? this.batchOperationLog.productWeightString
					: ''
			],
			[
				'Peso da embalagem',
				this.batchOperationLog.packWeight
					? this.batchOperationLog.packWeightString
					: ''
			]
		];
	}
}
