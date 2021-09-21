import {ClassificationType} from "../../classification/classification-type";
import {ClassificationStep} from "../classification-step";

export class ClassificationStepType {

  static fromListData(listData: Array<ClassificationStepType>): Array<ClassificationStepType> {
    return listData.map(data => {
      return ClassificationStepType.fromData(data);
    });
  }

  static fromData(data?: ClassificationStepType): ClassificationStepType {
    if (!data) {
      return new this();
    }

    const classification = new this(
      data.id,
      data.classificationStep,
      data.classificationType,
      data.sequence,
      data.isMandatoty,
      data.isClassifier,
      data.isTaster,
      data.isTaster1,
      data.isTaster2,
      data.isTaster3,
    );

    return classification;
  }


  constructor(
    public id?: string,
    public classificationStep?: ClassificationStep,
    public classificationType?: ClassificationType,
    public sequence?: number,
    public isMandatoty?: boolean,
    public isClassifier?: boolean,
    public isTaster?: boolean,
    public isTaster1?: boolean,
    public isTaster2?: boolean,
    public isTaster3?: boolean
  ) {

    if(classificationStep)
      this.classificationStep = ClassificationStep.fromData(classificationStep);

    if(classificationType)
      this.classificationType = ClassificationType.fromData(classificationType);

  }
}
