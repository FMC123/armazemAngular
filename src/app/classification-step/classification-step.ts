import {ClassificationStepGroup} from "./group/classification-step-group";
import {ClassificationType} from "../classification/classification-type";
import {ClassificationStepType} from "./type/classification-step-type";
import {ClassificationStepUser} from "./user/classification-step-user";

export class ClassificationStep {

  static fromListData(listData: Array<ClassificationStep>): Array<ClassificationStep> {
    return listData.map(data => {
      return ClassificationStep.fromData(data);
    });
  }

  static fromData(data?: ClassificationStep): ClassificationStep {
    if (!data) {
      return new this();
    }

    const classification = new this(
      data.id,
      data.description,
      data.sequence,
      data.previousStep,
      data.isLastStep,
      data.classificationStepGroup,
      data.types,
      data.stepTypes,
      data.stepUsers
    );

    return classification;
  }

  constructor(
    public id?: string,
    public description?: string,
    public sequence?: number,
    public previousStep?: ClassificationStep,
    public isLastStep?: boolean,
    public classificationStepGroup?: ClassificationStepGroup,
    public types?: Array<ClassificationType>,
    public stepTypes?: Array<ClassificationStepType>,
    public stepUsers?: Array<ClassificationStepUser>,
  ) {

    if(previousStep)
      this.previousStep = ClassificationStep.fromData(ClassificationStep);

    if(classificationStepGroup)
      this.classificationStepGroup = ClassificationStepGroup.fromData(classificationStepGroup);

    if(types)
      this.types = ClassificationType.fromListData(types);

    if(stepTypes)
      this.stepTypes = ClassificationStepType.fromListData(stepTypes);

    if(stepUsers)
      this.stepUsers = ClassificationStepUser.fromListData(stepUsers);

  }
}
