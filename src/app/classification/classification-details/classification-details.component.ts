import { Component, OnInit, OnDestroy } from '@angular/core';
import { ClassificationVersion } from '../classification-version';
import { Notification } from '../../shared/notification';
import { ErrorHandler } from '../../shared/errors/error-handler';
import { ActivatedRoute } from '@angular/router';
import { ClassificationItem } from '../classification-item';

@Component({
  selector: 'app-classification-details',
  templateUrl: './classification-details.component.html'
})
export class ClassificationDetailsComponent implements OnInit, OnDestroy {

  classification: ClassificationVersion;
  items: Array<ClassificationItem>;
  loading: boolean;
  /**
   * Indicativo para classificação de café especial
   */
  specialCoffee: boolean = false;

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

    // parâmetros
    this.route.queryParams.subscribe(params => {
      if (params['specialCoffee'] != null && params['specialCoffee'] == 'true') {
        this.specialCoffee = true;
      }
    });

  }

  ngOnDestroy() {}

  handleError(error) {
		return this.errorHandler.fromServer(error);
  }

}
