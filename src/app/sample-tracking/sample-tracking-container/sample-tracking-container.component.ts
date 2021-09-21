import { Component, OnInit } from '@angular/core';
import { SampleTrackingBatchesService } from '../sample-tracking-batches.service';
import { Warehouse } from "../../warehouse/warehouse";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SampleTrackingMotive } from "../sample-tracking-motive";
import { SampleTracking } from "../sample-tracking";
import { Notification } from "../../shared/notification";
import { SampleTrackingService } from "../sample-tracking.service";
import { ModalManager } from "../../shared/modals/modal-manager";
import { SampleTrackingStatus } from '../sample-tracking-status';
import { ActivatedRoute } from '@angular/router';
import { ErrorHandler } from './../../shared/errors/error-handler';
import {Sample} from "../../sample/sample";

@Component({
  selector: 'app-sample-tracking-container',
  templateUrl: 'sample-tracking-container.component.html'
})

export class SampleTrackingContainerComponent implements OnInit {

  form: FormGroup;
  loading: boolean = false;
  sampleTracking: SampleTracking = new SampleTracking();
  statusOpened = SampleTrackingStatus.OPENED.code;

  //DEPRECATED CONFIRMAR PARA RETIRAR
  executeConfirm = new ModalManager();

  constructor(
    public batchesService: SampleTrackingBatchesService,
    private sampleTrackingService: SampleTrackingService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private errorHandler: ErrorHandler
  ) {
  }

  ngOnInit() {

    // se tem id nos parâmetros, recupera-o
    this.route.queryParams.subscribe(params => {

      if (params['sampleTracking'] != null) {
        this.loading = true;
        this.sampleTrackingService.find(params['sampleTracking']).then(sampleTracking => {
          this.sampleTracking = sampleTracking;

          // adiciona na lista de amostras selecionadas
          if (this.sampleTracking.markupGroup.samples != null && this.sampleTracking.markupGroup.samples.length > 0) {

            for (let mgs of this.sampleTracking.markupGroup.samples) {
              this.batchesService.addToSelecteds(mgs.sample);
            }
          }

          this.loading = false;
          this.buildForm();

        }).catch(() => {
          this.loading = false;
          this.buildForm();
        });

      }
      else {
        this.buildForm();
      }
    });
  }

  buildForm() {

    if (!this.sampleTracking) {
      this.sampleTracking = new SampleTracking();
    }

    this.form = this.formBuilder.group({
      'code': [this.sampleTracking.code || '', []],
      'label': [this.sampleTracking.label || '', [Validators.required]],
      'reason': [this.sampleTracking.sampleTrackingMotive || '', [Validators.required]],
    });
  }

  save() {

    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
    });

    if (!this.form.valid) {
      return;
    }

    this.sampleTracking.code = this.form.value.code;
    this.sampleTracking.label = this.form.value.label;
    this.sampleTracking.sampleTrackingMotive = this.form.value.reason;

    let allSamples = this.batchesService.selectedSamplesAll();
    this.sampleTracking.samples = [];
    allSamples.forEach(sample => {
      this.sampleTracking.samples.push(sample);
    });

    this.loading = true;
    this.sampleTrackingService.save(this.sampleTracking).then(() => {
      Notification.success('Salvo com sucesso!');
      this.sampleTracking = new SampleTracking();
      this.buildForm();
      this.batchesService.removeAllSelecteds();
      this.batchesService.removeAllResult();
      this.loading = false;
    }).catch(error => this.handleError(error));
  }

  //DEPRECATED CONFIRMAR PARA RETIRAR
  confirm() {

    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
    });

    if (!this.form.valid) {
      return;
    }

    this.sampleTracking.code = this.form.value.code;
    this.sampleTracking.label = this.form.value.label;
    this.sampleTracking.sampleTrackingMotive = this.form.value.reason;

    let allSamples = this.batchesService.selectedSamplesAll();
    this.sampleTracking.samples = [];
    allSamples.forEach(sample => {
      this.sampleTracking.samples.push(sample);
    });

    this.loading = true;
    this.sampleTrackingService.confirm(this.sampleTracking).then(() => {
      Notification.success('Confirmado com sucesso!');
      this.sampleTracking = new SampleTracking();
      this.buildForm();
      this.batchesService.removeAllSelecteds();
      this.batchesService.removeAllResult();
      this.loading = false;
    }).catch(error => this.handleError(error));
  }

  /**
   * Download em PDF
   */
  downloadPDF(samples : Array<Sample>) {
    this.loading = true;

    var batchesId : Array<string> = [];

    for (let sample of samples) {
      for (let batch of sample.batches) {
        batchesId.push(batch.id);
      }
    }

    let blob: Promise<Blob> = this.sampleTrackingService.sampleTrackingReportList(batchesId);
    blob.then((b) => {

      if (b.size === 0) {
        Notification.error('Não foi encontrado informações para abrir o relatório!');
      } else {
        let urlReport = window.URL.createObjectURL(b);
        window.open(urlReport);
      }

      this.loading = false;
    });
  }

  get sampleTrackingMotives() {
    return SampleTrackingMotive.list();
  }

  get resultWarehouses() {
    return this.batchesService.resultWarehouses;
  }

  get selectedWarehouses() {
    return this.batchesService.selectedWarehouses;
  }

  resultSamplesAll() {
    return this.batchesService.resultSamplesAll();
  }

  resultSamples(warehouse: Warehouse) {
    return this.batchesService.resultSamples(warehouse);
  }

  selectedSamples(warehouse: Warehouse) {
    return this.batchesService.selectedSamples(warehouse);
  }

  selectedSamplesAll() {
    return this.batchesService.selectedSamplesAll();
  }

  handleError(error) {
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }
}
