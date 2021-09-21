import { PurchaseForecast } from './purchase-forecast';
import { Certificate } from 'app/certificate/certificate';

export class PurchaseForecastCertificate {

	static fromListData(
		listData: Array<PurchaseForecastCertificate>
	): Array<PurchaseForecastCertificate> {
		return listData.map(data => {
			return PurchaseForecastCertificate.fromData(data);
		});
	}

	static fromData(data: any): PurchaseForecastCertificate {
		if (!data) return new this();
		let purchaseForecastCertificate = new this(
			data.id,
			data.purchaseForecast,
			data.certificate
		);
		return purchaseForecastCertificate;
	}

	constructor(
		public id?: string,
		public purchaseForecast?: PurchaseForecast,
		public certificate?: Certificate
	) {
		if (purchaseForecast) {
			this.purchaseForecast = PurchaseForecast.fromData(purchaseForecast);
		}

		if (certificate) {
			this.certificate = Certificate.fromData(certificate);
		}
	}
}
