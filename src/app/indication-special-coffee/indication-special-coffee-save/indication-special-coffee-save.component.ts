import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { Observable } from 'rxjs/Observable';
import { ClassificationService } from '../../classification/classification.service';
import { User } from '../../user/user';
import { UserService } from '../../user/user.service';
import { ClassificationVersion } from '../../classification/classification-version';
import { IndicationSpecialCoffeeChannel } from '../indication-special-coffee-channel';
import { SampleService } from '../../sample/sample.service';
import { Data, ActivatedRoute } from '../../../../node_modules/@angular/router';
import { Notification } from '../../shared/notification';
import { Sample } from '../../sample/sample';


@Component({
    selector: 'app-indication-special-coffee-save',
    templateUrl: './indication-special-coffee-save.component.html'
})

export class IndicationSpecialCoffeeSaveComponent implements OnInit {
    dateMask: any = Masks.dateMask;
    form: FormGroup;
    typeSubscription: Subscription;
    sample: Sample;
    classificationVersion: ClassificationVersion;
    unlimitedDecimalMask = Masks.unlimitedDecimalMask;
    users: Array<User> = [];
    loading = false;
    barcodeDatasource: Observable<Array<String>>;
    indicationSpecialCoffee: IndicationSpecialCoffee;
    submitted = false;
    barcodeReadOnly = false;

    constructor(
        private formBuilder: FormBuilder,
        private errorHandler: ErrorHandler,
        private indicationSpecialCoffeService: IndicationSpecialCoffeService,
        private classificationService: ClassificationService,
        private indicationService: IndicationSpecialCoffeService,
        private sampleService: SampleService,
        private route: ActivatedRoute,
        private userService: UserService,
    ) { }

    ngOnInit() {
        this.loadListUsers();
        this.loadClassification();
        this.createIndicationBarCode();
    }

    loadClassification() {
        this.route.data.forEach((data: { id: string }) => {
            if (data.id) {
                this.indicationService.find(data.id).then(indicationSpecialCoffee => {
                    this.indicationSpecialCoffee = indicationSpecialCoffee;
                    this.sample = indicationSpecialCoffee.sample;
                    this.classificationService.findVersion(this.sample.id).then(classificationVersion => {
                        this.classificationVersion = classificationVersion;
                        this.barcodeReadOnly = true;
                        this.buildForm();
                        this.barcodeDatasource = Observable.create((observer: any) => {
                            observer.next(this.form.get('barcode').value);
                        }).mergeMap(token =>
                            Observable.fromPromise(this.sampleService.search(token, true))
                        );
                    });
                });
            }
        });

            const classificationVersion = ClassificationVersion.fromData();
            classificationVersion.items = Array<ClassificationItem>();
            this.classificationVersion = classificationVersion;
            this.buildForm();
    }
    loadListUsers() {
        this.userService
            .list()
            .then(users => {
                this.users = users;
            })
            .catch(error => this.errorHandler.fromServer(error));
    }
    createIndicationBarCode() {
        this.barcodeDatasource = Observable.create((observer: any) => {
            observer.next(this.form.get('indicationBarCode').value);
        }).mergeMap(token =>
            Observable.fromPromise(this.sampleService.search(token, true))
        );
    }

