import {DateTimeHelper, NumberHelper} from '../../shared/globalization';
import {TransportationType} from "../../transportation/transportation-type";
import {TransportationStatus} from "../../transportation/transportation-status";

export class LobbyPanel {

  transportationTypeObject: TransportationType;
  transportationStatusObject: TransportationStatus;

  static fromListData(listData: Array<LobbyPanel>): Array<LobbyPanel> {
    return listData.map(data => {
      return LobbyPanel.fromData(data);
    });
  }

  static fromData(data: LobbyPanel): LobbyPanel {
    if (!data) return new this();
    let lobbyPanel = new this(
      data.transportationType,
      data.transportationStatus,
      data.entryDate,
      data.vehiclePlates,
      data.sacksQuantity,
      data.packType,
      data.driverName,
      data.weightedDate,
      data.collaborator,
      data.owner
    );
    return lobbyPanel;
  }

  constructor(
    public transportationType?: string,
    public transportationStatus?: string,
    public entryDate?: number,
    public vehiclePlates?: string,
    public sacksQuantity?: number,
    public packType?: string,
    public driverName?: string,
    public weightedDate?: number,
    public collaborator?: string,
    public owner?: string
  ) {
    if(transportationType){
      this.transportationTypeObject = TransportationType.fromData(transportationType);
    }
    if(transportationStatus){
      this.transportationStatusObject = TransportationStatus.fromData(transportationStatus);
    }
  }

  get entryDateString(): string {
    return DateTimeHelper.toDDMMYYYY(this.entryDate);
  }

  get entryHourString(): string {
    return DateTimeHelper.toHHmm(this.entryDate);
  }

  get weightedDateString(): string {
    return DateTimeHelper.toDDMMYYYY(this.weightedDate);
  }

  get weightedHourString(): string {
    return DateTimeHelper.toHHmm(this.weightedDate);
  }

  get transportationTypeString(): string {
    return this.transportationTypeObject.name;
  }

  get vehiclePlatesString(): string {
    return this.vehiclePlates.replace('-','‑');
  }

}
