import { Component, OnDestroy, OnInit } from '@angular/core';
import { Sample } from '../sample';
import { SampleService } from '../sample.service';
import { ErrorHandler } from '../../shared/errors/error-handler';
import { Notification } from '../../shared/notification';
import { Page } from '../../shared/page/page';
import { SampleListFilter } from './sample-list-filter';
import {SampleMovementHistoryService} from "../sample-movement-history/sample-movement-history.service";

@Component({
	selector: 'app-sample-req-picote-list',
	templateUrl: 'sample-req-picote-list.component.html'
})
export class SampleReqPicoteListComponent implements OnInit, OnDestroy {
	loading: boolean;
	error: boolean;
	page: Page<Sample> = new Page<Sample>();
	filter = new SampleListFilter();
	sampleIdSelected: string;

	constructor(
		private service: SampleService,
		private errorHandler: ErrorHandler,
    private sampleMovementHistoryService: SampleMovementHistoryService,
	) { }

	ngOnInit() {
		Notification.clearErrors();
		this.loadList();
		this.page.changeQuery.subscribe(() => {
			this.loadList();
		});
	}

	ngOnDestroy() {
		this.page.changeQuery.unsubscribe();
	}

  filterList(filter) {
		this.filter = filter;
		this.loadList();
	}

	loadList(skipLoading = false) {
		this.error = false;

		if (!skipLoading) {
			this.loading = true;
		}

		this.filter.onlyArchived = false;
		this.service
			.listForPicoteRequestPaged(this.filter, this.page)
			.then(() => {
				this.loading = false;
			})
			.catch(error => this.handleError(error));
	}

	handleError(error) {
		this.error = true;
		this.loading = false;
		return this.errorHandler.fromServer(error);
	}

  acceptedPicote(sampleId:any){
    this.loading = true;
    return this.sampleMovementHistoryService.acceptedPicote(sampleId)
      .then(() => {
        Notification.success('Solicitação de picote aceito com sucesso!');
        this.loading = false;
        this.loadList();
      })
      .catch(error => this.handleError(error));
  }

  readytoshipPicote(sampleId:any){
    this.loading = true;
    return this.sampleMovementHistoryService.readytoshipPicote(sampleId)
      .then(() => {
        Notification.success('Picote pronto pra envio!');
        this.loading = false;
        this.loadList();
      })
      .catch(error => this.handleError(error));
  }

  sentPicote(sampleId:any){
    this.loading = true;
    return this.sampleMovementHistoryService.sentPicote(sampleId)
      .then(() => {
        Notification.success('Picote enviado com sucesso!');
        this.loading = false;
        this.loadList();
      })
      .catch(error => this.handleError(error));
  }
}
