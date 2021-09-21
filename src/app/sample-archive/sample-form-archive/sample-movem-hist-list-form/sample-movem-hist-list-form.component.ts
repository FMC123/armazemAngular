import { Component, OnInit,Input } from '@angular/core';
import {
	FormBuilder,
	FormGroup,
	Validators
} from '@angular/forms';
import { ModalManager } from '../../../shared/modals/modal-manager';
import { Notification } from '../../../shared/notification';
import { ErrorHandler } from '../../../shared/errors/error-handler';
import {SampleMovementHistoryService} from "../../../sample/sample-movement-history/sample-movement-history.service";
import {Sample} from "../../../sample/sample";
import {SampleMovementHistory} from "../../../sample/sample-movement-history";
import {Department} from "../../../department/department";
import {DepartmentService} from "../../../department/department.service";
import {Masks} from "../../../shared/forms/masks/masks";
import {SampleMovementType} from "../../../sample/sample-movement-type";

@Component({
	selector: 'app-sample-movem-hist-list-form',
	templateUrl: 'sample-movem-hist-list-form.component.html'
})
export class SampleMovemHistListFormComponent implements OnInit {
	closeConfirm = new ModalManager();
  error: boolean;
	form: FormGroup;
  loading = false;
  @Input() sample: Sample;
  data: SampleMovementHistory[];
  sampleMovementHistory: SampleMovementHistory = new SampleMovementHistory();
  departments: Department[];
  dateMask: any = Masks.dateMask;
  sampleRequest = SampleMovementType.SAMPLE_REQUEST;
  sampleReceived = SampleMovementType.SAMPLE_RECEIVED;
  withdraw = SampleMovementType.WITHDRAW;

	constructor(
		private formBuilder: FormBuilder,
        private service: SampleMovementHistoryService,
        private departmentService: DepartmentService,
        private errorHandler: ErrorHandler,
	) {}

	ngOnInit() {
		Notification.clearErrors();

    this.departmentService.list()
      .then(departments => {
        this.departments = departments;
      })
      .catch(error => this.errorHandler.fromServer(error));

    this.listData();

		this.buildForm();
	}

	listData(){
    this.service.listSampleMovementsNotConclude(this.sample.id)
      .then(data => {
        this.data = data
      });
  }

	buildForm() {
		this.form = this.formBuilder.group({
			departmentId: [
				this.sampleMovementHistory.departmentRequestBy ? this.sampleMovementHistory.departmentRequestBy.id || '' : '',
				[Validators.required]
			],
      movementDate: [
        this.sampleMovementHistory.movementDate ? this.sampleMovementHistory.movementDateString || '' : '',
				[Validators.required]
			]
		});
	}

	beforeRemove(sampleMovementHistory: SampleMovementHistory) {
		this.sampleMovementHistory = sampleMovementHistory;
		this.closeConfirm.open(null);
	}

	remove() {
		this.loading = true;
		this.service.removeSample(this.sampleMovementHistory)
		.then( () => {
      Notification.success('Solicitação de amostra removida com sucesso!');
			this.fillSampleMovementHistoryEmpty()
      this.listData();
			this.buildForm();
			this.loading = false;
		})
		.catch(error => this.handleError(error))
	}

	save() {
		Object.keys(this.form.controls).forEach(key => {
			this.form.controls[key].markAsDirty();
		});

		if (!this.form.valid) {
			return;
		}

		this.loading = true;

    this.fillSampleMovementHistoryEmpty()

		this.sampleMovementHistory.departmentRequestBy = new Department(this.form.value.departmentId);
    this.sampleMovementHistory.movementDateString = this.form.get('movementDate').value;
    this.sampleMovementHistory.sample = this.sample;

    this.requestSample(this.sampleMovementHistory);
  }

	fillSampleMovementHistoryEmpty() {
		this.sampleMovementHistory = new SampleMovementHistory();
	}

  requestSample(sampleMovementHistory:any) {
    this.loading = true;
    return this.service.requestSample(sampleMovementHistory)
      .then(() => {
        Notification.success('Solicitação de amostra realizada com sucesso!');
        this.loading = false;
        this.fillSampleMovementHistoryEmpty()
        this.listData();
        this.buildForm();
      })
      .catch(error => this.handleError(error));
  }

  sendSample(sampleMovementHistory:any) {
    this.loading = true;
    return this.service.sendSample(sampleMovementHistory)
      .then(() => {
        Notification.success('Envio de amostra realizado com sucesso!');
        this.loading = false;
        this.fillSampleMovementHistoryEmpty()
        this.listData();
        this.buildForm();
      })
      .catch(error => this.handleError(error));
  }

  returnSample(sampleMovementHistory:any) {
    this.loading = true;
    return this.service.returnSample(sampleMovementHistory)
      .then(() => {
        Notification.success('Retorno de amostra realizado com sucesso!');
        this.loading = false;
        this.fillSampleMovementHistoryEmpty()
        this.listData();
        this.buildForm();
      })
      .catch(error => this.handleError(error));
  }

  handleError(error) {
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }

}
