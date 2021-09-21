import { ModalManager } from '../../shared/modals/modal-manager';
import { HarvestSeason } from '../harvest-season';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-harvest-season-list-info',
  templateUrl: './harvest-season-list-info.component.html'
})
export class HarvestSeasonListInfoComponent implements OnInit {
  @Input() harvestSeason: HarvestSeason;

  logModal: ModalManager = new ModalManager();

  leftColumn: Array<any>;

  ngOnInit() {
    this.leftColumn = [
      ['Identificador da Safra' , this.harvestSeason.identifier],
      ['Data inicial' , this.harvestSeason.initialDateString],
      ['Data Final' , this.harvestSeason.finalDateString],
    ];

  }
}
