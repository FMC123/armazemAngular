import { RouteItemStatus } from './route-item-status';
import { Position } from './../position/position';
import { ModalManager } from './../shared/modals/modal-manager';
import { AutomationRouteItem } from './automation-route-item';
import { ErrorHandler } from './../shared/errors/error-handler';
import { Notification } from './../shared/notification/notification';
import { AutomationRouteService } from './automation-route.service';
import { AuthService } from './../auth/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';
import { AutomationTypeModal } from 'app/automation-route/automation-route-modal-type';
import { AutomationStatus } from 'app/automation-route/automation-status';
import { PositionType } from '../position/position-type';
import { TypeRouteEquipment } from './type-route-equipment';
import { AutomationRouteDuctClean } from './automation-route-duct-clean';
import { Batch } from '../batch/batch';
import { BalanceService } from '../balance/balance.service';
import { BatchService } from '../batch/batch.service';

@Component({
	selector: 'app-automation-route',
	templateUrl: './automation-route.component.html'
})
export class AutomationRouteComponent implements OnInit, OnDestroy {
	private subscription: Subscription;
	loading = true;
	statuses = AutomationStatus.list();
	automationRoutes: Array<AutomationRouteItem>;
	executeConfirm = new ModalManager();

	constructor(
		private auth: AuthService,
		private batchService: BatchService,
		private automationService: AutomationRouteService,
		private balanceService: BalanceService,
		private errorHandler: ErrorHandler
	) {}

	get automationRoutesAvailable() {
		const filterNotDestinationGranel = (ar: AutomationRouteItem) =>
			ar.positionDestination &&
			ar.positionDestination.type !== PositionType.GRANEL.code;

		return this.automationRoutes.filter(filterNotDestinationGranel);
	}

	ngOnInit() {
		this.subscription = Observable.timer(1000, 10000).subscribe(() => {
			this.load();
		});
	}

	ngOnDestroy() {
		if (this.subscription && !this.subscription.closed) {
			this.subscription.unsubscribe();
		}
	}

	execute(payload: { type: string; automationRoute: AutomationRouteItem }) {
		let { type, automationRoute } = payload;

		let commands = {
			MOEGA_EMBEGADORA_FINISH_AUTOMATION: () => [
				this.finishAutomation(automationRoute)
			],

			MOEGA_EMBEGADORA_FINISH_SYSTEM: () => [
				this.finishRemovingTwoPositions(automationRoute),
				this.updateStatus(automationRoute)
			],

			MOEGA_SILO_FINISH: () => [
				this.finishAutomation(automationRoute),
				this.finishRemovingOnePosition(automationRoute),
				this.updateStatus(automationRoute)
			],

			SILO_EMBEGADORA_INIT: () => [
				this.initAutomation(automationRoute),
				this.initEmbegamento(automationRoute),
				this.updateStatus(automationRoute)
			],

			SILO_EMBEGADORA_FINISH_AUTOMATION: () => [
				this.finishAutomation(automationRoute)
			],

			SILO_EMBEGADORA_FINISH_SYSTEM: () => [
				this.finishRemovingTwoPositions(automationRoute),
				this.updateStatus(automationRoute)
			]
		};

		let promises = commands[type]();

		if (!promises) {
			return Promise.reject('Invalid command!');
		}

		this.loading = true;

		return Promise.all(promises)
			.then(() => this.load())
			.then(() => {
				Notification.success('Operação realizada com sucesso!');
			})
			.catch(error => this.errorHandler.fromServer(error));
	}

	allowMoegaSiloFinish(automationRoute: AutomationRouteItem) {
		if (!automationRoute) {
			return false;
		}

		if (!automationRoute.batchCodeOrigin) {
			return false;
		}

		if (!automationRoute.batchCodeDestination) {
			return false;
		}

		if (automationRoute.positionOrigin.type !== PositionType.MOEGA.code) {
			return false;
		}

		if (automationRoute.positionDestination.type !== PositionType.SILO.code) {
			return false;
		}

		return true;
	}

	allowMoegaEmbegadoraFinish(automationRoute: AutomationRouteItem) {
		if (!automationRoute) {
			return false;
		}

		if (!automationRoute.batchCodeOrigin) {
			return false;
		}

		if (!automationRoute.batchCodeDestination) {
			return false;
		}

		if (automationRoute.positionOrigin.type !== PositionType.MOEGA.code) {
			return false;
		}

		if (
			automationRoute.positionDestination.type !== PositionType.EMBEGADORA.code
		) {
			return false;
		}

		return true;
	}

