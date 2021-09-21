import { TrackingBatchState } from './tracking-batch-state';

export class TrackingBatchStateSelectedOrdered extends TrackingBatchState {

  public id = 'selected-ordered';
  public fill = '#F2DEDE';
  public selectClass = 'btn btn-sm btn-danger pull-right';
  public orderIcon = 'fa fa-check';
  public orderClass = 'btn btn-sm btn-success pull-right';

}
