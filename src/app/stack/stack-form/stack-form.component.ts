import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


import { ErrorHandler } from './../../shared/errors/error-handler';
import { ModalManager } from './../../shared/modals/modal-manager';

import { Notification } from './../../shared/notification/notification';

import {Stack} from "../stack";
import {StackService} from "../stack.service";
import {Masks} from "../../shared/forms/masks/masks";



@Component({
  selector: 'app-position-form',
  templateUrl: './stack-form.component.html',
})
export class StackFormComponent implements OnInit {

  decimalMask = Masks.decimalMask;
  stack: Stack;
  form: FormGroup;
  loading: boolean = false;
  editing: boolean = false;
  codeChangeAlert: ModalManager = new ModalManager();
  widthSuggestionNumber: number = 10;

  submitted: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private stackService: StackService,
    private errorHandler: ErrorHandler,
  ) { }

  ngOnInit() {

    Notification.clearErrors();
    this.route.data.forEach((data: {stack: Stack}) => {
      this.stack = data.stack;
      this.buildForm();

    });
  }


  private buildForm()
    {   this.form = this.formBuilder.group({
      'code': [this.stack.code || '0'],
      'stackHeight': [this.stack.stackHeight || '0'],
      'yCoord': [this.stack.yCoordString || '0'],
      'xCoord': [this.stack.xCoordString || ''],
      'height': [this.stack.heightString || '0'],
      'width': [this.stack.widthString || null],
      'distance': [this.stack.distanceString || '0'],
      'rotation': [this.stack.rotationString || ''],

    });
    if(!this.stack.id) {
      this.stack.position.isDescriptive ? this.form.get('width').setValue((this.stack.position.name.length / 2) + 4) : this.form.value.width;
    }
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

    // if(this.isDescriptive()){
    //   this.form.get('height').setValue(this.form.value.height === false ? 0 : 1);
    // }
    this.stack.code = this.form.value.code;
    this.stack.stackHeight = this.form.value.stackHeight;
    this.stack.yCoordString = this.form.value.yCoord;
    this.stack.xCoordString = this.form.value.xCoord;
    this.stack.heightString = this.form.value.height;
    this.stack.widthString = this.form.value.width;
    this.stack.distanceString = this.form.value.distance;
    this.stack.rotationString = this.form.value.rotation;
    this.stackService.save(this.stack).then((stack) => {
      this.stack.id = stack.id;
      Notification.success('Pilha salva com sucesso!');
      this.router.navigate(['/position/'+this.stack.position.id]);
    }).catch((error) => this.handleError(error));
  }

  private handleCriticalError(error) {
    this.handleError(error).catch(() => {
      this.router.navigate(['/error']);
    });
  }

  isDescriptive(){
    return this.stack.position.isDescriptive;
  }

  onHeightUpdate(event){
    if(this.isDescriptive()){
      this.form.get('width').setValue(this.widthSuggestion());
    }
  }

  widthSuggestion(){
    let height = parseFloat(this.form.value.height.replace(",","."));
    return height >=1?
      Math.ceil((this.stack.position.name.length*0.6)*(Math.pow(1.5, (height - 1)))) : 0;
  }

  private handleError(error) {
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }

}
