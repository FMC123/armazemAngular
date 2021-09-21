import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StorageUnitMergeService } from '../storage-unit-merge.service';
import { AfterViewInit, Component, OnInit, ViewChildren } from '@angular/core';
import { Focusable } from 'app/shared/forms/focusable/focusable.directive';

@Component({
  selector: 'app-storage-unit-merge-search',
  templateUrl: 'storage-unit-merge-search.component.html'
})

export class StorageUnitMergeSearchComponent implements OnInit, AfterViewInit {
  @ViewChildren(Focusable) focusables;

  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private batchReportService: StorageUnitMergeService,
  ) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      'batchCode': ['', Validators.required],
    });
  }

  ngAfterViewInit() {
    this.focusOnInput();
  }

  focusOnInput() {
    if (this.focusables && this.focusables.length > 0) {
      this.focusables.first.focus();
    }
  }

  search() {
    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
    });

    if (!this.form.valid) {
      return;
    }

    return this.batchReportService
      .search(this.form.value.batchCode);
  }

  get loading() {
    return this.batchReportService.loading;
  }

}
