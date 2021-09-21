import { ErrorHandler } from '../../../shared/errors/error-handler';
import { Notification } from '../../../shared/notification';
import { Warehouse } from '../../../warehouse/warehouse';
import { WarehouseService } from '../../../warehouse/warehouse.service';
import { Equipament } from '../../equipament';
import { EquipamentTypeFunction } from '../../equipament-type-function/equipament-type-function';
import { EquipamentTypeFunctionService } from '../../equipament-type-function/equipament-type-function.service';
import { EquipamentTag } from '../equipament-tag';
import { EquipamentTagService } from '../equipament-tag.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-equipament-tag-form',
  templateUrl: './equipament-tag-form.component.html'
})
export class EquipamentTagFormComponent implements OnInit {
  equipament: Equipament;
  equipamentTag: EquipamentTag;
  form: FormGroup;
  loading: boolean = false;
  typeFunctions: Array<EquipamentTypeFunction> = [];
  warehouses: Array<Warehouse> = [];

  get editing(){
    return !!this.equipamentTag && !!this.equipamentTag.id;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private equipamentTagService: EquipamentTagService,
    private equipamentTypeFunctionService: EquipamentTypeFunctionService,
    private warehouseService: WarehouseService,
    private errorHandler: ErrorHandler
  ) { }

  ngOnInit() {
    Notification.clearErrors();

    this.warehouseService.list().then(warehouses => {
      this.warehouses = warehouses;
    }).catch(error => this.handleError(error))

    this.route.data.forEach((data: {equipamentTag: EquipamentTag}) => {
      this.equipament = data.equipamentTag.equipament;
      this.equipamentTag = data.equipamentTag;

      this.equipamentTypeFunctionService.list(this.equipament.type.id).then(typeFunctions => {
        this.typeFunctions = typeFunctions;
      }).catch(error => this.handleError(error));

      this.buildForm();
    });
  }

  buildForm() {
    this.form = this.formBuilder.group({
      'code': [this.equipamentTag.code || '', Validators.required],
      'typeFunctionId': [this.equipamentTag.equipamentTypeFunction ? this.equipamentTag.equipamentTypeFunction.id : '' || '', [ Validators.required ]],
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

    this.equipamentTag.code = this.form.value.code;
    this.equipamentTag.equipamentTypeFunction = new EquipamentTypeFunction(this.form.value.typeFunctionId);
    this.equipamentTag.warehouse = this.equipament.warehouse;
    this.equipamentTag.equipament = this.equipament;
    return this.equipamentTagService.save(this.equipamentTag).then(() => {
      Notification.success('Tag salva com sucesso!');
      this.router.navigate(['/equipament', this.equipament.id]);
    }).catch((error) => this.handleError(error));
  }

  handleError(error) {
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }

}
