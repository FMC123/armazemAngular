import { Component, OnInit, OnDestroy } from '@angular/core';
import { Notification } from '../../shared/notification';
import { ErrorHandler } from '../../shared/errors/error-handler';
import { ActivatedRoute } from '@angular/router';
import {ClassificationVersion} from "../../classification/classification-version";
import {ClassificationItem} from "../../classification/classification-item";

@Component({
  selector: 'app-analyze-special-coffee-details',
  templateUrl: './analyze-special-coffee-details.component.html'
})
export class AnalyzeSpecialCoffeeDetailsComponent implements OnInit, OnDestroy {

  classification: ClassificationVersion;
  items: Array<ClassificationItem>;
  loading: boolean;

  constructor(
    private route: ActivatedRoute,
		private errorHandler: ErrorHandler
  ) { }

  ngOnInit() {
    Notification.clearErrors();
    this.loading = true;
    this.route.data.forEach((data: { classification: ClassificationVersion }) => {
      this.classification = data.classification;
      this.items = data.classification.items;
      this.loading = false;
    });

  }

  ngOnDestroy() {}

  handleError(error) {
		return this.errorHandler.fromServer(error);
  }

}
