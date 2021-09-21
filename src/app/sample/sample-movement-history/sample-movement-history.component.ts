import { Component, OnInit, Input } from '@angular/core';
import { Sample } from '../sample';
import { SampleMovementHistoryService } from './sample-movement-history.service';
import {SampleMovementHistory} from "../sample-movement-history";
import {Notification} from "../../shared/notification";
import {ErrorHandler} from "../../shared/errors/error-handler";

@Component({
	selector: 'app-sample-movement-history',
	templateUrl: 'sample-movement-history.component.html'
})
export class SampleMovementHistoryComponent implements OnInit {
	loading = false;
	@Input() sample: Sample;
	data: SampleMovementHistory[];

	constructor(private service: SampleMovementHistoryService,
              private errorHandler: ErrorHandler) {}

	ngOnInit() {
		this.loading = false;

		return this.service.listAllSampleMovements(this.sample.id).then(data => {
			this.data = data;
		});
	}

  handleError(error) {
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }
}
