import {Component, OnInit, OnDestroy} from '@angular/core';
import {LobbyPanel} from './lobby-panel';
import {LobbyPanelService} from './lobby-panel.service';
import {ErrorHandler} from '../../shared/shared.module';
import {Subscription, Observer} from 'rxjs';
import {Observable} from 'rxjs/Rx';
import {Page} from "../../shared/page/page";
import {BatchOperation} from "../../batch-operation/batch-operation";

@Component({
  selector: 'app-lobby-panel',
  templateUrl: 'lobby-panel.component.html'
})
export class LobbyPanelComponent implements OnInit, OnDestroy {
  loading = true;
  error = false;
  collapsed = false;
  lobbyPanels: Array<LobbyPanel>;
  page: Page<LobbyPanel> = new Page<LobbyPanel>();
  subscription: Subscription;

  constructor(private lobbyPanelService: LobbyPanelService,
              private errorHandler: ErrorHandler) {
  }

  ngOnInit() {
    this.loading = true;
    // this.load();
    // this.subscribe();
    this.loadList();
    this.page.changeQuery.subscribe(() => {
      this.loadList();
    });
  }

  subscribe() {
    const period = 30 * 1000;

    this.subscription = Observable.timer(period, period).subscribe(() => {
      this.loadList();
    });
  }

  ngOnDestroy() {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }

    this.page.changeQuery.unsubscribe();
  }

  load() {
    this.lobbyPanelService
      .load()
      .then(lobbyPanel => {
        this.lobbyPanels = lobbyPanel;
        this.loading = false;
        this.error = false;
      })
      .catch(error => {
        this.errorHandler.fromServer(error);
        this.loading = false;
        this.error = true;
      });
  }

  loadList(skipLoading = false,) {
    this.error = false;

    if (!skipLoading) {
      this.loading = true;
    }

    this.lobbyPanelService
      .listPaged(this.page)
      .then(() => {
        this.loading = false;
      }).catch(error => this.handleError(error));
  }

  handleError(error) {
    this.error = true;
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }

  collapse() {
    this.collapsed = !this.collapsed;
  }

}
