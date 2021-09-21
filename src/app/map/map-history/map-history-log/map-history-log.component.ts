import { MapHistoryLog } from './map-history-log';
import { MapPositionsService } from '../../map-position/map-positions.service';
import { MapHistoryService } from '../map-history.service';
import { Component, OnInit, Input, EventEmitter, Output, AfterViewChecked } from '@angular/core';

@Component({
  selector: 'app-map-history-log',
  templateUrl: './map-history-log.component.html'
})
export class MapHistoryLogComponent implements OnInit {

  constructor(private historyService: MapHistoryService,
              private positionsService: MapPositionsService) {}

  ngOnInit() { }

  get logs(){
    if (!this.historyService.history) {
      return [];
    }
    return this.historyService.history.logs || [];
  }

  get selectedInfo(){
    if (this.logs.length <= 0) {
      return null;
    }
    let log = this.logs.find((l) => l.selected);
    if (!log) {
      return null;
    }
    return [
      ['Hora', log.logDateString],
      ['Tag', log.storageUnit.tagCode],
      ['Pos. Ini.', log.fullPositionFrom],
      ['Pos. Fim.', log.fullPositionTo],
      ['Operador', log.createdBy ? log.createdBy.name : ''],
      ['Depositante', log.storageUnit.clientName],
      ['Romaneio', log.storageUnit.batchOperationCode],
      ['Lote', log.storageUnit.batchCode]
    ];
  }

  get loading(){
    return this.historyService.loading;
  }

  select(log: MapHistoryLog) {
    this.historyService.selectLog(log);
  }

}
