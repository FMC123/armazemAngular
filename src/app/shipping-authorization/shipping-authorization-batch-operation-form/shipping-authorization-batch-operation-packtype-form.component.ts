import {Component, Input, OnDestroy, OnInit} from "@angular/core";
import {Notification} from "../../shared/notification";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PackTypeService} from "../../pack-type/pack-type.service";
import {PackType} from "../../pack-type/pack-type";
import {ErrorHandler} from "../../shared/errors/error-handler";
import {Masks} from "../../shared/forms/masks/masks";
import {NumberHelper} from "../../shared/globalization";
import {CustomValidators} from "../../shared/forms/validators/custom-validators";
import {ShippingDataPackType} from "../../shipping-data/pack-type/shipping-data-pack-type";
import {ShippingAuthorization} from "../shipping-authorization";
import {ShippingData} from "../../shipping-data/shipping-data";

@Component({
  selector: 'app-shipping-authorization-batch-operation-packtype-form',
  templateUrl: './shipping-authorization-batch-operation-packtype-form.component.html'
})
export class ShippingAuthorizationBatchOperationPacktypeFormComponent implements OnInit, OnDestroy {
  @Input() shippingData: ShippingData;
  @Input() submitted = false;
  form: FormGroup;
  packTypeList: Array<PackType>;
  loading: boolean = false;
  decimalMask = Masks.decimalMask;
  // TODO: this is a temporary model
  packList: Array<ShippingDataPackType>
  packEditing: ShippingDataPackType = null;

  constructor(
    private formBuilder: FormBuilder,
    private packTypeService: PackTypeService,
    private errorHandler: ErrorHandler
  ) { }

  ngOnInit() {
    Notification.clearErrors();
    this.loading = true;

    // TODO: this is a temporaty model
    this.packList = [];

    this.packTypeService.list(['B', 'S', 'G']).then(response => {
      this.packTypeList = response;
      this.buildForm();
      this.loading = false;
    }).catch(error => {
      this.handleError(error);
    })
  }

  ngOnDestroy() {
  }

  buildForm(pack: ShippingDataPackType = null) {
    this.form = this.formBuilder.group({
      'packTypeId': [pack && pack.packType ? pack.packType.id || '' : '', [Validators.required]],
      'quantity': [pack ? pack.quantity || '' : '', [Validators.required, CustomValidators.minValidator(1)]],
      // 'packWeight': [pack ? pack.weightAddition || 0 : 0, [Validators.required, CustomValidators.minValidator(1)]],
      'weightAddition': false,
    });

    // let kg = this.form.get('packWeight').value;
    // this.form.get('packWeight').setValue(NumberHelper.toPTBR(kg));
  }

  save() {
    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
    });

    if (!this.form.valid) {
      return;
    }

    // TODO: this is a temporary model

    let addPack : ShippingDataPackType = {
      packType: this.getPackType(this.form.value.packTypeId),
      quantity: this.form.value.quantity,
      weightAddition: this.form.value.weightAddition,
    }

    if (this.packEditing && this.packEditing.packType.id !== addPack.packType.id) {
      this.remove(this.packEditing);
    }

    let pack = this.data.find(element => element.packType.id === addPack.packType.id);

    if (!pack) {
      this.data.push(addPack)
      this.shippingData.packType = addPack.packType;
    } else {
      pack.quantity = addPack.quantity;
      pack.weightAddition = addPack.weightAddition;
    }

    this.packEditing = null;
    this.buildForm();
  }

  getPackType(id: string) {
    return this.packTypeList.find(element => element.id === id);
  }

  edit(item: ShippingDataPackType) {
    this.packEditing = item;
    this.buildForm(item);
  }

  remove(item: ShippingDataPackType) {
    let index = this.data.findIndex((element) => element.packType.id === item.packType.id);

    if (index === -1) {
      return;
    }

    this.data.splice(index, 1);
  }

  packWeightChanged(event) {
    // let kg = NumberHelper.toPTBR(event.currentTarget.value);
    // this.form.get('packWeight').setValue(kg);
  }

  handleError(error) {
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }

  get data() {
    return this.shippingData.packTypes;
  }
}
