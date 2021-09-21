import { Component, OnInit, OnDestroy } from '@angular/core';
import { ClassificationService } from '../../classification.service';
import { ErrorHandler } from '../../../shared/shared.module';
import { ClassificationVersion } from '../../classification-version';
import { Notification } from '../../../shared/notification';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-classification-list-sample',
  templateUrl: './classification-list-sample.component.html'
})
export class ClassificationListSampleComponent implements OnInit, OnDestroy {
  loading: boolean;
  error: boolean;
  list: Array<ClassificationVersion>
  barcode: string

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private errorHandler: ErrorHandler,
    private classificationService: ClassificationService
  ) { }

  ngOnInit() {
    if (!this.route.params['value'] && !this.route.params['value'].id) {
      this.router.navigate(['/classification']);
    }

    const id = this.route.params['value'].id;

    this.classificationService.listOldVersions(id).then((data) => {
      this.loading = false;
      this.list = data;
      if(this.list && this.list.length && this.list[0] && this.list[0].sample) {
        this.barcode = this.list[0].sample.barcode;
      }
    }).catch(error => this.handleError(error));
  }

  ngOnDestroy() { }

  handleError(error) {
    this.error = true;
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }

}
