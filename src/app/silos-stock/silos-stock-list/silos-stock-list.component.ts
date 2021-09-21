import { Component, OnInit } from "@angular/core";
import { Position } from "../../position/position";
import { Logger } from "../../shared/logger/logger";
import { ErrorHandler } from "../../shared/shared.module";
import { ActivatedRoute } from "@angular/router";
import { StorageUnitBatch } from "app/storage-unit/storage-unit-batch";
import { NumberHelper } from "app/shared/globalization/number-helper";

@Component({
  selector: 'silos-stock-list',
  templateUrl: './silos-stock-list.component.html'
})

export class SilosStockListComponent implements OnInit {
  loading = false;

  storageSilos: Array<Position>;
  lungSilos: Array<Position>;

  constructor(private route: ActivatedRoute,
    private errorHandler: ErrorHandler,
    private logger: Logger) { }

  ngOnInit(): void {
    this.route.data.forEach((data: { lungSilos: Array<Position>, storageSilos: Array<Position> }) => {
      this.storageSilos = data.storageSilos;
      this.lungSilos = data.lungSilos;
    });
  }

  /**
   * Valor total da lista de StorageUnitBatch do Silo
   * @param listSUB 
   */
  getTotalByStorageUnitBatches(listSUB: Array<StorageUnitBatch>) {
    return NumberHelper.toPTBR(listSUB.map(b => b.quantity).reduce((a, b) => a + b, 0));
  }
}