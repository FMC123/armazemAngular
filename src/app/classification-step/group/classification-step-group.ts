import {ClassificationStep} from "../classification-step";

export class ClassificationStepGroup {

  static fromListData(listData: Array<ClassificationStepGroup>): Array<ClassificationStepGroup> {
    return listData.map(data => {
      return ClassificationStepGroup.fromData(data);
    });
  }

  static fromData(data: ClassificationStepGroup): ClassificationStepGroup {
    if (!data) return new this();
    let classificationStepGroup = new this(
      data.id,
      data.name,
      data.classificationSteps
    );
    return classificationStepGroup;
  }


  constructor(
    public id?: string,
    public name?: string,
    public classificationSteps?: Array<ClassificationStep>
  ) {

    if(classificationSteps)
      this.classificationSteps = ClassificationStep.fromListData(classificationSteps);

  }
}
