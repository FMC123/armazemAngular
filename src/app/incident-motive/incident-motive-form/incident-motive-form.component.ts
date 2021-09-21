import { Masks } from '../../shared/forms/masks/masks';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Notification } from '../../shared/notification/notification';
import { Warehouse } from '../../warehouse/warehouse';
import { WarehouseService } from '../../warehouse/warehouse.service';
import { DrinkService } from 'app/drink/drink.service';
import { Drink } from 'app/drink/drink';
import { IncidentMotiveService } from '../incident-motive.service';
import { IncidentMotive } from '../incident-motive';
import { IncidentMotiveType } from '../incident-motive-type';


@Component({
    selector: 'incident-motive-form',
    templateUrl: './incident-motive-form.component.html'
})
export class IncidentMotiveFormComponent implements OnInit {

    warehouses: Array<Warehouse>;
    incidentMotive: IncidentMotive;
    listType: Array<IncidentMotiveType> = [];
    form: FormGroup;
    loading: boolean = false;
    integerMask = Masks.integerMask;

    submitted: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private formBuilder: FormBuilder,
        private incidentMotiveService: IncidentMotiveService,
        private warehouseService: WarehouseService
    ) { }

    ngOnInit() {
        Notification.clearErrors();
        this.route.data.forEach((data: { incidentMotive: IncidentMotive }) => {
            this.incidentMotive = data.incidentMotive || new IncidentMotive();
            this.listType = IncidentMotiveType.list();
        });
        this.buildForm();
    }

    buildForm() {
        this.form = this.formBuilder.group({
            'code': [this.incidentMotive.code || '', [Validators.required]],
            'description': [this.incidentMotive.description || '', [Validators.required]],
            'selectedType': [this.incidentMotive.type || '', [Validators.required]]
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

        this.incidentMotive.code = this.form.value.code;
        this.incidentMotive.description = this.form.value.description;
        this.incidentMotive.type = this.form.value.selectedType;
        this.incidentMotiveService.save(this.incidentMotive).then((incidentMotive) => {
            Notification.success('Salvo com sucesso!');
            this.router.navigate(['/motive-control']);
        }).catch(() => this.loading = false);
    }



}
