import { Component, OnDestroy, OnInit } from '@angular/core';
import { Notification } from '../shared/notification/notification';
import {ParameterService} from "../parameter/parameter.service";

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
  styleUrls: ['dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  reportId;
  reportInfo;
  baseURL;
  username;
  password;

	constructor(private parameterService: ParameterService) {}

	ngOnInit() {
		Notification.clearErrors();
		this.reportId = this.parameterService.powerBiReportId();
		this.reportInfo = this.parameterService.powerBiReportIdList();
		this.baseURL = this.parameterService.powerBiBaseURL();
		this.username = this.parameterService.powerBiUsername();
		this.password = this.parameterService.powerBiPassword();
	}

  dashboardShowPowerBI(): boolean {
    return this.parameterService.dashboardShowPowerBI();
  }

  dashboardShowLobby(): boolean {
    return this.parameterService.dashboardShowLobby();
  }

  dashboardShowSummary(): boolean {
    return this.parameterService.dashboardShowSummary();
  }

  dashboardShowStock(): boolean {
    return this.parameterService.dashboardShowStock();
  }


}
