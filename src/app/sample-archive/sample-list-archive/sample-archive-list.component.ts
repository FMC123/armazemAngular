import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { ErrorHandler } from '../../shared/errors/error-handler';
import { Logger } from '../../shared/logger/logger';
import { ModalManager } from '../../shared/modals/modal-manager';
import { Notification } from '../../shared/notification';
import { Page } from '../../shared/page/page';
import {Endpoints} from "../../endpoints";
import {Http, ResponseContentType, URLSearchParams} from "@angular/http";
import {Sample} from "../../sample/sample";
import {SampleService} from "../../sample/sample.service";
import {SampleListFilter} from "../../sample/sample-list/sample-list-filter";
import {SampleMovementHistoryService} from "../../sample/sample-movement-history/sample-movement-history.service";
import {Masks} from "../../shared/forms/masks/masks";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CustomValidators} from "../../shared/forms/validators/custom-validators";
import {NumberHelper} from "../../shared/globalization";

@Component({
	selector: 'app-archive-sample-list',
	templateUrl: 'sample-archive-list.component.html'
})
export class SampleArchiveListComponent implements OnInit, OnDestroy {
	loading: boolean;
	error: boolean;
	page: Page<Sample> = new Page<Sample>();
	filter = new SampleListFilter();
	deleteConfirm = new ModalManager();
  decimalMask: any = Masks.decimalMask;
  formPicote: FormGroup;
  sampleIdSelected: string;
  optionRequestPicoteModal = new ModalManager();

	constructor(
		private service: SampleService,
    private sampleMovementHistoryService: SampleMovementHistoryService,
    private formBuilder: FormBuilder,
		private errorHandler: ErrorHandler
  ) {}

	ngOnInit() {
		Notification.clearErrors();
		this.loadList();
		this.buildForm();
		this.page.changeQuery.subscribe(() => {
			this.loadList();
		});
	}

  buildForm() {
    let group = {
      'quantity': ['', [Validators.required, CustomValidators.minValidator(1)]],
    };
    this.formPicote = this.formBuilder.group(group);
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
			.listPagedArchive(this.filter, this.page)
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

  requestPicote(sampleId:any) {
    this.sampleIdSelected = sampleId;
    this.optionRequestPicoteModal.open(null);
  }

  sendRequestPicote() {
    Object.keys(this.formPicote.controls).forEach((key) => {
      this.formPicote.controls[key].markAsDirty();
    });

    if (!this.formPicote.valid) {
      return;
    }

    let quantity:number = NumberHelper.fromPTBR(this.formPicote.get('quantity').value);

    this.loading = true;
    return this.sampleMovementHistoryService.requestPicote(this.sampleIdSelected, quantity)
      .then(() => {
        Notification.success('Solicitação de picote realizado com sucesso!');
        this.loading = false;
        this.loadList();
        (<any>jQuery)('.modal').modal('hide');
      })
      .catch(error => {
        this.handleError(error);
        (<any>jQuery)('.modal').modal('hide');
      });
  }

  receivePicote(sampleId:any) {
    this.loading = true;
    return this.sampleMovementHistoryService.receivePicote(sampleId)
      .then(() => {
        Notification.success('Recebimento de picote realizado com sucesso!');
        this.loading = false;
        this.loadList();
      })
      .catch(error => this.handleError(error));
  }

  closeSample(sampleId:any) {
    this.loading = true;
    return this.sampleMovementHistoryService.closedSample(sampleId)
      .then(() => {
        Notification.success('Baixa da amostra realizada com sucesso!');
        this.loading = false;
        this.loadList();
      })
      .catch(error => this.handleError(error));
  }

}
