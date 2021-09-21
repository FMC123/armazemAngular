import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs/Rx';

import { ErrorHandler } from '../../shared/errors/error-handler';
import { Logger } from '../../shared/logger/logger';
import { ModalManager } from '../../shared/modals/modal-manager';
import { Notification } from '../../shared/notification';
import { Page } from '../../shared/page/page';
import { Transportation } from '../transportation';
import { TransportationFilter } from '../transportation-filter';
import { TransportationStatus } from '../transportation-status';
import { TransportationService } from '../transportation.service';
import { BalanceService } from 'app/balance/balance.service';
import {TransportationType} from "../transportation-type";

@Component({
	selector: 'app-transportation-list-closed',
	templateUrl: './transportation-list-closed.component.html'
})
export class TransportationListClosedComponent implements OnInit, OnDestroy {
	loading: boolean;
	error: boolean;
	deleteConfirm: ModalManager = new ModalManager();
	reopenConfirm: ModalManager = new ModalManager();
	filter: TransportationFilter = new TransportationFilter();

	page: Page<Transportation> = new Page<Transportation>();
	breadcrumb = [];

	constructor(
		private transportationService: TransportationService,
		private errorHandler: ErrorHandler,
		private logger: Logger,
		private route: ActivatedRoute,
		private router: Router,
		private balanceService: BalanceService,
	) {}

	ngOnInit() {
		Notification.clearErrors();
		this.loadList();
		this.page.changeQuery.subscribe(() => {
			this.loadList();
		});
		this.buildBreadcrumb();
	}

	ngOnDestroy() {
		this.page.changeQuery.unsubscribe();
	}

	buildBreadcrumb() {
		let output = [];

		output.push(['Início', '']);

		let mode = this.route.snapshot.queryParams['mode'];
		if (mode) {
			if (mode === 'lobby') {
				output.push(['Portaria', '/lobby']);
			} else {
				output.push(['Balança', '/balance']);
			}
		}

		output.push(['Movimentações já finalizadas', null]);

		this.breadcrumb = output;
	}

	filterList(filter: TransportationFilter) {
		this.filter = filter;
		this.loadList();
	}

	loadList(skipLoading = false) {
		this.filter.status = TransportationStatus.FECHADO.code;

		this.error = false;

		if (!skipLoading) {
			this.loading = true;
		}

		this.transportationService
			.listPaged(this.filter, this.page)
			.then(() => {
				this.loading = false;
			})
			.catch(error => this.handleError(error));
	}

	delete(id: string | number) {
		this.transportationService
			.delete(id)
			.then(() => {
				Notification.success('Transporte excluído com sucesso!');
				this.loadList();
			})
			.catch(error => this.handleError(error));
	}

	onEditClick(event: Event, id: string) {
		event.preventDefault();
	}

	onDeleteClick(event: Event, id: string) {
		event.preventDefault();
	}

	onReopenClick(event: Event, id: string) {
		event.preventDefault();
		event.stopPropagation();
		this.reopenConfirm.open(id);
	}

	reopen(id: string) {
		this.transportationService
			.reopen(id)
			.then(transp => {
				Notification.success('Transporte reaberto com sucesso!');
				if(transp.type === TransportationType.IN.code)
				  this.router.navigate(['/transportation', 'in', id, 'edit']);
        if(transp.type === TransportationType.OUT.code)
          this.router.navigate(['/transportation', 'out', id, 'edit']);
			})
			.catch(error => this.handleError(error));
	}

	handleError(error) {
		this.error = true;
		this.loading = false;
		return this.errorHandler.fromServer(error);
	}

	downloadWeightTicket(transportationId) {
		this.loading = true;
		return this.balanceService.downloadWeightTicketGrouped(transportationId).then(() => {
		  this.loading = false;
		}).catch(error => this.handleError(error));
	  }

	  /**
	   * Ticket de peso de saída
	   */
	  downloadWeightTicketOut(transportationId) {
		this.loading = true;
		return this.balanceService.downloadWeightTicketGroupedOut(transportationId).then(() => {
		  this.loading = false;
		}).catch(error => this.handleError(error));
	  }
}
