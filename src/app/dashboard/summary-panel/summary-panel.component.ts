import { Component, OnInit, OnDestroy } from '@angular/core';
import { SummaryPanel } from './summary-panel';
import { SummaryPanelService } from './summary-panel.service';
import { ErrorHandler } from '../../shared/shared.module';
import { Subscription, Observer } from 'rxjs';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-summary-panel',
  templateUrl: 'summary-panel.component.html'
})
export class SummaryPanelComponent implements OnInit, OnDestroy {
  loading = true;
  error = false;
  collapsed = false;
  summaryPanel: SummaryPanel;
  subscription: Subscription;

  constructor(
    private summaryPanelService: SummaryPanelService,
    private errorHandler: ErrorHandler
  ) {}

  ngOnInit() {
    this.loading = true;
    this.load();
    this.subscribe();
  }

  subscribe() {
    const period = 30 * 1000;

    this.subscription = Observable.timer(period, period).subscribe(() => {
      this.load();
    });
  }

  ngOnDestroy() {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
  }

  load() {
    this.summaryPanelService
      .load()
      .then(summaryPanel => {
        this.summaryPanel = summaryPanel;
        this.loading = false;
        this.error = false;
      })
      .catch(error => {
        this.errorHandler.fromServer(error);
        this.loading = false;
        this.error = true;
      });
  }

  collapse() {
    this.collapsed = !this.collapsed;
  }
}
