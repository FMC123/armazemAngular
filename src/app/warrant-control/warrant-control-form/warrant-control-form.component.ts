import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder} from "@angular/forms/src/form_builder";
import {FormGroup} from "@angular/forms/src/model";
import {Masks} from "../../shared/forms/masks/masks";
import {ActivatedRoute, Router} from "@angular/router";
import {RouterHelperService} from "../../shared/router-helper/router-helper.service";
import {DateTimeHelper, NumberHelper} from "../../shared/globalization";
import {Validators} from "@angular/forms/src/validators";
import {WarehouseStakeholderAutocomplete} from "../../warehouse-stakeholder/warehouse-stakeholder-autocomplete";
import {WarehouseStakeholderService} from "../../warehouse-stakeholder/warehouse-stakeholder.service";
import {ErrorHandler} from '../../shared/errors/error-handler';
import {PackTypeService} from "../../pack-type/pack-type.service";
import {ServiceItemAutocomplete} from "../../service-item/service-item-autocomplete";
import {ServiceItemService} from "../../service-item/service-item.service";
import {PackType} from "../../pack-type/pack-type";
import {AuthService} from "../../auth/auth.service";
import {WarrantData} from "../warrant-data";
import {Retention} from "../retention";
import {RetentionService} from "../retention.service";
import {Notification} from "../../shared/notification";
import {BatchService} from "../../batch/batch.service";
import {RetentionBatch} from "../retention-batch";
import {WarehouseStakeholder} from "../../warehouse-stakeholder/warehouse-stakeholder";
import {RetentionStatus} from "../retention-status";

@Component({
  selector: 'app-warrant-control-form',
  templateUrl: './warrant-control-form.component.html',
})
export class WarrantControlFormComponent implements OnInit, OnDestroy{

  id:string;

  loading:boolean=false;
  editing:boolean = false;
  form:FormGroup;
  dateMask = Masks.dateMask;
  decimalMask = Masks.decimalMask;
  integerMask = Masks.integerMask;
  ownerAutocomplete:WarehouseStakeholderAutocomplete;

  storageAutocomplete: ServiceItemAutocomplete;
  insuranceAutocomplete: ServiceItemAutocomplete;
  expeditionAutocomplete: ServiceItemAutocomplete;
  warrantAutoComplete: ServiceItemAutocomplete;
  warrantData:WarrantData;
  retention:Retention;

  packTypes:PackType[] = [];
  retentionBatches:RetentionBatch[] = [];

  sub: any;
  params: any;
  client:WarehouseStakeholder;

  status:RetentionStatus[]= [RetentionStatus.ACTIVE,RetentionStatus.INACTIVE];

  constructor(
    private router: Router,
    private routerHelper: RouterHelperService,
    private formBuilder:FormBuilder,
    private errorHandler:ErrorHandler,
    private itemService: ServiceItemService,
    private packTypeService:PackTypeService,
    private serviceItemService:ServiceItemService,
    private ownerService: WarehouseStakeholderService,
    private activatedRoute: ActivatedRoute,
    private batch: BatchService,
    private auth:AuthService,
    private retentionService: RetentionService,
  ) { }

  ngOnInit() {
    this.loading = true;

    this.warrantData = new WarrantData();
    this.retention = new Retention();

    this.storageAutocomplete = new ServiceItemAutocomplete();
    this.insuranceAutocomplete = new ServiceItemAutocomplete();
    this.expeditionAutocomplete = new ServiceItemAutocomplete();
    this.ownerAutocomplete = new WarehouseStakeholderAutocomplete(this.ownerService, this.errorHandler);

    this.itemService.list().then(res=>{
      this.storageAutocomplete.setItems(res);
      this.insuranceAutocomplete.setItems(res);
      this.expeditionAutocomplete.setItems(res);
    })

    this.packTypeService.list()
      .then(packTypes=>{
      this.packTypes = packTypes;
    })

    this.activatedRoute.params.subscribe(data=> this.params = data);
    if(this.params && this.params.id){
      this.editing = true;
      this.retentionService.find(this.params.id).then(res=>{
        this.retention = Retention.fromData(res);
        this.warrantData = WarrantData.fromData(res.warrantData);
        this.buildForm();
      }).catch(err=>this.errorHandler.fromServer(err));
    } else if(this.params && this.params.client_id) {
        this.ownerService.find(this.params.client_id).then(res=>{
          this.client = res;
          this.buildForm();
        })
    } else {
      this.buildForm();
    }

  }

