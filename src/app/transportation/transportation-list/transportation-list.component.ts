import { ShippingAuthorization } from '../../shipping-authorization/shipping-authorization';
import { BatchOperationStatus } from '../../batch-operation/batch-operation-status';
import {
	Component,
	EventEmitter,
	Input,
	OnDestroy,
	OnInit,
	Output
} from '@angular/core';
import { Router } from '@angular/router';
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
import { TransportationFiscalNoteCertificateService } from '../transportation-fiscal-note/certificate/transportation-fiscal-note-certificate.service';
import {Driver} from "../../driver/driver";
import { DriverIncidentFormModalComponent} from "../../incident/driver-incident-modal/driver-incident-form-modal.component";
import {Incident} from "../../incident/incident";

@Component({
	selector: 'app-transportation-list',
	templateUrl: './transportation-list.component.html'
})
export class TransportationListComponent implements OnInit, OnDestroy {
	@Input() scale: string;
	@Input() status: string;
	@Input() type: string;
	@Input() mode: 'lobby' | 'balance' | 'unified';
	@Input() forShippingAuthorization: ShippingAuthorization;
	@Output() select = new EventEmitter<Transportation>(false);

	loading: boolean;
	error: boolean;
	deleteConfirm: ModalManager = new ModalManager();
	statusConfirm = new ModalManager();
	statusSelected = Array<string>();

	page: Page<Transportation> = new Page<Transportation>();
	refresherSubscription: Subscription;

	statuses = TransportationStatus.list().filter(
		status => !status.equals(TransportationStatus.FECHADO)
	);

	driverIncidentFormModal = new ModalManager();
	driver: Driver;
	titleModel: string;

	constructor(
		private transportationService: TransportationService,
		private errorHandler: ErrorHandler,
		private logger: Logger,
		private router: Router,
    private certificateService: TransportationFiscalNoteCertificateService
	) { }

	ngOnInit() {
		Notification.clearErrors();

		// inicialmente todos checados
		this.checkAllStatus();
		this.loadList();
		this.page.changeQuery.subscribe(() => {
			this.loadList();
		});
		this.setupAutoRefresher();
	}

	checkAllStatus() {
		this.statuses.forEach(status => {
			this.statusSelected.push(status.code)
		});
	}

	ngOnDestroy() {
		if (this.refresherSubscription && !this.refresherSubscription.closed) {
			this.refresherSubscription.unsubscribe();
		}

		this.refresherSubscription = null;

		this.page.changeQuery.unsubscribe();
	}

	setupAutoRefresher() {
		this.refresherSubscription = Observable.timer(10000, 10000).subscribe(
			() => {
				this.loadList(true, true);
			}
		);
	}

	loadList(skipLoading = false, keepOpeneds = false) {
		this.error = false;

		if (!skipLoading) {
			this.loading = true;
		}

		const filter = new TransportationFilter();
		filter.status = this.status;
		filter.statusList = this.statusSelected;

		if (this.type) {
			filter.type = this.type;
		}

		this.transportationService
			.listPaged(filter, this.page, keepOpeneds)
			.then(() => {
				this.filterForShippingAuthorization();

				this.loading = false;
			})
			.catch(error => this.handleError(error));
	}

	delete(id: string | number) {
		this.transportationService
			.delete(id)
			.then(() => {
				Notification.success('Movimentação excluída com sucesso!');
				this.loadList();
			})
			.catch(error => this.handleError(error));
	}

	handleError(error) {
		this.error = true;
		this.loading = false;
		return this.errorHandler.fromServer(error);
	}

	confirmUpdateStatus(data: {
		transportation: Transportation;
		status: TransportationStatus;
	}) {
		this.statusConfirm.open(data);
	}

	updateStatus(data: {
		transportation: Transportation;
		status: TransportationStatus;
	}) {
		this.transportationService
			.updateStatus(data.transportation, data.status)
			.then(() => {
				this.loadList();
				this.loading = false;
			})
			.catch(error => this.handleError(error));
	}

	private filterForShippingAuthorization() {
		if (!this.forShippingAuthorization) {
			return;
		}

		if (!this.page || !this.page.data) {
			return;
		}

		const hasBatchOperationOutAndNotClosed = d =>
			d.batchOperationOut &&
			d.batchOperationOut.status !== BatchOperationStatus.CLOSED.code;
		const hasNotShippingAuthorizationOrIsCurrent = d =>
			!d.batchOperationOut.shippingAuthorization ||
			!d.batchOperationOut.shippingAuthorization.id ||
			d.batchOperationOut.shippingAuthorization.id ===
			this.forShippingAuthorization.id;

		this.page.data = this.page.data
			.filter(hasBatchOperationOutAndNotClosed)
			.filter(hasNotShippingAuthorizationOrIsCurrent);
	}

	/**
	 * Seleção de status
	 *
	 * @param statusCode
	 * @param event
	 */
	public selectStatus(statusCode, event) {

		if (event.target.checked) {
			if (this.statusSelected.indexOf(statusCode) == -1) {
				this.statusSelected.push(statusCode);
			}
		}
		else {
			let i = this.statusSelected.indexOf(statusCode);
			if (i > -1) {
				this.statusSelected.splice(i, 1);
			}
		}

		setTimeout(() => {

			// se nenhum está marcado, marca todos
			if (this.statusSelected.length == 0) {
				this.checkAllStatus();
			}

			this.loadList();

		}, 100);
	}

  public openTransportation(transportation) {
    transportation.opened = !transportation.opened;

    if (!transportation.opened || !transportation.fiscalNotes.length) {
      return;
    }

    let promises = [];

    for (let fiscalNote of transportation.fiscalNotes) {
      promises.push(this.certificateService.list(transportation.id, fiscalNote.id))
    }

    Promise.all(promises).then((res) => {
      for (let i in res) {
        let certificates = res[i];
        if (certificates && certificates.length) {
          let fiscalNote = transportation.fiscalNotes.find(nf => certificates[0].fiscalNote.id == nf.id);
          fiscalNote.certificates = certificates;
          fiscalNote.certificateCodes = certificates.map(i => i.certificate.name).join(', ');
        }
      }
    });
  }

	/**
	 * Verifica se o status está presente na lista (checked)
	 * @param statusCode
	 */
	public isStatusChecked(statusCode) {
		return (this.statusSelected.indexOf(statusCode) > -1);
	}

  openDriverIncidentFormModal(driver : Driver){
	  if(!driver) return;
	  this.driver = driver;
	  this.driverIncidentFormModal.open(null);
  }

  closeDriveIncidentFormModal(incident: Incident) {
    (<any>jQuery)('.modal').modal('hide');
    this.driverIncidentFormModal.close();
  }

}
