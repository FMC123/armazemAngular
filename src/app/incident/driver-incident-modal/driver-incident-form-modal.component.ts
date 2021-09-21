import {Component, EventEmitter, Input, OnInit, Output, ViewChildren} from "@angular/core";
import {Incident} from "../incident";
import {Focusable} from "../../shared/forms/focusable/focusable.directive";
import {FormBuilder, FormGroup} from "@angular/forms";
import {IncidentService} from "../incident.service";
import {ErrorHandler} from "../../shared/errors/error-handler";
import {Driver} from "../../driver/driver";
import {IncidentSeverity} from "../incident-severity";
import {IncidentType} from "../incident-type";
import {IncidentOrigin} from "../incident-origin";
import {Notification} from "../../shared/notification/notification";

@Component({
  selector: 'app-driver-incident-form-modal',
  templateUrl: './driver-incident-form-modal.component.html'
})
export class DriverIncidentFormModalComponent implements OnInit {
  @Output() close: EventEmitter<Incident> = new EventEmitter<Incident>();
  @ViewChildren(Focusable) focusables;
  @Input() driver: Driver;
  @Input() incident: Incident = new Incident();

  form: FormGroup;
  loading = false;

  constructor(private formBuilder: FormBuilder,
              private service: IncidentService,
              private errorHandler: ErrorHandler) {
  }

  ngOnInit() {
    if(!this.incident){
      this.incident = new Incident();
    }
    this.buildForm();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      description: [this.incident.id ? this.incident.description : ''],
    });
  }

  focusOnInput() {
    return () => {
      if (this.focusables && this.focusables.length > 0) {
        this.focusables.first.focus();
      }
    };
  }

  submit() {
    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
    });

    if (!this.form.valid) {
      return;
    }

    // this.incident = new Incident();
    this.incident.driver = this.driver;
    this.incident.severity = IncidentSeverity.MEDIUM.code;
    this.incident.origin = IncidentOrigin.LOBBY.code;
    this.incident.type = IncidentType.DIA.code;

    this.incident.description = this.form.value.description;

    this.service.save(this.incident).then(incident => {
      this.loading = false;
      this.close.emit(incident);
      Notification.success('Incidente salvo com sucesso!');
    }).catch(err => {
      this.loading = false;
      this.errorHandler.fromServer(err);
    });

  }

}
