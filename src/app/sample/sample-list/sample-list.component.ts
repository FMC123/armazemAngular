import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs/Rx';
import { Sample } from '../sample';
import { SampleService } from '../sample.service';
import { ErrorHandler } from '../../shared/errors/error-handler';
import { Logger } from '../../shared/logger/logger';
import { ModalManager } from '../../shared/modals/modal-manager';
import { Notification } from '../../shared/notification';
import { Page } from '../../shared/page/page';
import { SampleListFilter } from './sample-list-filter';
import { Endpoints } from "../../endpoints";
import { Http, ResponseContentType, URLSearchParams } from "@angular/http";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from 'app/shared/forms/validators/custom-validators';
import { Masks } from '../../shared/forms/masks/masks';
import {Department} from "../../department/department";
import {Batch} from "../../batch/batch";
import {ParameterService} from "../../parameter/parameter.service";
import {Parameter} from "../../parameter/parameter";

@Component({
	selector: 'app-sample-list',
	templateUrl: 'sample-list.component.html'
})
export class SampleListComponent implements OnInit, OnDestroy {
	loading: boolean;
	error: boolean;
	page: Page<Sample> = new Page<Sample>();
	filter = new SampleListFilter();
	deleteConfirm = new ModalManager();
	formFitilho: FormGroup;
	sampleIdSelected: string;
  batchIdSelected: string;
  batches: Batch[];
	opcoesRelFitilhoModal = new ModalManager();
	blindClassification: boolean = false;

	integerMask = Masks.integerMask;
	decimalMask = Masks.decimalMask;
	dateMask = Masks.dateMask;

	constructor(
		private service: SampleService,
		private errorHandler: ErrorHandler,
		private router: Router,
		private logger: Logger,
		private http: Http,
		private formBuilder: FormBuilder,
    private parameterService: ParameterService,
	) { }

	ngOnInit() {
		this.buildForm();
		Notification.clearErrors();
		this.loadParameter();
		this.loadList();
		this.page.changeQuery.subscribe(() => {
			this.loadList();
		});
	}

	ngOnDestroy() {
		this.page.changeQuery.unsubscribe();
	}

	buildForm() {
		let group = {
      'batchIdSelectedId': ['', [Validators.required]],
			'qtdeVias': [3, [Validators.required, CustomValidators.minValidator(1)]],
		};

		this.formFitilho = this.formBuilder.group(group);
	}

	filterList(filter) {
		this.filter = filter;
		this.loadList();
	}

	loadParameter(){
    this.parameterService.findByKey("BLIND_CLASSIFICATION").then(parameter => {
      if (!parameter.value){
        this.blindClassification =  false;
        return;
      }
      this.blindClassification = parameter.value === "S";
    });
  }

	loadList(skipLoading = false) {
		this.error = false;

		if (!skipLoading) {
			this.loading = true;
		}

		this.filter.onlyArchived = false;
		this.service
			.listPaged(this.filter, this.page)
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

	printBarCode(id: string): Promise<void> {
		this.loading = true;
		let params = new URLSearchParams();
		params.append('sampleId', id);
		return this.http
			.get(Endpoints.reportSamplePrintBarCodeUrl, {
				responseType: ResponseContentType.Blob,
				search: params
			})
			.toPromise()
			.then(response => {
				let url = window.URL.createObjectURL(response.blob());
				window.open(url);

				// atualiza listagem para mostrar código de barras se ainda não foi gerado
				this.loadList();

			}).catch(error => this.handleError(error));
	}

	/**
	 * Opções para impressão do relatório de Fitilho
	 */
	printFitilho(sample: Sample) {
		this.sampleIdSelected = sample.id;
		this.batches = sample.batches;
		this.opcoesRelFitilhoModal.open(null);
	}

	/**
	 * Geração do relatório de Fitilho
	 */
	gerarRelatorioFitilho() {

		Object.keys(this.formFitilho.controls).forEach((key) => {
			this.formFitilho.controls[key].markAsDirty();
		});

		if (!this.formFitilho.valid) {
			return;
		}

		// imprime relatório
		this.loading = true;
		let params = new URLSearchParams();
		params.append('sampleId', this.sampleIdSelected);
    params.append('batchId', this.formFitilho.get('batchIdSelectedId').value);
		params.append('printQuantity', this.formFitilho.get('qtdeVias').value);

		this.http.get(Endpoints.reportSamplePrintRibbonUrl, {
			responseType: ResponseContentType.Blob,
			search: params
		}).toPromise().then(response => {
			let url = window.URL.createObjectURL(response.blob());
			window.open(url);
			// fecha modal
			(<any>jQuery)('.modal').modal('hide');
			this.loading = false;

		}).catch((error) => {
			this.handleError(error);
			// fecha modal
			(<any>jQuery)('.modal').modal('hide');
		});
	}

	/**
	 * Para verifica se pode ou não imprimir o código de barras
	 */
	naoPodeImprimirCodigoBarras(sample: Sample) {

		if (sample.batches != null && sample.batches.length > 0
			&& (((sample.batches[0].collaborator && sample.batches[0].collaborator.id) || (sample.batches[0].owner && sample.batches[0].owner.id))
				|| (sample.batches[0].batchOperation &&
					((sample.batches[0].batchOperation.collaborator && sample.batches[0].batchOperation.collaborator.id)
						|| (sample.batches[0].batchOperation.owner && sample.batches[0].batchOperation.owner.id))))
			&& sample.batches[0].batchCode && (sample.batches[0].netQuantity || sample.sacksInteger)) {

			return false;
		}

		return true;
	}
}
