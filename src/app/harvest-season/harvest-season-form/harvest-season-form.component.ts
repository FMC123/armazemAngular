import {Component, OnInit, ViewChild} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';

import {Notification} from './../../shared/notification/notification';
import {Warehouse} from '../../warehouse/warehouse';
import {HarvestSeason} from '../harvest-season';
import {HarvestSeasonService} from '../harvest-season.service';
import {WarehouseService} from '../../warehouse/warehouse.service';
import {Masks} from "../../shared/forms/masks/masks";


@Component({
  selector: 'harvest-season-form',
  templateUrl: './harvest-season-form.component.html'
})
export class HarvestSeasonFormComponent implements OnInit {

  warehouses: Array<Warehouse>;
  harvestSeason: HarvestSeason;
  form: FormGroup;
  loading: boolean = false;
  dateMask = Masks.dateMask;

  submitted: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private harvestSeasonService: HarvestSeasonService,
    private warehouseService: WarehouseService
  ) {
  }

  ngOnInit() {
    this.harvestSeason = new HarvestSeason();
    Notification.clearErrors();
    this.route.data.forEach((data: { harvestSeason: HarvestSeason }) => {
      this.harvestSeason = HarvestSeason.fromData(data.harvestSeason);
    });
    this.buildForm();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      'identifier': [this.harvestSeason.identifier || '', [Validators.required]],
      'initialDate': [this.harvestSeason.initialDateString, [Validators.required]],
      'finalDate': [this.harvestSeason.finalDateString, [Validators.required]],
    });
  }

  save() {
    this.submitted = true;
    Object.keys(this.form.controls).forEach((key) => {

      this.form.controls[key].markAsDirty();
    });
    if (!this.form.valid) {
      return;
    }

    this.harvestSeason.identifier = this.form.value.identifier;
    this.harvestSeason.initialDateString = this.form.value.initialDate;
    this.harvestSeason.finalDateString = this.form.value.finalDate;

    if(this.harvestSeason.initialDate>this.harvestSeason.finalDate){
      Notification.error('A data inicial deve ser menor que a data final');
      return;
    }

    this.loading = true;
    this.harvestSeasonService.save(this.harvestSeason).then((harvestSeason) => {
      Notification.success('Salvo com sucesso!');
      this.loading = false;
      this.router.navigate(['/harvest-season']);
    }).catch(() => this.loading = false);
  }


}
