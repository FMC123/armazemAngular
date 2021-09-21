export class AutomationSemaphoreLog {
	public position: Position;

	static fromListData(
		listData: Array<AutomationSemaphoreLog>
	): Array<AutomationSemaphoreLog> {
		return listData.map(data => {
			return AutomationSemaphoreLog.fromData(data);
		});
	}

	static fromData(data: AutomationSemaphoreLog): AutomationSemaphoreLog {
		if (!data) return new this();
		let log = new this(data.status, data.message);
		return log;
	}

	constructor(public status?: string, public message?: string) {}
}
