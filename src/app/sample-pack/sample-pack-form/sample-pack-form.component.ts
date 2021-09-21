import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Notification } from './../../shared/notification/notification';
import { Warehouse } from '../../warehouse/warehouse';
import { WarehouseService } from '../../warehouse/warehouse.service';
import { SamplePack } from '../sample-pack';
import { SamplePackService } from '../sample-pack.service';
import { ErrorHandler } from 'app/shared/errors/error-handler';
import { Http, ResponseContentType, URLSearchParams } from '@angular/http';
import { Sample } from '../../sample/sample';
import { SampleService } from '../../sample/sample.service';
import { Endpoints } from 'app/endpoints';

@Component({
	selector: 'app-sample-pack-form',
	templateUrl: './sample-pack-form.component.html'
})
export class SamplePackFormComponent implements OnInit {
	samplePack: SamplePack;
	form: FormGroup;
	loadingListSample: boolean = false;
  loading: boolean = false;
	submitted: boolean = false;
	listSamples: Array<Sample> = [];

	constructor(
		private errorHandler: ErrorHandler,
		private route: ActivatedRoute,
		private http: Http,
		private router: Router,
		private formBuilder: FormBuilder,
		private sampleService: SampleService,
		private samplePackService: SamplePackService,
		private warehouseService: WarehouseService
	) {}

	ngOnInit() {
		Notification.clearErrors();

		this.route.data.forEach((data: { samplePack: SamplePack }) => {
			this.samplePack = data.samplePack;
		});

		this.buildForm();

		this.findSamples();
	}

	buildForm() {
		this.form = this.formBuilder.group({
			boxCode: [this.samplePack.boxCode || '', [Validators.required]],
			sealCode: [this.samplePack.sealCode || '', [Validators.required]],
			sendNote: [this.samplePack.sendNote || '']
		});

		console.log(this.samplePack);
	}

	findSamples() {
    this.loadingListSample = true;
		this.sampleService
			.listAllPending(this.samplePack.id)
			.then(list => {
					this.listSamples = this.samplePack.samples;
					if(this.listSamples){
						this.listSamples = this.listSamples.concat(list);
					}
					else{
						this.listSamples = list;
					}
					this.loadingListSample = false;
			})
			.catch(error => this.handleError(error));
	}

	save() {
		this.saveSample(false);
	}

	saveSample(send: boolean) {
		this.submitted = true;

		Object.keys(this.form.controls).forEach(key => {
			this.form.controls[key].markAsDirty();
		});

		if (!this.form.valid) {
			return;
		}
		this.loading = true;
		this.samplePack.boxCode = this.form.value.boxCode;
		this.samplePack.sealCode = this.form.value.sealCode;
		this.samplePack.sendNote = this.form.value.sendNote;

		this.samplePack.samples = [];
		for (let s of this.listSamples) {
			if (s.selected === true) {
				this.samplePack.samples.push(s);
			}
		}

		this.samplePackService
			.save(this.samplePack, send)
			.then(samplePack => {
				Notification.success('Pacote de amostra salvo com sucesso!');
				this.router.navigate(['/sample-pack']);
			})
			.catch(error => this.handleError(error));
	}

	printBarCode(sample: any): Promise<void> {
		let params = new URLSearchParams();
		params.append('sampleId', sample.id);
		return this.http
			.get(Endpoints.reportSamplePrintBarCodeUrl, {
				responseType: ResponseContentType.Blob,
				search: params
			})
			.toPromise()
			.then(response => {
				let url = window.URL.createObjectURL(response.blob());
				window.open(url);
        this.sampleService
          .find(sample.id)
          .then(s => {
            if (s) {
              sample.barcode = s.barcode;
            }
          })
          .catch(error => this.handleError(error));
			}).catch(error => this.handleError(error));
	}

	saveAndSend() {
		this.saveSample(true);
	}

	handleError(error) {
		this.loading = false;
		return this.errorHandler.fromServer(error);
	}
}
