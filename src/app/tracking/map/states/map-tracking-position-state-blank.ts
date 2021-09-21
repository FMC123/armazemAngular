import { MapTrackingPositionState } from './map-tracking-position-state';

export class MapTrackingPositionStateBlank extends MapTrackingPositionState {

  public id = 'blank';

  public strokeWidth = 1;

  public clickable = false;

  get stroke() {
    return 'rgb(107, 107, 107)';
  }

  get fill() {
    return 'rgb(158, 158, 158)';
  }

  get textFill() {
    return 'white';
  }

}
