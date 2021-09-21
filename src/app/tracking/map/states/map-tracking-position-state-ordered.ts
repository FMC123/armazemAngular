import { MapTrackingPositionState } from './map-tracking-position-state';

export class MapTrackingPositionStateOrdered extends MapTrackingPositionState {

  public id = 'ordered';

  public strokeWidth = 1;

  public clickable = true;

  get stroke() {
    return 'rgb(0,201,87)';
  }

  get fill() {
    return 'rgb(189,252,201)';
  }

  get textFill() {
    return 'black';
  }

}
