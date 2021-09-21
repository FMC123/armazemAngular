import { Response } from '@angular/http';
import { PhysicalStockService } from '../report/physical-stock/physical-stock.service';
import { GlobalBatchesService } from '../report/global-batches/global-batches.service';
import { AuthService } from './../auth/auth.service';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {ParameterService} from "../parameter/parameter.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html'
})
export class MenuComponent implements OnInit, OnDestroy {
  loading = false;
  batchSwapParameter;
  batchSwapParameterSubscription: Subscription;

  constructor(
    private auth: AuthService,
    private physicalStockService: PhysicalStockService,
    private globalBatchesService: GlobalBatchesService,
    private parameterService: ParameterService
  ) { }

  ngOnInit() {
    this.batchSwapParameter = this.parameterService.batchSwapExpocaccerValue();
    this.batchSwapParameterSubscription = this.parameterService.batchSwapExpocaccerSubject
      .subscribe((bsp) => this.batchSwapParameter = bsp);
  }

  ngOnDestroy() {
    this.batchSwapParameterSubscription.unsubscribe();
  }

  physicalStock() {
    this.loading = true;
    this.physicalStockService.find();
    this.physicalStockService.findCsv();
    this.loading = false;
  }

  globalBagsReport() {
    this.loading = true;
    this.physicalStockService.globalBagsReport();
    this.loading = false;
  }

  globalBatchesReport() {
    this.loading = true;
    this.globalBatchesService.globalBatchesReport();
    this.loading = false;
  }

}
