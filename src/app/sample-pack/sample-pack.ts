import { User } from '../user/user';
import { Sample } from '../sample/sample';
import {SamplePackStatus} from "./sample-pack-status";

export class SamplePack {
	static fromListData(listData: Array<SamplePack>): Array<SamplePack> {
		return listData.map(data => {
			return SamplePack.fromData(data);
		});
	}

	static fromData(data: SamplePack): SamplePack {
		if (!data) return new this();
		const parameter = new this(
			data.id,
			data.code,
			data.status,
			data.boxCode,
			data.sealCode,
			data.sendDate,
			data.sendNote,
			data.sendBy,
			data.sendUserName,
			data.receiveDate,
			data.receiveNote,
			data.receivedBy,
      data.receivedUserName,
      data.samples,
			data.numSamples,
			data.numSacks,
      data.createdDate,
		);
		return parameter;
	}

	constructor(
		public id?: string,
		public code?: string,
		public status?: string,
		public boxCode?: string,
		public sealCode?: string,
		public sendDate?: number,
		public sendNote?: string,
		public sendBy?: User,
		public sendUserName?: string,
		public receiveDate?: number,
		public receiveNote?: string,
		public receivedBy?: User,
    public receivedUserName?: string,
    public samples?:Array<Sample>,
		public numSamples?: number,
		public numSacks?: number,
    public createdDate?: number,
	) {

	  if(sendBy){
	    this.sendBy = User.fromData(sendBy);
    }

    if(receivedBy){
      this.receivedBy = User.fromData(receivedBy);
    }

	  if(samples){
	    this.samples = Sample.fromListData(samples);
    }

  }

	get statusObject() {
		return SamplePackStatus.fromData(this.status);
	}

	set statusObject(value) {
		if (!value) {
			this.status = null;
			return;
		}

		this.status = value.code;
	}
}
