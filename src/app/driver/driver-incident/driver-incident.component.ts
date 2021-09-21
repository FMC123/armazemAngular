import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ModalManager} from "../../shared/modals/modal-manager";
import {ErrorHandler} from "../../shared/errors/error-handler";
import {Incident} from "../../incident/incident";
import {IncidentService} from "../../incident/incident.service";
import {Driver} from "../driver";
import {DateTimeHelper} from "../../shared/globalization";
import {Page} from "../../shared/page/page";

@Component({
  selector: 'app-driver-incident',
  templateUrl: './driver-incident.component.html',
})
export class DriverIncidentComponent implements OnInit, OnDestroy {
  @Input() driver: Driver;
  @Input() editable : boolean = false;
  incidents: Array<Incident> = [];
  openCreationModal: boolean = false;
  error: boolean;

  page: Page<Incident> = new Page<Incident>();
  deleteConfirm = new ModalManager();
  formModal = new ModalManager();
  loadingList = true;

  constructor(
    private incidentService: IncidentService,
    private errorHandler: ErrorHandler,) {
  }

  ngOnInit() {
    this.page.changeQuery.subscribe(() => {
      this.loadList();
    });

    this.loadList();
  }

  ngOnDestroy() {
    this.page.changeQuery.unsubscribe();
  }

  loadList() {
    this.loadingList = true;
    if(this.driver) {
      this.incidentService.listByDriver(this.driver.id, this.page).then(
        (page) => {
          // this.page = page;
          this.loadingList = false
        })
    }
    this.loadingList = false;
  }

  incidentDate(i: Incident) {
    return i.createdDate ? DateTimeHelper.toDDMMYYYYHHmm(i.createdDate) : '-';
  }

  closeDriveIncidentFormModal(incident: Incident) {
    this.formModal.close();
    (<any>jQuery)('.modal').modal('hide');
    this.loadList();
  }

  edit(incident: Incident){
    this.formModal.open(incident);
  }

  delete(id: string) {
    return this.incidentService.delete(id).then(() => {
      this.loadingList = true;
      return this.loadList()
    }).catch(err => this.handleError(err));
  }

  handleError(error) {
    this.error = true;
    this.loadingList = false;
    return this.errorHandler.fromServer(error);
  }

}
