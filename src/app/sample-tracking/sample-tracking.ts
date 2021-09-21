import { Department } from "../department/department";
import { MarkupGroup } from "../markup-group/markup-group";
import { Sample } from "../sample/sample";
import { SampleTrackingMotive } from "./sample-tracking-motive";
import { User } from "../user/user";
import { DateTimeHelper } from "../shared/globalization";
import { SampleTrackingStatus } from "./sample-tracking-status";

export class SampleTracking {

  static fromListData(listData: Array<SampleTracking>): Array<SampleTracking> {
    return listData.map((data) => {
      return SampleTracking.fromData(data);
    });
  }

  static fromData(data: any): SampleTracking {
    if (!data) return new this();
    let SampleTracking = new this(
      data.id,
      data.createdBy,
      data.createdDate,
      data.department,
      data.code,
      data.label,
      data.sampleTrackingMotive,
      data.markupGroup,
      data.samples,
      data.status
    );
    return SampleTracking;
  }

  constructor(
    public id?: string,
    public createdBy?: User,
    public createdDate?: number,
    public department?: Department,
    public code?: string,
    public label?: string,
    public sampleTrackingMotive?: string,
    public markupGroup?: MarkupGroup,
    public samples?: Array<Sample>,
    public status?: string
  ) {

    if (createdBy) {
      this.createdBy = User.fromData(createdBy);
    }

    if (department) {
      this.department = Department.fromData(department);
    }

    if (markupGroup) {
      this.markupGroup = MarkupGroup.fromData(markupGroup);
    }

    if (samples) {
      this.samples = Sample.fromListData(samples)
    }
  }

  get sampleTrackingMotiveObject(): SampleTrackingMotive {
    return SampleTrackingMotive.fromData(this.sampleTrackingMotive);
  }

  set sampleTrackingMotiveObject(value: SampleTrackingMotive) {
    if (value) {
      this.sampleTrackingMotive = value.code;
    } else {
      this.sampleTrackingMotive = null;
    }
  }

  get createdDateString(): string {
    return DateTimeHelper.toDDMMYYYYHHmm(this.createdDate);
  }
  set createdDateString(createdDateString: string) {
    this.createdDate = DateTimeHelper.fromDDMMYYYYHHmm(createdDateString);
  }

  get description() {
    return this.code + ' - ' + this.label;
  }

  get statusObject() {
    return SampleTrackingStatus.fromData(this.status);
  }
}