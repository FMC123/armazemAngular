import { WarehouseService } from '../../warehouse/warehouse.service';
import { Warehouse } from '../../warehouse/warehouse';
import { EquipamentType } from '../equipament-type/equipament-type';
import { EquipamentTypeService } from '../equipament-type/equipament-type.service';
import { ErrorHandler } from './../../shared/errors/error-handler';
import { Notification } from './../../shared/notification/notification';
import { Equipament } from './../equipament';
import { EquipamentService } from './../equipament.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-equipament-form',
  templateUrl: './equipament-form.component.html'
})
export class EquipamentFormComponent implements OnInit {
  equipament: Equipament;
  form: FormGroup;
  loading: boolean = false;
  types: Array<EquipamentType> = [];
  warehouses: Array<Warehouse> = [];

  get editing(){
    return !!this.equipament && !!this.equipament.id;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private equipamentService: EquipamentService,
    private equipamentTypeService: EquipamentTypeService,
    private warehouseService: WarehouseService,
    private errorHandler: ErrorHandler
  ) { }

  ngOnInit() {
    Notification.clearErrors();

    this.equipamentTypeService.list().then(types => {
      this.types = types;
    }).catch(error => this.handleError(error));

    this.warehouseService.list().then(warehouses => {
      this.warehouses = warehouses;
    }).catch(error => this.handleError(error));

    this.route.data.forEach((data: {equipament: Equipament}) => {
      this.equipament = data.equipament;
      this.buildForm();
    });
  }

  buildForm() {
    this.form = this.formBuilder.group({
      'code': [this.equipament.code || '', Validators.required],
      'description': [this.equipament.description || '', [ Validators.required ]],
      'typeId': [this.equipament.type ? this.equipament.type.id : '' || '', [ Validators.required ]],
      'warehouseId': [this.equipament.warehouse ? this.equipament.warehouse.id : '' || '', [ Validators.required ]],
    });
  }

  save() {
    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
    });

    if (!this.form.valid) {
      return;
    }

    this.loading = true;

    this.equipament.code = this.form.value.code;
    this.equipament.description = this.form.value.description;
    this.equipament.type = new EquipamentType(this.form.value.typeId);
    this.equipament.warehouse = new Warehouse(this.form.value.warehouseId);

    return this.equipamentService.save(this.equipament).then(() => {
      Notification.success('Equipamento salvo com sucesso!');
      this.router.navigate(['/equipament']);
    }).catch((error) => this.handleError(error));
  }

  handleError(error) {
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }

}
