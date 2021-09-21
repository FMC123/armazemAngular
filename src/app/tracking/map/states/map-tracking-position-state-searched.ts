import { MapTrackingPositionState } from './map-tracking-position-state';

export class MapTrackingPositionStateSearched extends MapTrackingPositionState {

  public id = 'searched';

  public strokeWidth = 1;

  public clickable = true;

  get stroke() {
    return 'rgb(255,255,51)';
  }

  get fill() {
    return 'rgb(255,255,153)';
  }

  get textFill() {
    return 'black';
  }

}
