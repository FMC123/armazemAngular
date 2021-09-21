import { ParameterService } from '../../../parameter/parameter.service';
import { MapHistoryService } from '../map-history.service';
import { Component, OnInit, Input, EventEmitter, Output, AfterViewChecked } from '@angular/core';

import { MapPositionStorageUnit } from './../../map-position/map-position-storage-unit';
import { MapPositionsService } from './../../map-position/map-positions.service';
import { KilosSacksConverterService } from 'app/shared/kilos-sacks-converter/kilos-sacks-converter.service';

@Component({
  selector: 'app-map-history-details',
  templateUrl: './map-history-details.component.html'
})
export class MapHistoryDetailsComponent implements OnInit, AfterViewChecked {

  nameWithCodeParameter: boolean;

  constructor(
    private service: MapPositionsService,
    private historyService: MapHistoryService,
    private kilosSacksConverter: KilosSacksConverterService,
    private parameters: ParameterService
  ) {}

  ngOnInit() {
    this.nameWithCodeParameter = this.parameters.clientCodeBeforeName();
  }

  ngAfterViewChecked() {
    if (jQuery('.table-responsive').length) {
      let clientHeight = Math.max(jQuery('.map-sidebar').height(), 740);
      let max = clientHeight - jQuery('.table-responsive').position().top;
      let padding = 40;
      jQuery('.table-responsive').css('max-height', max - padding);
    }
  }

  get selectedInfo(){
    let storageUnitsInfo = this.storageUnitsInfo;
    if (storageUnitsInfo) {
      return storageUnitsInfo;
    }
    //fixme
    let position = Array.from(this.service.positions.values()).find((p) => p.selected);
    if (!position) {
      return null;
    }
    return [
      ['Posição', position.fullPosition]
    ];
  }

  get storageUnitsInfo(){
    if (this.storageUnits.length <= 0) {
      return null;
    }
    let storageUnit = this.storageUnits.find((b) => b.selected);
    if (!storageUnit) {
      return null;
    }
    return [
      ['Depositante', this.nameWithCodeParameter ? storageUnit.clientNameWithCode : storageUnit.clientName],
      ['Romaneio', storageUnit.batchOperationCode],
      ['Lotes / Pesos', storageUnit.batchesAndWeights(this.kilosSacksConverter.sacksInKilos)],
      ['Tag', storageUnit.tagCode],
      ['Posição', storageUnit.fullPosition],
      ['Certificados', (storageUnit.certificates || []).map(c => c.name).join(', ')],
    ];
  }

  get storageUnits(){
    return this.service.storageUnitsDetailed || [];
  }

  get loading() {
    return this.historyService.loading;
  }

  select(storageUnit: MapPositionStorageUnit) {
    this.service.selectStorageUnit(storageUnit);
  }

}