  buildForm(){
    this.form = this.formBuilder.group({
      code: [this.retention.code || '',[]],
      client: ['',[Validators.required]],
      emissionDate: [this.warrantData.emissionDate?
        DateTimeHelper.toDDMMYYYY(this.warrantData.emissionDate): '' ,[Validators.required]],
      expires: [this.warrantData.expires?
        DateTimeHelper.toDDMMYYYY(this.warrantData.expires): '' || '',[Validators.required]],
      packType: ['',[Validators.required]],
      storageService: ['',[Validators.required]],
      insuranceService: ['',[Validators.required]],
      expeditionService: ['',[Validators.required]],
      endorsementText: [this.warrantData.endorsementText || '',[Validators.required]],
      sacksQuantity: [this.retention.sacksQuantity || '',[Validators.required,Validators.maxLength(12)]],
      retentionQuantity: [this.retention.quantity?
        NumberHelper.toPTBR(this.retention.quantity) : '',
        [Validators.required,Validators.maxLength(12)]],
      retentionStatus: ['',[Validators.required]],
    });

    this.storageAutocomplete.valueChange.subscribe(value=> {
      this.form.get('storageService').setValue(value)
    });
    this.insuranceAutocomplete.valueChange.subscribe(value=> {
      this.form.get('insuranceService').setValue(value)
    });

    this.expeditionAutocomplete.valueChange.subscribe(value=> {
      this.form.get('expeditionService').setValue(value)
    });
    this.ownerAutocomplete.valueChange.subscribe(value=> {
      this.form.get('client').setValue(value)
    });
    if(this.warrantData.storageService){
      this.storageAutocomplete.value = this.warrantData.storageService;
    }
    if(this.warrantData.expeditionService){
      this.expeditionAutocomplete.value = this.warrantData.expeditionService;
    }
    if(this.warrantData.insuranceService){
      this.insuranceAutocomplete.value = this.warrantData.insuranceService;
    }
    if(this.client){
      this.ownerAutocomplete.value = this.client;
    }
    if(this.retention.client){
      this.ownerAutocomplete.value = this.retention.client;
      this.client = this.retention.client;
    }
    if(this.retention.status){
      this.form.get('retentionStatus').setValue(RetentionStatus.fromData(this.retention.status).index);
    }
    if(this.warrantData.packType){
      this.form.get('packType').setValue(this.warrantData.packType.id);
    }
    if(this.retention.retentionBatches && this.retention.retentionBatches.length > 0){
      this.retentionBatches = this.retention.retentionBatches;
      this.handleQuantitySacksChange();
    }
    if(this.warrantData.useExpiresExtension){
      this.form.get('expires').setValue(DateTimeHelper.toDDMMYYYY(this.warrantData.expiresExtension));
      this.form.controls['expires'].disable();
    }
    this.loading = false;
  }


  ngOnDestroy(){
    this.storageAutocomplete.valueChange.unsubscribe();
    this.insuranceAutocomplete.valueChange.unsubscribe();
    this.expeditionAutocomplete.valueChange.unsubscribe();
    this.ownerAutocomplete.valueChange.unsubscribe();
  }

  setQuantity(value:number){
    this.form.get('retentionQuantity').setValue(NumberHelper.toPTBR(value));
  }

