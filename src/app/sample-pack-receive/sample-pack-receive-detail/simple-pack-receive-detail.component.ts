import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Notification } from '../../shared/notification';
import { ErrorHandler } from '../../shared/shared.module';
import { SamplePackReceiveService } from '../sample-pack-receive.service';
import { SampleReceiveService } from '../sample-receive.service';
import {Sample} from "../../sample/sample";
import {SamplePack} from "../../sample-pack/sample-pack";
import {Endpoints} from "../../endpoints";
import {Http, ResponseContentType, URLSearchParams} from "@angular/http";

@Component({
	selector: 'app-sample-pack-receive-detail',
	templateUrl: './simple-pack-receive-detail.component.html'
})
export class SamplePackReceiveDetailComponent implements OnInit {
	samplePack: SamplePack;
	loading = false;
	submitted = false;
	listSamples: Array<Sample>;

	constructor(
		private errorHandler: ErrorHandler,
		private route: ActivatedRoute,
		private router: Router,
    private http: Http,
		private samplePackService: SamplePackReceiveService,
		private sampleService: SampleReceiveService,
	) { }

	ngOnInit() {
		Notification.clearErrors();

		this.route.data.forEach((data: { samplePack: SamplePack }) => {
			this.samplePack = data.samplePack;
		});
		if(this.samplePack.samples){
		  this.listSamples = this.samplePack.samples
    }
	}

	handleError(error) {
		this.loading = false;
		return this.errorHandler.fromServer(error);
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
}
