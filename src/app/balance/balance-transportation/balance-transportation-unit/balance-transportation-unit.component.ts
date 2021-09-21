import { Masks } from '../../../shared/forms/masks/masks';
import { BalanceService } from '../../balance.service';
import { BatchOperation } from '../../../batch-operation/batch-operation';
import { BatchOperationService } from '../../../batch-operation/batch-operation.service';
import { ErrorHandler } from '../../../shared/errors/error-handler';
import { ModalManager } from '../../../shared/modals/modal-manager';
import { BalanceTransportationInService } from '../balance-transportation-in.service';

import {Component, Input, OnInit} from '@angular/core';
import { BatchOperationWeight } from '../../../batch-operation/batch-operation-weight';
import { NavigationExtras, Router } from '../../../../../node_modules/@angular/router';
import { AuthService } from '../../../auth/auth.service';
import {TransportationService} from "../../../transportation/transportation.service";
import {TransportationStatus} from "../../../transportation/transportation-status";
import {Transportation} from "../../../transportation/transportation";
import {FiscalNote} from "../../../fiscal-note/fiscal-note";
import {BalanceTransportationWeight} from "../balance-transportation-weight";
import {UserService} from "../../../user/user.service";
import {User} from "../../../user/user";

@Component({
	selector: 'app-balance-transportation-unit',
	templateUrl: 'balance-transportation-unit.component.html'
})
export class BalanceTransportationUnitComponent
	implements OnInit {
	loading = false;
	downloadLoading = false;
	decimalMask = Masks.decimalMask;
	integerMask = Masks.integerMask;
	private editGross;
	private editTare;
	recalculate = false;
  users: Array<User>;
  @Input() balanceTransportationService: any;

	constructor(
		private transportationService: TransportationService,
		private batchOperationService: BatchOperationService,
		private balanceService: BalanceService,
    private userService: UserService,
		private errorHandler: ErrorHandler,
		private router: Router,
		private auth: AuthService
	) { }

	ngOnInit() {
    this.userService.listByWarehouse(this.auth.accessToken.warehouse.id).then(data => {
      this.users = data;
    });
	}

  get transportations(){
	  let transportations: Transportation[] = [];
    transportations.push(this.balanceTransportationService.transportation);
    return transportations;
  }

  get transportation(){
    return this.balanceTransportationService.transportation;
  }

	allowTareWeight(transportation: Transportation) {
		return !!transportation.grossWeight;
	}

	handleError(error) {
		this.loading = false;
		return this.errorHandler.fromServer(error);
	}

	setEditGross(transportation: Transportation) {
		if (this.isLeader() || this.isAdmin()) {
			this.editGross = transportation.id;
		}
	}

	setEditTare(transportation: Transportation) {
		if (this.isAdmin()) {
			this.editTare = transportation.id;
		}
	}

	unsetEditGross() {
		this.editGross = null;
	}

	unsetEditTare() {
		this.editTare = null;
	}

	weighGross(transportation: Transportation) {
		let balanceTransportationWeight = new BalanceTransportationWeight();
    balanceTransportationWeight.scale = this.balanceService.scale;
    balanceTransportationWeight.transportation = transportation;
    balanceTransportationWeight.type = 'GROSS';

    this.balanceService
			.saveBalanceTransportationWeight(balanceTransportationWeight)
			.then(response => {
        transportation.grossWeight = response.weight;
        transportation.netWeight = response.transportation.netWeight;
			})
			.catch(error => this.errorHandler.fromServer(error));
	}

	saveGross(transportation: Transportation) {
		let balanceTranportationWeight = new BalanceTransportationWeight();
    balanceTranportationWeight.transportation = transportation;
    balanceTranportationWeight.weight = transportation.grossWeight;
    balanceTranportationWeight.type = 'GROSS';
    balanceTranportationWeight.manual = true;

		this.balanceService.saveBalanceTransportationWeight(balanceTranportationWeight).then(responses => {
				this.editGross = false;
        transportation.grossWeight = responses.weight;
        transportation.netWeight = responses.transportation.netWeight;
			})
			.catch(error => this.errorHandler.fromServer(error));
	}

	weighTare(transportation: Transportation) {
		let balanceTransportationWeight = new BalanceTransportationWeight();
    balanceTransportationWeight.scale = this.balanceService.scale;
    balanceTransportationWeight.transportation = transportation;
    balanceTransportationWeight.type = 'TARE';

		this.balanceService
			.saveBalanceTransportationWeight(balanceTransportationWeight)
			.then(response => {
				this.editTare = false;
        transportation.tareWeight = response.weight;
        transportation.netWeight = response.transportation.netWeight;
			})
			.catch(error => this.errorHandler.fromServer(error));
	}

	saveTare(transportation: Transportation) {
		let balanceTransportationWeight = new BalanceTransportationWeight();
    balanceTransportationWeight.transportation = transportation;
    balanceTransportationWeight.weight = transportation.tareWeight;
    balanceTransportationWeight.type = 'TARE';
    balanceTransportationWeight.manual = true;

		this.balanceService
			.saveBalanceTransportationWeight(balanceTransportationWeight)
			.then(response => {
				this.editTare = false;
        transportation.tareWeight = response.weight;
        transportation.netWeight = response.transportation.netWeight;
			})
			.catch(error => this.errorHandler.fromServer(error));
	}

	isAdmin() {
		return this.auth.isAdmin;
	}

	isLeader() {
		return this.auth.accessToken.leader;
	}

  setAuditor(event, transportation: Transportation) {
    //if you're on older versions of ES, use for-in instead
    var auditorUser = this.users.find(u => u.id === event.target.value);

    if(auditorUser) {
      transportation.auditorUser = auditorUser;
    }
  }
}
