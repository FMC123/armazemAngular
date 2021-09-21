import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Masks } from '../../shared/forms/masks/masks';
import { FormGroup, FormBuilder, ValidatorFn, AbstractControl } from '@angular/forms';
import { Validators } from '@angular/forms/src/validators';
import { Logger } from '../../shared/logger/logger';
import { IndicationSpecialCoffeService } from '../indication-special-coffee.service';
import { Page } from '../../shared/page/page';
import { IndicationSpecialCoffee } from '../indication-special-coffee';
import { Search } from '../../shared/search/search';
import { ErrorHandler } from '../../shared/errors/error-handler';
import { ClassificationItem } from '../../classification/classification-item';
import { ClassificationType } from '../../classification/classification-type';
import { NumberHelper, DateTimeHelper } from '../../shared/globalization';
import { Subscription } from '../../../../node_modules/rxjs';
import { ClassificationService } from '../../classification/classification.service';
import { User } from '../../user/user';
import { UserService } from '../../user/user.service';

import { ActivatedRoute } from '../../../../node_modules/@angular/router';
import { Certificate } from 'crypto';
import { ClassificationVersion } from '../../classification/classification-version';


@Component({
    selector: 'app-indication-special-coffee-detail',
    templateUrl: './indication-special-coffee-detail.component.html'
})

export class IndicationSpecialCoffeeDetailComponent implements OnInit {
    leftColumn: Array<any>;
    itens: Array<ClassificationItem>;
    certificates: Array<Certificate>;
    indication: IndicationSpecialCoffee;
    classificationVersion: ClassificationVersion;
    indicationSpecialCoffee: IndicationSpecialCoffee;

    constructor(
        private route: ActivatedRoute,
        private indicationService: IndicationSpecialCoffeService,
        private classificationService: ClassificationService,
    ) { }

    ngOnInit() {
        this.indicationService.find(this.route.snapshot.params['id']).then(indicationSpecialCoffee => {
            this.indicationSpecialCoffee = indicationSpecialCoffee;
            this.classificationService.findVersion(this.indicationSpecialCoffee.sample.id).then(classificationVersion => {
                this.classificationVersion = classificationVersion;
                this.itens = this.classificationVersion.items;
                this.leftColumn = [
                    ['Lote', this.classificationVersion.sample.batchCodes],
                    [
                        'Cooperado',
                        this.classificationVersion && this.classificationVersion.sample
                        && this.classificationVersion.sample.batches && this.classificationVersion.sample.batches.length ?
                            this.classificationVersion.sample.batches[0].batchOperation.collaborator.person.name : ''
                    ],
                    ['Sacas', this.classificationVersion.sample.sacks],

                    ['Versão', this.classificationVersion.version],
                    [
                        'Data de Classificação',
                        this.classificationVersion.classificationDateString
                    ],
                    ['Classificador', this.classificationVersion.classifiedBy.name],
                    ['Provador', this.classificationVersion.tastedBy.name],
                    ['Reprovador 1', this.classificationVersion.tastedAgain1By.name],
                    ['Reprovador 2', this.classificationVersion.tastedAgain2By.name],
                    ['Observação', this.classificationVersion.observation]
                ];
            });
        });
    }
}