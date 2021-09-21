import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Masks } from './../../shared/forms/masks/masks';
import { ErrorHandler } from './../../shared/errors/error-handler';
import { ModalManager } from './../../shared/modals/modal-manager';
import { AuthService } from './../../auth/auth.service';
import { Warehouse } from './../../warehouse/warehouse';
import { Notification } from './../../shared/notification/notification';
import { PositionService } from "../position.service";
import { Position } from "../position";
import { PositionType } from './../../position/position-type';
import { PositionLayer } from "../../position-layer/position-layer";
import { WarehouseService } from "../../warehouse/warehouse.service";
import { PositionLayerService } from "../../position-layer/position-layer.service";



@Component({
  selector: 'app-position-form',
  templateUrl: './position-form.component.html',
})
export class PositionFormComponent implements OnInit {

  embegadoras: Array<Position>;
  position: Position;
  form: FormGroup;
  loading: boolean = false;
  editing: boolean = false;
  codeChangeAlert: ModalManager = new ModalManager();
  warehouse: Warehouse;
  intergerMask = Masks.integerMask;
  decimalMask = Masks.decimalMask;

  submitted: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private positionService: PositionService,
    private errorHandler: ErrorHandler,
  ) { }

  ngOnInit() {
    Notification.clearErrors();
    this.route.data.forEach((data: { position: Position }) => {
      this.position = data.position;
      this.warehouse = data.position.warehouse;

      this.positionService.listByWarehouseAndType(this.warehouse.id,
        PositionType.EMBEGADORA).then((embegadoras) => {
          this.embegadoras = embegadoras;
        }).catch((error) => this.handleError(error));

      this.buildForm();
    });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      'code': [this.position.code || '', [Validators.required]],
      'yCoordinate': [this.position.yCoordinateString || '0', [Validators.required]],
      'xCoordinate': [this.position.xCoordinateString || '0', [Validators.required]],
      'height': [this.position.heightString || '0', [Validators.required]],
      'width': [this.position.widthString || '0', [Validators.required]],
      'type': [this.position.type || '', [Validators.required]],
      'sortOrder': [this.position.sortOrderString || '0', [Validators.required]],
      'rotation': [this.position.rotationString || '0', [Validators.required]],
      'groupId': [this.position.groupId || '0', [Validators.required]],
      'name': [this.position.name || '', [Validators.required]],
      'embegadoraId': [this.position.embegadora ? this.position.embegadora.id ? this.position.embegadora.id : '' : ''],
      'rfid0id': [this.position.rfidCode0 || '' ],
      'rfid1id': [this.position.rfidCode1 || '' ]
    });
  }

  get disableEmbegadoraId() {
    if(this.form.get('type').value !== 'B'){
      this.form.get('embegadoraId').setValue('');
      return true;
    }
    return false;
  }

  save() {
    this.submitted = true;
    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
    });
    if (!this.form.valid) {
      return;
    }
    this.loading = true;

    this.position.code = this.form.value.code;
    this.position.yCoordinateString = this.form.value.yCoordinate;
    this.position.xCoordinateString = this.form.value.xCoordinate;
    this.position.heightString = this.form.value.height;
    this.position.widthString = this.form.value.width;
    this.position.type = this.form.value.type;
    if (this.form.value.type == 'A') {
      this.position.name = "";
    } else {
      this.position.name = this.form.get('name').value;
    }
    this.position.sortOrderString = this.form.value.sortOrder;
    this.position.rotationString = this.form.value.rotation;
    this.position.groupId = this.form.value.groupId;
    if(!this.position.embegadora){
      this.position.embegadora = new Position();
    }
    this.position.embegadora.id = this.form.value.embegadoraId;
    this.position.rfidCode0 = this.form.value.rfid0id;
    this.position.rfidCode1 = this.form.value.rfid1id;
    this.positionService.save(this.position).then((position) => {
      this.position.id = position.id;
      Notification.success('Posição salva com sucesso!');
      this.router.navigate(['/position-layer/' + this.position.positionLayer.id]);
    }).catch((error) => this.handleError(error));
  }

  private handleCriticalError(error) {
    this.handleError(error).catch(() => {
      this.router.navigate(['/error']);
    });
  }

  private handleError(error) {
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }

}
