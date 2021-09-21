import { Component, OnInit, OnDestroy } from '@angular/core';
import { Masks } from '../../shared/forms/masks/masks';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms/src/validators';
import { Logger } from '../../shared/logger/logger';
import { IndicationSpecialCoffeService } from '../indication-special-coffee.service';
import { Page } from '../../shared/page/page';
import { IndicationSpecialCoffee } from '../indication-special-coffee';
import { Search } from '../../shared/search/search';
import { ErrorHandler } from '../../shared/errors/error-handler';
import { IndicationSpecialCoffeeChannel } from '../indication-special-coffee-channel';
import { IndicationSpecialCoffeeSituation } from '../indication-special-coffee-situation';

@Component({
    selector: 'app-indication-special-coffee-find',
    templateUrl: './indication-special-coffee-find.component.html'
})

export class IndicationSpecialCoffeeFindComponent implements OnInit, OnDestroy {
    dateMask: any = Masks.dateMask;
    form: FormGroup;
    loading: boolean = false;
    page: Page<IndicationSpecialCoffee> = new Page<IndicationSpecialCoffee>();
    search: Search = new Search();
    error: boolean;
    channels = IndicationSpecialCoffeeChannel.list();
    situations = IndicationSpecialCoffeeSituation.list();

    ngOnInit() {
        this.buildForm();
        this.loadList();
        this.page.changeQuery.subscribe(() => {
            this.loadList();
        });
    }

    constructor(
        private formBuilder: FormBuilder,
        private errorHandler: ErrorHandler,
        private logger: Logger,
        private indicationSpecialCoffeService: IndicationSpecialCoffeService
    ) { }

    buildForm() {
        this.form = this.formBuilder.group({
            'createdDateStartString': [
                '',
                [Validators.required],
            ],
            'createdDateEndString': [
                '',
                [Validators.required],
            ]
        });
    }

    loadList() {
        this.loading = true;
        this.indicationSpecialCoffeService.listPaged(this.search.value, this.page).then(() => {
            this.loading = false;
        }).catch(error => this.handleError(error));
    }

    ngOnDestroy() {
        this.page.changeQuery.unsubscribe();
    }

    handleError(error) {
        this.error = true;
        this.loading = false;
        return this.errorHandler.fromServer(error);
    }
}