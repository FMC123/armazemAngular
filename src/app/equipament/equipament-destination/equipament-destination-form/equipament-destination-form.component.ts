import { Notification } from '../../../shared/notification';
import {Component, OnInit} from "@angular/core";
import {EquipamentDestination} from "../equipament-destination";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Equipament} from "../../equipament";
import {EquipamentDestinationIdentifier} from "../equipament-destination-identifier";
import {ActivatedRoute, Router} from "@angular/router";
import {EquipamentService} from "../../equipament.service";
import {EquipamentDestinationService} from "../equipament-destination.service";
import { ErrorHandler } from '../../../shared/errors/error-handler';


@Component({
  selector: 'app-equipament-destination-form',
  templateUrl: './equipament-destination-form.component.html'
})

export class EquipamentDestinationFormComponent implements OnInit {

  equipamentOrigin: Equipament;
  equipamentDestination: EquipamentDestination;
  equipamentIdentifier: EquipamentDestinationIdentifier;
  equipamentTarget: Equipament;
  form: FormGroup;
  loading: boolean = false;
  equipametDestinationsIdentifiers: Array<EquipamentDestinationIdentifier> = EquipamentDestinationIdentifier.list();
  equipaments: Array<Equipament> = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private equipamentService: EquipamentService,
    private equipamentDestinationService: EquipamentDestinationService,
    private errorHandler: ErrorHandler
  ) {  }

  get editing(){
    return !!this.equipamentDestination && !!this.equipamentDestination.id;
  }

  ngOnInit(): void {
    Notification.clearErrors();

    this.equipamentService.list().then(equipaments => {
      this.equipaments = equipaments;
      this.form.get('equipamentTarget').setValue(this.equipamentTarget ? this.equipamentTarget.id || '' : '');
    }).catch(error => this.handleError(error));

    this.route.data.forEach((data: {equipamentDestination: EquipamentDestination}) => {

      this.equipamentOrigin = data.equipamentDestination.equipamentOrigin;
      this.equipamentDestination = data.equipamentDestination;
      this.equipamentIdentifier = data.equipamentDestination.identifierObject;
      this.equipamentTarget = data.equipamentDestination.equipamentTarget ;
      this.buildForm();
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

    this.equipamentDestination.equipamentOrigin = this.equipamentOrigin;
    this.equipamentDestination.destinationDescription = this.form.value.destinationDescription;
    this.equipamentDestination.identifier = this.form.value.equipIdentifier;
    this.equipamentDestination.equipamentTarget = new Equipament(this.form.value.equipamentTarget);

    return this.equipamentDestinationService.save(this.equipamentDestination).then(() => {
      Notification.success('Destino salvo com sucesso!');
      this.router.navigate(['/equipament', this.equipamentOrigin.id]);
    }).catch((error) => this.handleError(error));
  }

  buildForm() {
    this.form = this.formBuilder.group({
      'destinationDescription': [this.equipamentDestination.destinationDescription || '', Validators.required],
      'equipamentTarget': [this.equipamentTarget ? this.equipamentTarget.id || '' : '' ],
      'equipIdentifier': [this.equipamentIdentifier ? this.equipamentIdentifier.code : '' || '', Validators.required],
    });
  }

  handleError(error) {
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }

}
