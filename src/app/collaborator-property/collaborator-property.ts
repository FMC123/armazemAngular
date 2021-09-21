import { Collaborator } from '../collaborator/collaborator';
import { Cultivation } from '../cultivation/cultivation';
import { Farm } from '../farm/farm';

export class CollaboratorProperty {

  static fromListData(listData: Array<CollaboratorProperty>): Array<CollaboratorProperty> {
    return listData.map((data) => {
      return CollaboratorProperty.fromData(data);
    });
  }

  static fromData(data: CollaboratorProperty): CollaboratorProperty {
    if (!data) { return new this(); }
    let collaboratorProperty = new this(
      data.id,
      data.collaborator,
      data.farm,
      data.cultivation,
      data.percentProperty
    );
    return collaboratorProperty;
  }

  constructor(
    public id?: string,
    public collaborator?: Collaborator,
    public farm?: Farm,
    public cultivation?: Cultivation,
    public percentProperty?: number
  ) {
    if (collaborator) {
      this.collaborator = Collaborator.fromData(collaborator);
    }

    if (farm) {
      this.farm = Farm.fromData(farm);
    }

    if (cultivation) {
      this.cultivation = Cultivation.fromData(cultivation);
    }
  }
}
