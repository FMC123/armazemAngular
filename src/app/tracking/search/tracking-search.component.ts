import { TrackingSearchService } from './tracking-search.service';
import { TrackingService } from '../tracking.service';
import { TrackingSearchFilter } from './tracking-search-filter';
import { CertificateService } from '../../certificate/certificate.service';
import { AuthService } from '../../auth/auth.service';
import { Masks } from '../../shared/forms/masks/masks';
import { Certificate } from '../../certificate/certificate';
import { Subscription } from 'rxjs/Rx';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-tracking-search',
  templateUrl: './tracking-search.component.html'
})
export class TrackingSearchComponent implements OnInit, OnDestroy {
  collapsed = false;
  loading = false;

  form: FormGroup;
  certificates: Array<Certificate>;

  decimalMask = Masks.decimalMask;

  get fullLoading() {
    return this.service.loading && !this.loading;
  }

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private service: TrackingService,
    private searchService: TrackingSearchService,
    private certificateService: CertificateService,
  ) {}

  ngOnInit() {
    this.certificateService.list().then((certificates) => {
      this.certificates = certificates;
      this.buildForm(new TrackingSearchFilter());
    });
  }

  reset() {
    this.buildForm(new TrackingSearchFilter());
    this.searchService.reset(
      this.service.batches,
      this.service.storageUnits,
      this.service.positions,
    );
  }

  ngOnDestroy() {

  }

  buildForm(filter: TrackingSearchFilter) {
    let group = {
      batchCode: [filter.batchCode || ''],
      certificateId: [filter.certificateId || ''],
      classificationBeverage: [filter.classificationBeverage || ''],
      classificationBeverageComplement: [filter.classificationBeverageComplement || ''],
      classificationPattern: [filter.classificationPattern || ''],
      classificationBean: [filter.classificationBean || ''],
      classificationColour: [filter.classificationColour || ''],
    };

    this.form = this.formBuilder.group(group);
  }

  submit() {
    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
    });

    if (!this.form.valid) {
      return;
    }

    this.collapsed = true;

    this.searchService.search(
      TrackingSearchFilter.fromData(this.form.value),
      this.service.batches,
      this.service.storageUnits,
      this.service.positions,
    );
  }

}
