import { ErrorHandler } from '../../shared/errors/error-handler';
import { CollaboratorAutocomplete } from '../../collaborator/collaborator-autocomplete';
import { CollaboratorService } from '../../collaborator/collaborator.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { selector } from 'rxjs/operator/multicast';
import { Subscription } from 'rxjs/Rx';

import { Collaborator } from '../../collaborator/collaborator';
import { Cultivation } from '../../cultivation/cultivation';
import { CultivationService } from '../../cultivation/cultivation.service';
import { Farm } from '../../farm/farm';
import { FarmService } from '../../farm/farm.service';
import { Notification } from '../../shared/notification';
import { CollaboratorProperty } from "../collaborator-property";
import { CollaboratorPropertyService } from "../collaborator-property.service";
import { FarmAutocomplete } from 'app/farm/farm-autocomplete';

@Component({
  selector: 'app-collaborator-property-form',
  templateUrl: './collaborator-property-form.component.html',
})

export class CollaboratorPropertyFormComponent implements OnInit, OnDestroy {

  cultivations: Array<Cultivation>;
  collaboratorProperty: CollaboratorProperty;
  form: FormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  collaboratorSubscription: Subscription;
  collaboratorAutocomplete: CollaboratorAutocomplete;
  farmAutocomplete: FarmAutocomplete;
  farmSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private collaboratorPropertyService: CollaboratorPropertyService,
    private farmService: FarmService,
    private collaboratorService: CollaboratorService,
    private cultivationService: CultivationService,
    private errorHandler: ErrorHandler,
  ) { }

  ngOnInit() {
    Notification.clearErrors();
    this.collaboratorAutocomplete = new CollaboratorAutocomplete(this.collaboratorService, this.errorHandler);

    this.farmAutocomplete = new FarmAutocomplete(this.farmService, this.errorHandler);

    this.route.data.forEach((data: { collaboratorProperty: CollaboratorProperty }) => {
      this.collaboratorProperty = data.collaboratorProperty;
    });

    this.cultivationService.list().then((cultivations: Array<Cultivation>) => {
      this.cultivations = cultivations;
    });

    this.buildForm();
  }

  ngOnDestroy() {
    if (this.collaboratorSubscription != null && !this.collaboratorSubscription.closed) {
      this.collaboratorSubscription.unsubscribe();
    }

    if (this.farmSubscription != null && !this.farmSubscription.closed) {
      this.farmSubscription.unsubscribe();
    }
  }

  buildForm() {
    this.form = this.formBuilder.group({
      'collaboratorId': [this.collaboratorProperty.collaborator ? this.collaboratorProperty.collaborator.id : '',
      [Validators.required]
      ],
      'farmId': [this.collaboratorProperty.farm ? this.collaboratorProperty.farm.id : '',
      [Validators.required]
      ],
      'cultivationId': [this.collaboratorProperty.cultivation ? this.collaboratorProperty.cultivation.id : '',
      [Validators.required]
      ],
      'percentProperty': [this.collaboratorProperty.percentProperty || '',
      [Validators.required]
      ]
    });

    this.collaboratorAutocomplete.value = this.collaboratorProperty.collaborator;
    this.collaboratorSubscription = this.collaboratorAutocomplete.valueChange.subscribe((value) => {
      const id = value ? value.id : null;
      this.form.get('collaboratorId').setValue(id);
    });

    this.farmAutocomplete.value = this.collaboratorProperty.farm;
    this.farmSubscription = this.farmAutocomplete.valueChange.subscribe((value) => {
      const id = value ? value.id : null;
      this.form.get('farmId').setValue(id);
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
    this.loading = true;
    this.collaboratorProperty.collaborator = this.collaboratorAutocomplete.value;
    this.collaboratorProperty.farm = this.farmAutocomplete.value;
    this.collaboratorProperty.cultivation = new Cultivation();
    this.collaboratorProperty.cultivation.id = this.form.value.cultivationId;
    this.collaboratorProperty.percentProperty = this.form.value.percentProperty;

    this.collaboratorPropertyService.save(this.collaboratorProperty).then((collaboratorProperty) => {
      Notification.success('Registro salvo com sucesso!');
      this.router.navigate(['/collaborator-property']);
    }).catch(() => this.loading = false);
  }
}
