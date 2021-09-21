import { Component, EventEmitter, Input, OnInit, OnDestroy, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorHandler } from './../../shared/errors/error-handler';
import { Notification } from './../../shared/notification/notification';
import { Subscription } from 'rxjs/Rx';
import { NumberHelper } from './../../shared/globalization/number-helper';
import { ServiceInstruction } from '../service-instruction';
import { ServiceInstructionService } from '../service-instruction.service';
import { SampleTracking } from '../../sample-tracking/sample-tracking';
import { SampleTrackingService } from '../../sample-tracking/sample-tracking.service';
import { MarkupGroup } from '../../markup-group/markup-group';
import { MarkupGroupType } from '../../markup-group/markup-group-type';
import { MarkupGroupService } from '../../markup-group/markup-group.service';
import { Batch } from '../../batch/batch';
import { MarkupGroupBatch } from '../../markup-group/batch/markup-group-batch';
import { ServiceInstructionTypePurpose } from '../../service-instruction-type/service-instruction-type-purpose';
import { Masks } from '../../shared/forms/masks/masks';
import { ServiceInstructionStatus } from '../service-instruction-status';

@Component({
  selector: 'app-service-instruction-sample-tracking',
  templateUrl: './service-instruction-sample-tracking.component.html'
})
export class ServiceInstructionSampleTrackingComponent implements OnInit, OnDestroy {
  @Input() serviceInstruction: ServiceInstruction;
  form: FormGroup;
  sampleTrackings: Array<SampleTracking> = [];
  sampleTrackingSubscription: Subscription;
  //batchs: Array<MarkupGroupBatch> = [];
  loading: boolean = false;
  decimalMask = Masks.decimalMask;

  get editing() {
    return !!this.serviceInstruction && !!this.serviceInstruction.id;
  }

  constructor(
    private route: ActivatedRoute,
    private errorHandler: ErrorHandler,
    private formBuilder: FormBuilder,
    private serviceInstructionService: ServiceInstructionService,
    private markupGroupService: MarkupGroupService,
    private sampleTrackingService: SampleTrackingService
  ) { }

  ngOnInit() {
    Notification.clearErrors();

    this.route.data.forEach(
      (data: { serviceInstruction: ServiceInstruction }) => {
        this.serviceInstruction = data.serviceInstruction;
        this.buildForm();
        this.sampleTrackingService.list().then(sampleTrackings => {
          this.sampleTrackings = sampleTrackings;
        }).catch(error => this.handleError(error));
      });
  }

  ngOnDestroy() {
    if (this.sampleTrackingSubscription && !this.sampleTrackingSubscription.closed) {
      this.sampleTrackingSubscription.unsubscribe();
    }
  }

  buildForm() {
    this.form = this.formBuilder.group({
      /*sampleTrackingId: [
        {
          value: this.serviceInstruction.sampleTracking
            ? this.serviceInstruction.sampleTracking.id
            : '',
          disabled: !this.isNewOrOpened
        },
        [Validators.required]
      ],
      sampleTrackingCode: [
        this.serviceInstruction.sampleTracking
          ? this.serviceInstruction.sampleTracking.code
          : '',
      ]*/
    });
    if (this.isNewOrOpened) {
      this.sampleTrackingSubscription = this.form.get('sampleTrackingId')
        .valueChanges.subscribe((sampleTrackingId) => {
          this.loadBatchs(sampleTrackingId);
        });
    }
  }

  get isRebenefit() {
    return this.serviceInstruction
      && this.serviceInstruction.type
      && this.serviceInstruction.type.purposeObject
      && (
        this.serviceInstruction.type.purposeObject.code === ServiceInstructionTypePurpose.REBENEFIT.code ||
        this.serviceInstruction.type.purposeObject.code === ServiceInstructionTypePurpose.FUSION.code
      );
  }

  get isBatchInQuantityEditable() {
    return this.isRebenefit && this.isNewOrOpened;
  }

  loadBatchs(sampleTrackingId) {
    // debugger;
    this.loading = true;

    let sampleTrackingSelected = this.sampleTrackings
      .find(sampleTracking => sampleTracking.id === sampleTrackingId);
    if (!sampleTrackingSelected) {
      //this.serviceInstruction.sampleTracking = null;
      this.serviceInstruction.markupGroup = null;
      this.loading = false;
      return;
    }

    //this.serviceInstruction.sampleTracking = sampleTrackingSelected;

    /*this.serviceInstructionService.findMarkupGroup(
      this.serviceInstruction.id, this.serviceInstruction.sampleTracking.id)
      .then((markupGroup: MarkupGroup) => {
        this.serviceInstruction.markupGroup = markupGroup;
      });*/

    this.loading = false;
  }

  handleError(error) {
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }

  get sumSacksOut() {
    let value = 0;
    //if (this.serviceInstruction
    // && this.serviceInstruction.batchesIn) {
    //  value = this.serviceInstruction.batchesIn
    //    .map(bi => bi.quantity)
    //    .reduce((a, b) => a + b, 0);
    //}
    //this.serviceInstruction.sacksQuantity = value;
    return NumberHelper.toPTBR(value);
  }

  get isNewOrOpened() {
    return (this.serviceInstruction
      && (!this.serviceInstruction.status
        || (this.serviceInstruction.status === ServiceInstructionStatus.OPENED.code)));
  }
}
