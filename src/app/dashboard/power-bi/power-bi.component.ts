import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import {ErrorHandler} from '../../shared/shared.module';
import {PowerBiService} from "./power-bi.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-power-bi',
  templateUrl: 'power-bi.component.html',
  styleUrls: ['power-bi.component.css']
})
export class PowerBiComponent implements OnInit, OnDestroy {

  @Input() reportId: string;//e1b42a2f-5a21-499b-bf5a-de314f87c673
  @Input() reportInfo: Array<[number, string, string]>;
  @Input() baseUrl: string;

  collapsed = false;
  accessToken;
  refreshToken;

  constructor(
    private errorHandler: ErrorHandler,
    private powerBiService: PowerBiService
  ) {
  }

  ngOnInit() {
    this.load();
  }

  ngOnDestroy() {
  }

  load() {
    this.powerBiService.getAccessToken()
      .then(tokens => {
        this.powerBiService.isAccessTokenExpired(this.accessToken)
          .then(() => {
            this.accessToken = tokens.accessToken;
            this.refreshToken = tokens.refreshToken;
          })
          .catch(err => {
            this.powerBiService.refreshAccessToken(tokens)
              .then(refreshedTokens => {
                this.accessToken = refreshedTokens.accessToken;
                this.refreshToken = refreshedTokens.refreshToken;
              });
          })
      })
      .catch(error => {
        this.errorHandler.fromServer(error);
      });
  }

  collapse() {
    this.collapsed = !this.collapsed;
  }
}
