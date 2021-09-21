import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Notification } from '../../shared/notification';
import {Http, ResponseContentType, URLSearchParams} from '@angular/http';
import { ErrorHandler } from '../../shared/shared.module';
import { SamplePackReceiveService } from '../sample-pack-receive.service';
import {Sample} from "../../sample/sample";
import {SampleReceiveService} from "../sample-receive.service";
import {SamplePack} from "../../sample-pack/sample-pack";
import {Endpoints} from "../../endpoints";

@Component({
	selector: 'app-sample-pack-receive-form',
	templateUrl: './sample-pack-receive-form.component.html'
})
export class SamplePackReceiveFormComponent implements OnInit {
	samplePack: SamplePack;
	form: FormGroup;
	loading = false;
	submitted = false;
	listSamples: Array<Sample>;

	constructor(
		private errorHandler: ErrorHandler,
		private route: ActivatedRoute,
		private http: Http,
		private router: Router,
		private formBuilder: FormBuilder,
		private sampleService: SampleReceiveService,
		private samplePackService: SamplePackReceiveService
	) { }

	ngOnInit() {
		Notification.clearErrors();

		this.route.data.forEach((data: { samplePack: SamplePack }) => {
			this.samplePack = data.samplePack;
		});

		this.buildForm();

		if(this.samplePack.samples){
      this.listSamples = this.samplePack.samples;
    }

	}

	buildForm() {
		this.form = this.formBuilder.group({
			receiveNote: [this.samplePack.receiveNote || '']
		});
	}

  printBarCode(id: string): Promise<void> {
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
      }).catch(error => this.handleError(error));
  }

	save(accordance: boolean) {
		this.receiveSamplePack(accordance);
	}

	receiveSamplePack(accordance: boolean) {
		this.submitted = true;

		Object.keys(this.form.controls).forEach(key => {
			this.form.controls[key].markAsDirty();
		});

		if (!this.form.valid) {
			return;
		}
		this.loading = true;

		if (!accordance) {
			if (!this.form.value.receiveNote) {
				Notification.error('Campo de Observação Recebimento é obrigatório para não conformidade');
				this.loading = false;
				return;
			}
		}

		this.samplePack.receiveNote = this.form.value.receiveNote;

		this.samplePackService
			.receive(this.samplePack, accordance)
			.then(samplePack => {
				Notification.success('Pacote de amostra salvo com sucesso!');
				this.router.navigate(['/sample-pack-receive']);
			})
			.catch(error => this.handleError(error));
	}

	handleError(error) {
		this.loading = false;
		return this.errorHandler.fromServer(error);
	}
}
