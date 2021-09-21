import {User} from "../../user/user";
import {ClassificationStep} from "../classification-step";

export class ClassificationStepUser {

  static fromListData(listData: Array<ClassificationStepUser>): Array<ClassificationStepUser> {
    return listData.map(data => {
      return ClassificationStepUser.fromData(data);
    });
  }

  static fromData(data: ClassificationStepUser): ClassificationStepUser {
    if (!data) return new this();
    let classificationStepUser = new this(
      data.id,
      data.stepUser,
      data.classificationStep
    );
    return classificationStepUser;
  }

  constructor(
    public id?: string,
    public stepUser?: User,
    public classificationStep?: ClassificationStep
  ) {

    if(stepUser)
      this.stepUser = User.fromData(stepUser);

    if(classificationStep)
      this.classificationStep = ClassificationStep.fromData(classificationStep);

  }


}
