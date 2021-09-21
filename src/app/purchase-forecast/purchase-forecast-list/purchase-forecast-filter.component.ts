import { ErrorHandler } from '../../shared/errors/error-handler';
import { Subscription } from 'rxjs/Rx';
import { WarehouseStakeholderAutocomplete } from '../../warehouse-stakeholder/warehouse-stakeholder-autocomplete';
import { Carrier } from '../../carrier/carrier';
import { CarrierService } from '../../carrier/carrier.service';
import { PurchaseForecastFilter } from './purchase-forecast-filter';
import { WarehouseStakeholder } from '../../warehouse-stakeholder/warehouse-stakeholder';
import { WarehouseStakeholderService } from '../../warehouse-stakeholder/warehouse-stakeholder.service';
import { PackTypeService } from '../../pack-type/pack-type.service';
import { ActivatedRoute } from '@angular/router';
import { Masks } from '../../shared/forms/masks/masks';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
	Component,
	EventEmitter,
	Input,
	OnDestroy,
	OnInit,
	Output,
	ViewChild
} from '@angular/core';
import {WarehouseService} from "../../warehouse/warehouse.service";
import {Warehouse} from "../../warehouse/warehouse";
import {ParameterService} from "../../parameter/parameter.service";
import {AuthService} from "../../auth/auth.service";

@Component({
	selector: 'app-purchase-forecast-filter',
	templateUrl: 'purchase-forecast-filter.component.html'
})
export class PurchaseForecastFilterComponent implements OnInit, OnDestroy {
	@Input() loading: boolean;
	@Output()
	filterChange: EventEmitter<PurchaseForecastFilter> = new EventEmitter<
		PurchaseForecastFilter
	>();

	carriers: Array<Carrier>;

	form: FormGroup;

	filter: PurchaseForecastFilter = new PurchaseForecastFilter();
	dateMask = Masks.dateMask;
	ownerAutocomplete: WarehouseStakeholderAutocomplete;
	ownerSubscription: Subscription;

  warehouses: Array<Warehouse>;
  allowAllWarehouses: boolean = false;

	constructor(
		private formBuilder: FormBuilder,
		private route: ActivatedRoute,
		private carrierService: CarrierService,
		private warehouseStakeholderService: WarehouseStakeholderService,
		private errorHandler: ErrorHandler,
    private warehouseService: WarehouseService,
    private parameterService: ParameterService
	) {}

	ngOnInit() {
	  this.allowAllWarehouses = this.parameterService.purchaseForecastAllWarehouses();

		this.ownerAutocomplete = new WarehouseStakeholderAutocomplete(
			this.warehouseStakeholderService,
			this.errorHandler
		);

		this.carrierService.list().then(carriers => {
			this.carriers = carriers;
		});

    this.warehouseService.list().then(warehouses => {
      this.warehouses = warehouses.filter(w => w.local === true);
    });

		this.buildForm();
	}

	ngOnDestroy() {
		if (this.ownerSubscription != null && !this.ownerSubscription.closed) {
			this.ownerSubscription.unsubscribe();
		}
	}

	buildForm() {
		this.form = this.formBuilder.group({
			status: [''],
			barCode: [''],
			forecastDateStart: [''],
			forecastDateEnd: [''],
			numberCollaborator: [''],
			nameCollaborator: [''],
			carrierId: [''],
      warehouseId: ['']
		});
	}

	submit() {
		Object.keys(this.form.controls).forEach(key => {
			this.form.controls[key].markAsDirty();
		});

		if (!this.form.valid) {
			return;
		}

		this.filter = PurchaseForecastFilter.fromData(this.form.value);
		this.filterChange.emit(this.filter);
	}

  get backLink() {
    let mode = this.route.snapshot.queryParams['mode'];

    if (mode === 'balance') {
      return ['/balance'];
    }

    if (mode === 'lobby') {
      return ['/lobby'];
    }

    return null;
  }
}