	allowSiloEmbegadoraInit(automationRoute: AutomationRouteItem) {
		if (!automationRoute) {
			return false;
		}

		if (!automationRoute.batchCodeOrigin) {
			return false;
		}

		if (automationRoute.positionOrigin.type !== PositionType.SILO.code) {
			return false;
		}

		if (
			automationRoute.positionDestination.type !== PositionType.EMBEGADORA.code
		) {
			return false;
		}

		return true;
	}

	allowSiloEmbegadoraFinish(automationRoute: AutomationRouteItem) {
		return this.allowSiloEmbegadoraInit(automationRoute);
	}

	updateStatus(item: AutomationRouteItem) {
		if (item.status !== 'INACTIVE') {
			item.status = 'FINALIZING';
		} else {
			if (item.typeRouteEquipment) {
				switch (item.typeRouteEquipment.code) {
					case 'SILO_SILO':
						item.status = 'TRANSFERRING';
						break;
					case 'SILO_EMBEGADORA':
						item.status = 'BAGGING';
						break;
					case 'MOEGA_GRANEL':
						item.status = 'DUMPING';
						break;
					case 'MOEGA_SILO':
						item.status = 'RECEIVING';
						break;
					default:
						break;
				}
			}
		}
		this.automationService.updateStatus(item);
	}

	initEmbegamento(automationRoute: AutomationRouteItem) {
		this.balanceService.batchOperationMoveUrlOnlyMove(
			automationRoute.batchOrigin.batchOperation,
			automationRoute.batchOrigin.id,
			automationRoute.positionDestination.id
		);
	}

	finishRemovingTwoPositions(automationRoute: AutomationRouteItem) {
		return this.balanceService.batchOperationFinallyMove(
			automationRoute.batchOrigin.batchOperation,
			automationRoute.batchOrigin.id,
			automationRoute.positionOrigin.id,
			automationRoute.positionDestination
		);
	}

	finishRemovingOnePosition(automationRoute: AutomationRouteItem) {
		return this.balanceService.batchOperationFinallyMove(
			automationRoute.batchOrigin.batchOperation,
			automationRoute.batchOrigin.id,
			automationRoute.positionOrigin.id,
			null
		);
	}

	initAutomation(automationRoute: AutomationRouteItem) {
		return this.automationService
			.executeBothTagsIfExists(
				automationRoute.tagOperation1,
				automationRoute.tagOperation2
			)
			.then(() => this.registerDuctClean(automationRoute))
			.catch(() =>
				Notification.error('Erro ao enviar comando para automação!')
			);
	}

	finishAutomation(automationRoute: AutomationRouteItem) {
		return this.automationService
			.executeBothTagsIfExists(
				automationRoute.tagFinalization1,
				automationRoute.tagFinalization2
			)
			.then(() => this.registerDuctClean(automationRoute))
			.catch(() =>
				Notification.error('Erro ao enviar comando para automação!')
			);
	}

	registerDuctClean(automationRoute: AutomationRouteItem) {
		let ductClean = new AutomationRouteDuctClean();
		ductClean.automationRouteItem = automationRoute;
		ductClean.batchCode = automationRoute.batchCodeOrigin;
		ductClean.batchOperationCode =
			automationRoute.batchOrigin.batchOperation.batchOperationCode;
		ductClean.routeItemStatusCode = automationRoute.getRouteItemStatus.code;
		return this.automationService.registerDuctClean(ductClean);
	}

	batchToShow(automationRoute: AutomationRouteItem) {
		if (automationRoute.positionDestination.type === PositionType.SILO.code) {
			return automationRoute.batchDestination;
		}

		return automationRoute.batchOrigin;
	}

	load() {
		this.automationService
			.list()
			.then(automationRoutes => {
				const sortByPositionName = (a, b) => {
					if (!a.positionOrigin || !a.positionOrigin.name) {
						return -1;
					}

					if (!b.positionOrigin || !b.positionOrigin.name) {
						return 1;
					}

					let comparation = a.positionOrigin.name.localeCompare(
						b.positionOrigin.name
					);

					if (comparation === 0) {
						if (!a.positionDestination || !a.positionDestination.name) {
							return -1;
						}

						if (!b.positionDestination || !b.positionDestination.name) {
							return 1;
						}

						return a.positionDestination.name.localeCompare(
							b.positionDestination.name
						);
					}

					return comparation;
				};

				this.automationRoutes = automationRoutes;
				this.automationRoutes.sort(sortByPositionName);
				this.loading = false;
			})
			.catch(error => this.handleError(error));
	}

	handleError(error) {
		this.loading = false;
		return this.errorHandler.fromServer(error);
	}
}
