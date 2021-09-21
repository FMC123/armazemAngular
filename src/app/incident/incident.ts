import {Driver} from "../driver/driver";
import {Forklift} from "../forklift/forklift";
import {Position} from "../position/position";
import {IncidentOrigin} from "./incident-origin";
import {IncidentType} from "./incident-type";
import {IncidentSeverity} from "./incident-severity";

export class Incident {

  static fromListData(listData: Array<Incident>): Array<Incident> {
    return listData.map( data => {
      return Incident.fromData(data);
    });
  }

  static fromData(data: Incident): Incident {
    if (!data) return new this();
    return new this(
      data.id,
      data.createdDate,
      data.origin,
      data.type,
      data.severity,
      data.description,
      data.position,
      data.forklift,
      data.driver,
    )
  }

  constructor(public id?: string,
              public createdDate?: number,
              public origin?: string,
              public type?: string,
              public severity?: string,
              public description?: string,
              public position?: Position,
              public forklift?: Forklift,
              public driver?: Driver) {

    if(position){
      this.position = Position.fromData(position);
    }

    if(forklift){
      this.forklift = Forklift.fromData(forklift);
    }

    if(driver){
      this.driver = Driver.fromData(driver);
    }

  }

  get originObject() {
    return IncidentOrigin.fromData(this.origin);
  }

  get typeObject() {
    return IncidentType.fromData(this.type);
  }

  get severityObject() {
    return IncidentSeverity.fromData(this.severity);
  }

}
