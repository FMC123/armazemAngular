import {ClassificationType} from './classification-type';

export class ClassificationRequirementItem {
  static fromListData(
    listData: Array<ClassificationRequirementItem>
  ): Array<ClassificationRequirementItem> {
    return listData.map(data => {
      return ClassificationRequirementItem.fromData(data);
    });
  }

  static fromData(data?: ClassificationRequirementItem): ClassificationRequirementItem {
    if (!data) {
      return new this();
    }

    const classificationRequirementItem = new this(
      data.id,
      data.classificationRequirement,
      data.classificationType,
      data.createdDate,
      data.lastModified,
      data.mListClassificationRequirementItemValueDTOS,
      data.message,
      data.operation,
      data.type
    );

    return classificationRequirementItem;
  }

  constructor(
    public id?: string,
    public classificationRequirement?: Object,
    public classificationType?: ClassificationType,
    public createdDate?: number,
    public lastModified?: number,
    public mListClassificationRequirementItemValueDTOS?: Array<Object>,
    public message?: string,
    public operation?: string,
    public type?: string
  ) {
  }

}
