import { MapTrackingPositionState } from './map-tracking-position-state';

export class MapTrackingPositionStateFilled extends MapTrackingPositionState {

  public id = 'filled';

  public strokeWidth = 1;

  public clickable = false;

  get stroke() {
    return 'rgb(107, 107, 107)';
  }

  get fill() {
    return 'rgb(120, 120, 120)';
  }

  get textFill() {
    return 'white';
  }

}
