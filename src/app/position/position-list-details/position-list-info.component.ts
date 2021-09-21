import { ModalManager } from '../../shared/modals/modal-manager';

import { Component, OnInit, Input } from '@angular/core';
import { Position } from '../position';

@Component({
	selector: 'app-position-list-info',
	templateUrl: './position-list-info.component.html'
})
export class PositionListInfoComponent implements OnInit {
	@Input() position: Position;

	logModal: ModalManager = new ModalManager();

	leftColumn: Array<any>;
	rightColumn: Array<any>;

	ngOnInit() {
		this.leftColumn = [
			['Código', this.position.code],
			['Nome', this.position.name],
			['Coordenada X', this.position.xCoordinateString],
			['Coordenada Y', this.position.yCoordinateString],
			['Altura', this.position.heightString],
			['Largura', this.position.widthString],
			['Tipo', this.position.typeObject.name],
			['Ativa', this.position.activeAsString]
		];

		this.rightColumn = [
			['Ordenação', this.position.sortOrderString],
			['Rotação', this.position.rotationString],
			['Grupo', this.position.groupId],
			[
				'Nave',
				this.position.positionLayer
					? this.position.positionLayer.code +
						' - ' +
						this.position.positionLayer.name
					: ''
			],
			[
				'Armazém',
				this.position.warehouse
					? this.position.warehouse.code + ' - ' + this.position.warehouse.name
					: ''
			],
			[
				'Embegadora',
				this.position.embegadora &&
				this.position.embegadora.code &&
				this.position.embegadora.name
					? this.position.embegadora.code +
						' - ' +
						this.position.embegadora.name
					: ''
			]
		];
	}
}
