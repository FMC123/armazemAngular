import { AppState } from '../app-state.service';
import { AuthService } from '../auth/auth.service';

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'app-layout',
	templateUrl: 'layout.component.html'
})
export class LayoutComponent implements OnInit {
	constructor(
		public appState: AppState,
		private auth: AuthService,
		private router: Router
	) {}

	ngOnInit() {}

	logoff() {
		this.auth.logoff();
		this.router.navigate(['/login']);
	}

	get version() {
		return this.auth.version;
	}
}
