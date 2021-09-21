export class TrackingStorageUnitState {

  public id: string;
  public fill: string;
  public orderIcon: string;
  public orderClass: string;
  public selectClass: string;

  equals(other: TrackingStorageUnitState) {
    if (!other) {
      return false;
    }

    return this.id === other.id;
  }

}
