import { Endpoints } from '../endpoints';
import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';

import { AuthService } from '../auth/auth.service';
import { Page } from '../shared/page/page';
import { toPromise } from "rxjs/operator/toPromise";
import { IncidentMotive } from './incident-motive';

@Injectable()
export class IncidentMotiveService {
    private headers = new Headers({ 'Content-Type': 'application/json' });
    constructor(private http: Http,
        private auth: AuthService) { }

    list(): Promise<Array<IncidentMotive>> {
        return this.http.get(Endpoints.motiveUrl)
            .toPromise()
            .then(response => {
                return IncidentMotive.fromListData(response.json());
            });
    }

    find(id: number | string) {
        let url = `${Endpoints.motiveUrl}/${id}`;
        return this.http.get(url)
            .toPromise()
            .then(response => {
                let incidentMotive = IncidentMotive.fromData(response.json());

                return incidentMotive;
            });
    }

    save(incidentMotive: IncidentMotive): Promise<IncidentMotive> {
        if (incidentMotive.id) {
            return this.update(incidentMotive);
        } else {
            return this.create(incidentMotive);
        }
    }

    delete(id: number | string): Promise<void> {
        let url = `${Endpoints.motiveUrl}/${id}`;
        return this.http.delete(url,
            { headers: this.auth.appendOrCreateAuthHeader(this.headers) })
            .toPromise()
            .then(() => null);
    }

    private create(incidentMotive: IncidentMotive): Promise<IncidentMotive> {
        const url = `${Endpoints.motiveUrl}`
        return this.http
            .post(url, JSON.stringify(incidentMotive),
                { headers: this.auth.appendOrCreateAuthHeader(this.headers) })
            .toPromise()
            .then(res => res.json());
    }

    private update(incidentMotive: IncidentMotive): Promise<any> {
        const url = `${Endpoints.motiveUrl}/${incidentMotive.id}`;
        return this.http
            .put(url, incidentMotive, { headers: this.auth.appendOrCreateAuthHeader(this.headers) })
            .toPromise()
            .then(() => IncidentMotive);
    }
}
