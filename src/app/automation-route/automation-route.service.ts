import { TagSendData } from './tag-send-data';
import { AccessToken } from './../auth/access-token';
import { EquipamentTag } from './../equipament/equipament-tag/equipament-tag';
import { Equipament } from './../equipament/equipament';
import { Injectable } from '@angular/core';
import { Endpoints } from './../endpoints';
import { AutomationRouteItem } from './automation-route-item';
import { AuthService } from 'app/auth/auth.service';
import { Http, Headers } from '@angular/http';
import { Batch } from 'app/batch/batch';
import { AutomationRouteDuctClean } from 'app/automation-route/automation-route-duct-clean';
import { environment } from '../../environments/environment';

@Injectable()
export class AutomationRouteService {
	headers = new Headers({ 'Content-Type': 'application/json' });
	constructor(private http: Http, private auth: AuthService) { }

	list() {
		return this.http
			.get(`${Endpoints.automationRouteItemUrl}`)
			.toPromise()
			.then(response => {
				return AutomationRouteItem.fromListData(response.json());
			});
	}

	getEquipments(positionOrigin: string, positionDestination: string) {
		return this.http
			.get(
				`${Endpoints.automationRouteEquipamentTagUrl(
					positionOrigin,
					positionDestination
				)}`
			)
			.toPromise()
			.then(response => {
				return EquipamentTag.fromListData(response.json());
			});
	}

	executeBothTagsIfExists(
		tag1: EquipamentTag,
		tag2: EquipamentTag
	): Promise<any> {
		if (!tag1) {
			return Promise.reject(new Error('Tag 1 não informada!'));
		}

		return this.executeCommand(tag1.id).then(() => {
			if (tag2 && tag2.id) {
				return delay(environment.INTERVAL_AUTOMATION_EXECUTE_TAG).then(() =>
					this.executeCommand(tag2.id)
				);
			}
		});
	}

	executeCommand(tagId: string): Promise<any> {
		if (!tagId) {
			return Promise.resolve(false);
		}

		let tagSendData = new TagSendData();
		tagSendData.delayInMilisToAct = 2;
		tagSendData.value = 'True';
		tagSendData.equipTagId = tagId;

		const url = `${Endpoints.automationRouteExecutingCommand()}`;
		const header = this.auth.appendOrCreateAuthHeader(this.headers);
		return this.http
			.post(url, JSON.stringify(tagSendData), { headers: header })
			.toPromise()
			.then(response => {
				return !!response.ok;
			});
	}

	updateStatus(automationRouteItem: AutomationRouteItem) {
		const url = `${Endpoints.automationRouteUpdateStatus(
			automationRouteItem.id
		)}`;
		this.headers = this.auth.appendOrCreateAuthHeader(this.headers);
		return this.http
			.put(url, automationRouteItem, { headers: this.headers })
			.timeout(30000)
			.toPromise()
			.then(response => {
				const json = response.json();
				return AutomationRouteItem.fromData(json);
			});
	}

	unlinkBatch(automationRouteItem: AutomationRouteItem, batch: Batch) {
		const url = `${Endpoints.automationRouteUnLink(batch.id)}`;
		this.headers = this.auth.appendOrCreateAuthHeader(this.headers);
		return this.http
			.put(url, JSON.stringify(automationRouteItem), { headers: this.headers })
			.timeout(30000)
			.toPromise()
			.then(response => {
				const json = response.json();
				return AutomationRouteItem.fromData(json);
			});
	}

	registerDuctClean(automationRouteDuctClean: AutomationRouteDuctClean) {
		const url = `${Endpoints.automationRouteDuctClean}`;
		const header = this.auth.appendOrCreateAuthHeader(this.headers);
		return this.http
			.post(url, JSON.stringify(automationRouteDuctClean), { headers: header })
			.toPromise()
			.then(response => {
				return !!response.ok;
			});
	}

	detachBatchPosition(batchId: string, positionId: string) {
		const url = `${Endpoints.batchPositionDetachUrl(batchId, positionId)}`;
		const header = this.auth.appendOrCreateAuthHeader(this.headers);
		return this.http
			.post(url, null, { headers: header })
			.toPromise()
			.then(response => {
				return !!response.ok;
			});
	}
}
