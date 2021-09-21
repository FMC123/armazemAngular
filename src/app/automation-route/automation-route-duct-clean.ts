import { AutomationRouteItem } from "app/automation-route/automation-route-item";
import { RouteItemStatus } from "app/automation-route/route-item-status";

export class AutomationRouteDuctClean {

  static fromListData(listData: Array<AutomationRouteDuctClean>): Array<AutomationRouteDuctClean> {
    return listData.map((data) => {
      return AutomationRouteDuctClean.fromData(data);
    });
  }

  static fromData(data: AutomationRouteDuctClean): AutomationRouteDuctClean {
    if (!data) return new this();
    let ductClean = new this(
      data.batchCode,
      data.batchOperationCode,
      data.automationRouteItem,
      data.routeItemStatusCode,
    );
    return ductClean;
  }

  constructor(
    public batchCode?: string,
    public batchOperationCode?: string,
    public automationRouteItem?: AutomationRouteItem,
   // public operationAutomation?: string,
   public routeItemStatusCode?: string
  ) {}
}
