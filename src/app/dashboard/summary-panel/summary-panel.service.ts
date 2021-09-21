import { Injectable } from '@angular/core';
import { Headers, Http, URLSearchParams } from '@angular/http';
import { AuthService } from '../../auth/auth.service';
import { Endpoints } from '../../endpoints';
import { SummaryPanel } from './summary-panel';

@Injectable()
export class SummaryPanelService {
  private headers = new Headers({ 'Content-Type': 'application/json' });

  constructor(private http: Http, private auth: AuthService) {}

  load() {
    let url = `${Endpoints.summaryPanelUrl}`;
    return this.http
      .get(url)
      .toPromise()
      .then(response => SummaryPanel.fromData(response.json()));
  }
}
