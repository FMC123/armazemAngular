
import { DateTimeHelper, NumberHelper } from '../../shared/globalization';
import { MarkupGroupBatch } from '../../markup-group/batch/markup-group-batch';
import { StorageUnitOut } from 'app/storage-unit/out/storage-unit-out';

/**
 * Linha de registro para o relatório de ficha do lote, representando as saídas.
 * Para poder fazer a ordenção pelo id da operação
 */
export class BatchReportOutLine {

  constructor(
    public batchOperationId?: string,
    public batchOperationType?: string,
    public batchOperationName?: string,
    public storageUnitOuts?: Array<StorageUnitOut>
  ) {
  }
}