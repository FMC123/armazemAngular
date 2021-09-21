import { HarvestSeasonService } from '../harvest-season.service';
import { ModalManager } from '../../shared/modals/modal-manager';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Notification } from './../../shared/notification/notification';
import {HarvestSeason} from '../harvest-season';

@Component({
  selector: 'app-harvest-season-list-details',
  templateUrl: './harvest-season-list-details.component.html'
})
export class HarvestSeasonDetailsComponent implements OnInit {
  harvestSeason: HarvestSeason;

  constructor(private route: ActivatedRoute,
              private harvestSeasonService: HarvestSeasonService) { }

  ngOnInit() {
    Notification.clearErrors();
    this.route.data.forEach((data: {harvestSeason: HarvestSeason}) => {
      this.harvestSeason = data.harvestSeason;
    });
  }

}
