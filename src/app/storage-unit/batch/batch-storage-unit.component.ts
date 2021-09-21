import { BatchOperationStatus } from '../../batch-operation/batch-operation-status';
import { Batch } from '../../batch/batch';
import { BatchStorageUnitService } from './batch-storage-unit.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-batch-storage-unit',
  templateUrl: 'batch-storage-unit.component.html'
})

export class BatchStorageUnitComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private service: BatchStorageUnitService,
  ) { }

  ngOnInit() {
    this.route.data.forEach((data: { batch: Batch }) => {
      this.service.batch = data.batch;
    });
  }

  get batchOperation() {
    return this.service.batchOperation;
  }

  get readOnly() {
    return this.batchOperation && this.batchOperation.status && this.batchOperation.status === BatchOperationStatus.CLOSED.code;
  }

  get breadcrumb() {
    if (!this.loaded) {
      return [];
    }

    return [
      ['Início', ''],
      ['Entrada/Saída de Estoque', '/batch-operation'],
      ['Cadastro de entrada de Estoque', '/batch-operation/' + this.service.batchOperation.id + '/edit'],
      ['Lote ' + this.service.batch.batchCode, null],
      ['Posições no estoque', null]
    ]
  }

  get loaded() {
    return !!this.service.batch;
  }
}
