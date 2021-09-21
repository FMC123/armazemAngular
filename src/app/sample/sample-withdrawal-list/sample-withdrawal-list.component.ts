import { Component, OnInit, OnDestroy } from '@angular/core';

import { Notification } from './../../shared/notification/notification';
import { ErrorHandler, ModalManager, Search } from '../../shared/shared.module';
import { Logger } from '../../shared/logger/logger';
import { Page } from '../../shared/page/page';
import { Endpoints } from '../../endpoints';
import {
	Headers,
	Http,
	ResponseContentType,
	URLSearchParams
} from '@angular/http';
import { Sample } from '../sample';
import { SampleService } from '../sample.service';
import { UserService } from '../../user/user.service';
import { User } from '../../user/user';

@Component({
	selector: 'app-sample-withdrawal-list',
	templateUrl: './sample-withdrawal-list.component.html'
})
export class SampleWithdrawalListComponent {
	loading = false;
	samples: Array<Sample> = [];
	barcode = '';
	user = new User();
	responsible = new User();
	sampleWithdrawalModal = new ModalManager();

	constructor(
		private sampleService: SampleService,
		private userService: UserService,
		private errorHandler: ErrorHandler
	) {}

	destroy(id) {
		this.samples = this.samples.filter(s => s.id !== id);
	}

	add(): void {
		Notification.clearErrors();

		if (!this.barcode) {
			return;
		}

		const exists = this.samples.some(s => s.barcode === this.barcode);

		if (exists) {
			this.barcode = '';
			return;
		}

		this.loading = true;

		this.sampleService
			.findByBarCodeWithdrawal(this.barcode)
			.then(sample => {
				this.samples.push(sample);
				this.loading = false;
			})
			.catch(error => {
				this.handleError(error);
			});

		this.barcode = '';
	}

	getUserName(): void {
		if (!this.user.login) {
			this.user = new User();
			return;
		}

		this.userService
			.getUserByLogin(this.user.login)
			.then(user => {
				this.user = user;
			})
			.catch(error => {
				this.user = new User();
				this.handleError(error);
			});
	}

	getResponsibleName(): void {
		if (!this.responsible.login) {
			this.responsible = new User();
			return;
		}

		this.userService
			.getUserByLogin(this.responsible.login)
			.then(user => {
				this.responsible = user;
			})
			.catch(error => {
				this.responsible = new User();
				this.handleError(error);
			});
	}

	askPassword(): void {
		if (!this.responsible.login) {
			Notification.error('Informe o responsável pela amostra.');

			return;
		}

		if (!this.samples.length) {
			Notification.error('Não há amostras a serem baixadas.');

			return;
		}

		if (!this.user.login) {
			Notification.error(
				'Informe seu login para prosseguir com a baixa de amostra.'
			);

			return;
		}

		Notification.clearErrors();

		this.sampleWithdrawalModal.open(null);
	}

	withdrawal(password: string): void {
		this.user.password = password;

		this.sampleService
			.withdrawal(
				this.samples,
				this.user.id,
				this.responsible.id,
				this.user.password
			)
			.then(() => {
				Notification.success('Ok.');
				this.samples = [];
				this.user = new User();
				this.responsible = new User();
			})
			.catch(error => {
				this.handleError(error);
			});
	}

	handleError(error) {
		this.loading = false;
		return this.errorHandler.fromServer(error);
	}
}