    buildForm() {
        this.form = this.formBuilder.group({
            indicationDate: [
                this.indicationSpecialCoffee ?
                    this.indicationSpecialCoffee.indicationDateString
                    : '',
                [Validators.required, this.dateValidator()]
            ],
            tastedAgain1By: [
                this.classificationVersion &&
                    this.classificationVersion.classifiedBy
                    ? this.classificationVersion.classifiedBy.id || ''
                    : '',
                [Validators.required]
            ],
            tastedAgain2By: [
                this.classificationVersion &&
                    this.classificationVersion.tastedAgain2By
                    ? this.classificationVersion.tastedAgain2By.id || ''
                    : '',
            ],
            tastedAgain3By: [
                this.classificationVersion &&
                    this.classificationVersion.tastedAgain3By
                    ? this.classificationVersion.tastedAgain3By.id || ''
                    : '',
            ],
            barcode: [
                this.sample ?
                    this.sample.barcode :
                    '',

            ],
            channel: [
                this.indicationSpecialCoffee ?
                    this.indicationSpecialCoffee.channel :
                    ''
            ],
            batchCode: [
                this.sample ?
                    this.sample.batchCodes :
                    ''
            ],
            version: [
                this.classificationVersion ?
                    this.classificationVersion.version :
                    ''
            ],
            quantity: [
                this.indicationSpecialCoffee ?
                    this.indicationSpecialCoffee.quantity :
                    ''
            ],
            collaborator: [
                this.sample && this.sample.batches && this.sample.batches.length &&
                this.sample.batches[0].batchOperation &&
                this.sample.batches[0].batchOperation.collaborator ?
                this.sample.batches[0].batchOperation.collaborator.name || ''
                : '',
            ],
            farm: [
              /*  this.classification && this.classification.batchOperation &&
                this.classification.batchOperation.collaborator ?
                this.classification.batchOperation.fiscalNoteOrSellCode*/
                '',

            ],
            address: [
                '',
            ],
            observation: [
                this.classificationVersion ?
                    this.classificationVersion.observation :
                    ''
            ],
        });
    }

    destroyTypeSubscription() {
        if (this.typeSubscription && !this.typeSubscription.closed) {
            this.typeSubscription.unsubscribe();
        }
    }

    handleError(error) {
        this.loading = false;
        return this.errorHandler.fromServer(error);
    }

    get dateCreated() {
        return DateTimeHelper.toDDMMYYYYHHmm(Date.now());
    }

    get indicationDate() {
        return DateTimeHelper.toDDMMYYYY(Date.now());
    }

    save() {
        this.submitted = true;
        Object.keys(this.form.controls).forEach(key => {
            this.form.controls[key].markAsDirty();
        });
        //Ajustar
        /*if (!this.form.valid) {
            return;
        }*/

        this.loading = true;

        console.log(this.classificationVersion);

        this.sample = new Sample();

        this.sample.barcode = this.form.value.barcode;
        this.classificationVersion.version = this.form.value.version;
        //this.classification.classificationVersion.classificationDateString = this.form.value.classificationDate;

        this.classificationVersion.tastedAgain1By = new User(
            this.form.value.tastedAgain1By
        );

        this.classificationVersion.tastedAgain2By = new User(
            this.form.value.tastedAgain2By
        );

        this.classificationVersion.tastedAgain3By = new User(
            this.form.value.tastedAgain3By
        );

        this.classificationVersion.observation = this.form.value.observation;

        this.sample.indicationSpecialCoffee = true;

        if (!this.indicationSpecialCoffee) {
            this.indicationSpecialCoffee = new IndicationSpecialCoffee;
        }
        this.indicationSpecialCoffee.batchCode = this.form.value.indicationBatchCode;
        this.indicationSpecialCoffee.sample = this.sample;
        //this.classification.classificationVersion.classification = null;

        this.indicationSpecialCoffeService.save(this.indicationSpecialCoffee).then(newIndicationSpecialCoffee => {
            this.indicationSpecialCoffee = newIndicationSpecialCoffee;
            Notification.success('Indicação criado com sucesso!');
            this.loading = false;
            this.loadClassification()
            }).catch(error => this.handleError(error));
    }

    /*reset() {
        this.submitted = true;
        this.classification = Classification.fromData();
        this.form = null;
        setTimeout(() => {
            this.buildForm();
        }, 0);
    }*/

    dateValidator(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            if (!this.sample) {
                return null;
            }
            const today = new Date();

            const value = new Date(DateTimeHelper.fromDDMMYYYY(control.value));
            if (!value) return;
            if (value > today) {
                return {
                    dateLessThan: {
                        requiredValue: DateTimeHelper.toDDMMYYYY(today.getTime()),
                        actualValue: value
                    }
                };
            }
            return null;
        };
    }
}
