import { MapTrackingPositionState } from './map-tracking-position-state';

export class MapTrackingPositionStateSelected extends MapTrackingPositionState {

  public id = 'selected';

  public strokeWidth = 1;

  public clickable = true;

  get stroke() {
    return 'red';
  }

  get fill() {
    return '#F2DEDE';
  }

  get textFill() {
    return 'black';
  }

}
