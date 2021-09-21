import { ModalManager } from '../../shared/modals/modal-manager';
import { Component, OnInit, Input } from '@angular/core';
import { Sample } from '../sample';

@Component({
	selector: 'app-sample-info',
	templateUrl: './sample-info.component.html'
})
export class SampleInfoComponent {
	@Input() sample: Sample;
}
