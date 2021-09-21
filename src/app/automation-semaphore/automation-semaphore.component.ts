import { Component, OnInit, Input } from '@angular/core';
import { AutomationSemaphoreLog } from './automation-semaphore-log';
import { AutomationSemaphoreService } from './automation-semaphore.service';

@Component({
	selector: 'app-automation-semaphore',
	templateUrl: 'automation-semaphore.component.html',
	styleUrls: ['./automation-semaphore.css']
})
export class AutomationSemaphoreComponent implements OnInit {
	constructor(private service: AutomationSemaphoreService) {}

	ngOnInit() {}

	get current() {
		return this.service.current;
	}

	get status() {
		if (!this.current || !this.current.status) {
			return 'OFF';
		}

		return this.current.status;
	}
}
