export class MapTrackingPositionState {

  public id: string;
  public strokeWidth: number;
  public stroke: string;
  public fill: string;
  public textFill: string;

  equals(other: MapTrackingPositionState) {
    if (!other) {
      return false;
    }

    return this.id === other.id;
  }

}
