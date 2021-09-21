import { ModalManager } from '../../shared/modals/modal-manager';
import { Component, OnInit, Input } from '@angular/core';
import { ClassificationItem } from '../../classification/classification-item';
import { ClassificationVersion } from '../../classification/classification-version';
import { Certificate } from '../../certificate/certificate';

@Component({
	selector: 'app-classification-authorization-info',
	templateUrl: './classification-authorization-info.component.html'
})
export class ClassificationAuthorizationInfoComponent implements OnInit {
	@Input() classificationVersion: ClassificationVersion;
	constructor() { }

	logModal: ModalManager = new ModalManager();
	leftColumn: Array<any>;
	certificates: Array<Certificate>;

	ngOnInit() {
		if (this.classificationVersion && this.classificationVersion.sample
			&& this.classificationVersion.sample.batches
			&& this.classificationVersion.sample.batches.length) {

			if (this.classificationVersion.sample.batches[0] && this.classificationVersion.sample.batches[0].batchOperation) {
				this.certificates = this.classificationVersion.sample.batches[0].batchOperation.certificates;
			}
			else {
				this.certificates = new Array();
			}

			let certificatesString: string;
			if (this.certificates.length > 0) {
				for (let i = 0; i < this.certificates.length; i++) {
					if (i > 0) {
						certificatesString += ', ' + this.certificates[i].name;
					} else {
						certificatesString = this.certificates[i].name;
					}
				}
			} else {
				certificatesString = 'Não possui certificações';
			}

			this.leftColumn = [
				['Lote', this.classificationVersion.sample.batchCodes],
				['Cooperado',
					this.classificationVersion.sample.batches[0] &&
						this.classificationVersion.sample.batches[0].batchOperation &&
						this.classificationVersion.sample.batches[0].batchOperation.collaborator &&
						this.classificationVersion.sample.batches[0].batchOperation.collaborator.person ?
						this.classificationVersion.sample.batches[0].batchOperation.collaborator.person.name : ''
				],
				['Sacas', this.classificationVersion.sample.sacks],
				['Certificação', certificatesString],
				['Versão', this.classificationVersion.version],
				[
					'Data de Classificação',
					this.classificationVersion.classificationDateString
				],
				['Classificador', (this.classificationVersion.classifiedBy != null) ? this.classificationVersion.classifiedBy.label : ""],
				['Provador', (this.classificationVersion.tastedBy != null) ? this.classificationVersion.tastedBy.label : ""],
				['Reprovador 1', (this.classificationVersion.tastedAgain1By != null) ? this.classificationVersion.tastedAgain1By.label : ""],
				['Reprovador 2', (this.classificationVersion.tastedAgain2By != null) ? this.classificationVersion.tastedAgain2By.label : ""],
				['Observação', this.classificationVersion.observation]
			];
		}
	}

	get items() {
		return this.classificationVersion.items;
	}
}