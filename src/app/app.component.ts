import { environment } from 'environments/environment';
import { Router, Event as RouterEvent, NavigationStart, NavigationEnd } from '@angular/router';
import { AppState } from './app-state.service';
import { Component, ViewEncapsulation, OnInit } from '@angular/core';

@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './app.style.css'
  ],
  templateUrl: './app.component.html'
})
export class App implements OnInit {
  constructor(private state: AppState,
    private router: Router) { }

  ngOnInit() {
    this.router.events.subscribe((event: RouterEvent) => {
      this.navigationInterceptor(event);
    });
  }

  navigationInterceptor(event: RouterEvent) {
    if (event instanceof NavigationStart) {
      this.state.setLoading(true);
    }
    if (event instanceof NavigationEnd) {
      this.state.setLoading(false);
    }
  }

}
