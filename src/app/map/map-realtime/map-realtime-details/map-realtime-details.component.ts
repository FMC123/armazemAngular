import { AuthService } from '../../../auth/auth.service';
import { NumberHelper } from '../../../shared/globalization';
import { ParameterService } from '../../../parameter/parameter.service';
import { Component, OnInit, Input, EventEmitter, Output, AfterViewChecked } from '@angular/core';

import { MapPositionStorageUnit } from './../../map-position/map-position-storage-unit';
import { MapPositionsService } from './../../map-position/map-positions.service';
import { KilosSacksConverterService } from 'app/shared/kilos-sacks-converter/kilos-sacks-converter.service';
import { UnitType } from '../../../unit-type/unit-type';
import {ClassificationVersion} from "../../../classification/classification-version";

@Component({
  selector: 'app-map-realtime-details',
  templateUrl: './map-realtime-details.component.html'
})
export class MapRealtimeDetailsComponent implements OnInit, AfterViewChecked {

  @Output() move = new EventEmitter();

  nameWithCodeParameter: boolean;

  constructor(
    private auth: AuthService,
    private service: MapPositionsService,
    private kilosSacksConverter: KilosSacksConverterService,
    private parameters: ParameterService
  ) { }

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

  get hasPermissionToMove() {
    return this.auth.accessToken.leader || this.auth.accessToken.admin;
  }

  get selectedInfo() {
    let storageUnitsInfo = this.storageUnitsInfo;
    if (storageUnitsInfo) {
      return storageUnitsInfo;
    }
    let position = Array.from(this.service.positions.values()).find((p) => p.selected);
    if (!position) {
      return null;
    }
    return [
      ['Posição', position.fullPosition]
    ];
  }

  get storageUnitsInfo() {
    if (this.storageUnits.length <= 0) {
      return null;
    }

    let storageUnit = this.storageUnits.find((b) => b.selected);
    if(storageUnit)
    {
      let certificates = this.certificatesBatchOperations.get( storageUnit.batchOperationId );
      if (certificates)
      {
        storageUnit.certificates = certificates;
      }
    }

    if (!storageUnit) {
      return null;
    }

    let details = [
      ['Depositante', this.nameWithCodeParameter ? storageUnit.clientNameWithCode : storageUnit.clientName],
      ['Romaneio', storageUnit.batchOperationCode],
      ['Lotes / Pesos', storageUnit.batchesAndWeights(this.kilosSacksConverter.sacksInKilos)],
      ['Tag', storageUnit.tagCode],
      ['Posição', storageUnit.fullPosition],
      ['Escolha', storageUnit.contaminant ? "Escolha" : "Café"],//Contaminante
      ['Certificados', (storageUnit.certificates || []).map(c => c.name).join(', ')]
    ];

    storageUnit.storageUnitBatches.forEach(sub => {
      let classVersion = this.service.sampleClassificationVersions.get(sub.batch.sample.id);
      let itens = new Array<string>();
      if (classVersion){
        classVersion.items.forEach(item => {
          if (item.classificationType.showOnMapFilter)
            itens = itens.concat(item.classificationType.name.concat(': ').concat(item.value));
        });
        details  = details.concat([[ 'Classificação '.concat(sub.batch.batchCode)  , itens.join('\n') ]]);
      }
    });

    return details;
  }

  get storageUnits() {
    let storageUnits = (this.service.storageUnitsDetailed || []).slice();
    storageUnits.sort((a, b) => a.fullPosition ? a.fullPosition.localeCompare(b.fullPosition) : -1);
    return storageUnits;
  }

  get certificatesBatchOperations() {
    return this.service.certificatesBatchOperations;
  }

  get totalMarkedKilos() {
    return this
      .storageUnits
      .filter(su => su.selectedForMarkupGroup && su.isKilos)
      .map(su => su.initialWeight)
      .reduce((a, b) => a + b, 0);
  }

  get totalMarkedSacks() {
    return this
      .storageUnits
      .filter(su => su.selectedForMarkupGroup && su.isSacks)
      .map(su => su.initialWeight)
      .reduce((a, b) => a + b, 0);
  }

  get totalMarkedSacksString() {
    return `${this.totalMarkedSacks} SC`;
  }

  get totalMarkedKilosString() {
    let sacks = NumberHelper.toPTBR(this.kilosSacksConverter.kilosToSacks(this.totalMarkedKilos));
    return `KG ${NumberHelper.toPTBR(this.totalMarkedKilos)} (${sacks} SC)`;
  }

  select(storageUnit: MapPositionStorageUnit) {
    this.service.selectStorageUnit(storageUnit);
  }

  get allSelectedForMarkupGroup() {
    return (this.service.storageUnitsDetailed || []).every(su => su.selectedForMarkupGroup);
  }

  set allSelectedForMarkupGroup(value) {
    (this.service.storageUnitsDetailed || []).forEach(su => {
      su.selectedForMarkupGroup = !!value;
    });
  }
}
