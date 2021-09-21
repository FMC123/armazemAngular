import { ModalManager } from '../../shared/modals/modal-manager';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { Logger } from './../../shared/logger/logger';
import { ErrorHandler } from './../../shared/errors/error-handler';

import { Page } from './../../shared/page/page';

import { Position } from '../position';
import { PositionService } from '../position.service';
import { PositionLayer } from '../../position-layer/position-layer';
import { Search } from '../../shared/search/search';
import { Notification } from '../../shared/notification/notification';

@Component({
	selector: 'app-position-list',
	templateUrl: './position-list.component.html'
})
export class PositionListComponent implements OnInit, OnDestroy {
	@Input() positionLayer: PositionLayer;

	logModal: ModalManager = new ModalManager();
	loading: boolean;
	error: boolean;
	deleteConfirm: ModalManager = new ModalManager();
	page: Page<Position> = new Page<Position>();
	search: Search = new Search();

	constructor(
		private service: PositionService,
		private errorHandler: ErrorHandler,
		private logger: Logger
	) {}

	ngOnInit() {
		this.loadList();
		this.page.changeQuery.subscribe(() => {
			this.loadList();
		});
		this.search.subscribe(() => {
			this.loadList();
		});
	}

	loadList() {
		this.error = false;
		this.loading = true;
		return this.service
			.listPaged(
				this.positionLayer.warehouse.id,
				this.search.value,
				this.positionLayer.id,
				this.page
			)
			.then(() => {
				this.loading = false;
			})
			.catch(error => this.handleError(error));
	}

	activate(id: string) {
		this.loading = true;

		this.service
			.activate(id)
			.then(() => {
				Notification.success('Posição ativada com sucesso!');
				this.loadList();
			})
			.catch(error => this.handleError(error));
	}

	deactivate(id: string) {
		this.loading = true;

		this.service
			.deactivate(id)
			.then(() => {
				Notification.success('Posição desativada com sucesso!');
				this.loadList();
			})
			.catch(error => this.handleError(error));
	}

	delete(id: string | number) {
		this.service
			.delete(this.positionLayer.warehouse.id, id)
			.then(() => {
				Notification.success('Posição excluída com sucesso!');
				this.loadList();
			})
			.catch(error => this.handleError(error));
	}

	ngOnDestroy() {
		this.page.changeQuery.unsubscribe();
		this.search.destroy();
	}

	handleError(error) {
		this.error = true;
		this.loading = false;
		return this.errorHandler.fromServer(error);
	}
}
