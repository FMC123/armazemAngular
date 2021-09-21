import { Scale } from '../../scale/scale';
import { ScaleService } from '../../scale/scale.service';
import { BalanceService } from '../balance.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { ErrorHandler } from '../../shared/shared.module';
import { Notification } from './../../shared/notification/notification';

@Component({
  selector: 'app-select-scale',
  templateUrl: './select-scale.component.html'
})
export class SelectScaleComponent implements OnInit {
  loading: boolean = true;
  scales: Array<Scale>;

  constructor(
    private router: Router,
    private errorHandler: ErrorHandler,
    private balanceService: BalanceService,
    private scaleService: ScaleService
  ) { }

  ngOnInit() {
    Notification.clearErrors();
    this.loading = true;
    this.scaleService.list().then((scales) => {
      this.scales = scales;
      this.loading = false;
    }).catch((error) => this.handleError(error));
  }


  select(scale) {
    this.balanceService.scale = scale;
  }

  handleError(error) {
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }

}
