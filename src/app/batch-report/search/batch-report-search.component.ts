import { Focusable } from '../../shared/forms/focusable/focusable.directive';
import { ErrorHandler } from '../../shared/errors/error-handler';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BatchReportService } from '../batch-report.service';
import {AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChildren} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-batch-report-search',
  templateUrl: 'batch-report-search.component.html'
})

export class BatchReportSearchComponent implements OnInit, AfterViewInit {
  @ViewChildren(Focusable) focusables;
  @Output() searching: EventEmitter<boolean> = new EventEmitter<boolean>();

  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private batchReportService: BatchReportService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.buildForm();

    this.activatedRoute.queryParams.subscribe(params => {
      const lote = params['lote'];
      if (lote != null && lote != '') {
        this.form.get('batchCode').setValue(lote);
        this.form.get('refClient').setValue(lote.refClient);
        this.search();
      }
    });
  }

  buildForm() {
    this.form = this.formBuilder.group({
      'batchCode': ['', Validators.required],
      'refClient': ['', Validators.required],
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

    if (!(this.form.controls['batchCode'].valid || this.form.controls['refClient'].valid)) {
      return;
    }

    return this.batchReportService
      .search(this.form.value.batchCode, this.form.value.refClient)
      .then(()=>{
        this.searching.emit(true)
      });
  }

  get loading() {
    return this.batchReportService.loading;
  }

}