  getTotalWeight():string{
    let total: number = 0;
    if (this.retentionBatches != null && this.retentionBatches.length > 0) {
      this.retentionBatches.forEach((batch:RetentionBatch) => {
        total = Number(total) + Number((batch.quantity || 0));
      });
    }

    return NumberHelper.toPTBR(total);
  }

  getTotalSacks():number{
    let total: number = 0;
    if (this.retentionBatches != null && this.retentionBatches.length > 0) {
      this.retentionBatches.forEach((batch:RetentionBatch) => {
        total = Number(total) + Number((batch.sacksQuantity || 0));
      });

      return total;
    }
    return 0;
  }

  handleQuantitySacksChange() {
    if (this.retentionBatches && this.retentionBatches.length > 0) {
      this.form.get('retentionQuantity').setValue(this.getTotalWeight() || 0);
      this.form.get('sacksQuantity').setValue(this.getTotalSacks() || 0);
      this.form.controls['retentionQuantity'].disable();
      this.form.controls['sacksQuantity'].disable();
    } else{
      this.form.controls['retentionQuantity'].enable();
      this.form.controls['sacksQuantity'].enable();
    }
  }


  save(){
    Object.keys(this.form.controls).forEach(key => {
      this.form.controls[key].markAsDirty();
    });

    if(!this.form.valid){
      return;
    }
    this.loading = true;


    let packTypeObj:PackType;
    let packTypeIndex = this.packTypes.findIndex(item=> item.id === this.form.value.packType);

    if(packTypeIndex >= 0) {
      packTypeObj = this.packTypes[packTypeIndex];
    }

    this.warrantData.endorsementText = this.form.value.endorsementText;
    this.retention.code = this.form.value.code;
    this.warrantData.packType = packTypeObj;
    this.warrantData.storageService = this.form.value.storageService;
    this.warrantData.insuranceService = this.form.value.insuranceService;
    this.warrantData.expeditionService = this.form.value.expeditionService;
    this.warrantData.emissionDate = DateTimeHelper.fromDDMMYYYY(this.form.value.emissionDate);

    if(!this.warrantData.useExpiresExtension){
      this.warrantData.expires = DateTimeHelper.fromDDMMYYYY(this.form.value.expires);
      if(this.warrantData.expires < this.warrantData.emissionDate){
        this.form.controls['expires'].setErrors({invalid:true});
        this.loading = false;
        return;
      }
    } else {
      if(this.warrantData.expiresExtension < this.warrantData.emissionDate){
        this.form.controls['emissionDate'].setErrors({invalid:true});
        this.loading = false;
        return;
      }
    }

    this.retention.retentionBatches = this.retentionBatches;

    this.retention.client = this.form.value.client;
    this.retention.warrantData = this.warrantData;
    this.retention.status = this.form.value.retentionStatus;

    if(this.retentionBatches && this.retentionBatches.length > 0){
      this.retention.quantity = NumberHelper.fromPTBR(this.getTotalWeight() || "0");
      this.retention.sacksQuantity = this.getTotalSacks() || 0;
    } else {
      this.retention.quantity =  NumberHelper.fromPTBR(this.form.value.retentionQuantity);
      this.retention.sacksQuantity = this.form.value.sacksQuantity;
      this.retention.retentionBatches = [];
    }

    this.retentionService.save(this.retention).then(()=>{
       Notification.success(this.retention.id? "Warrant editado com sucesso!":"Warrant criado com sucesso!");
       this.router.navigate(['warrant-control',this.retention.client.id]);
       this.loading = false
     }).catch(err=> {
       this.loading = false;
       this.errorHandler.fromServer(err)
     });

    this.loading = false;

  }

  cancel(){
    if(this.form.value.client && this.form.value.client.id){
      this.router.navigate(['warrant-control',this.form.value.client.id]);
    } else {
      this.router.navigate(['warrant-control']);
    }
  }

}
