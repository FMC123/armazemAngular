export class TrackingBatchState {

  public id: string;
  public fill: string;
  public orderIcon: string;
  public orderClass: string;
  public selectClass: string;

  equals(other: TrackingBatchState) {
    if (!other) {
      return false;
    }

    return this.id === other.id;
  }

}
