import { MapRealtimeService } from '../../map/map-realtime/map-realtime.service';
import { MapRealtimeServerService } from '../../map/map-realtime/map-realtime-server.service';
import { Component, OnInit, OnDestroy }      from '@angular/core';
import { AllocationTruckService } from './../allocation-truck.service';
import { AllocationTruck } from './../allocation-truck';
import { Notification } from './../../shared/notification/notification';
import { ErrorHandler, ModalManager, Search } from '../../shared/shared.module';
import { Logger } from '../../shared/logger/logger';
import { Page } from '../../shared/page/page';
import { AllocationTruckListResolve } from './allocation-truck-list-resolve';

@Component({
  selector: 'app-allocation-truck-list',
  templateUrl: './allocation-truck-list.component.html'
})
export class AllocationTruckListComponent implements OnInit, OnDestroy {
  loading: boolean;
  error: boolean;
  eleteIdConfirm: string;
  selected: AllocationTruck;
  editable: AllocationTruck;

  page: Page<AllocationTruck> = new Page<AllocationTruck>();
  search: Search = new Search();

  get allocationTruckList(): AllocationTruck[]{
    return this.page.data;
  }

  constructor(
    private allocationTruckService: AllocationTruckService,
    private mapRealtimeServerService: MapRealtimeService,
    private errorHandler: ErrorHandler,
    private logger: Logger,
    private markupGroupId: string
  ) {}

  ngOnInit() {
    Notification.clearErrors();
    this.allocationTruckService.find('asd');
    // this.loadList();
    // this.page.changeQuery.subscribe(() => {
    //   this.loadList();
    // });
    // this.search.subscribe(() => {
    //   this.loadList();
    // });
  }

  // edit(allocationTruch: AllocationTruck) {
  //   this.allocationTruckService.allocationTruckEditable = allocationTruch;
  // }

  move(lote: AllocationTruck, direction: 'up' | 'down') {
    if (direction === 'up') {
      lote.position -= 1;
    } else {
      lote.position += 1;
    }

    this.page.data.sort((a, b) => {
      return a.position - b.position;
    });
  }

  loadList() {
    this.error = false;
    this.loading = true;
    this.allocationTruckService.listPaged(this.search.value, this.page).then(() => {
      this.loading = false;
    }).catch(error => this.handleError(error));
  }

  save() {
    this.loading = true;
    this.allocationTruckService
      .save(this.page.data)
      .then(() => {
        Notification.success("Posições salvas com sucesso!");
        this.loading = false;
      })
      .catch((error) =>  this.handleError(error));
  }

  downloadShipmentTruckLotAllocationReport(){

  }

  ngOnDestroy() {
    this.page.changeQuery.unsubscribe();
    this.search.destroy()
  }

  handleError(error) {
    this.error = true;
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }
}
