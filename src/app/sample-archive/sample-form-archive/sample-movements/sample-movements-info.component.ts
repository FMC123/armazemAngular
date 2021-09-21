import { ModalManager } from '../../../shared/modals/modal-manager';
import { Component, OnInit, Input } from '@angular/core';
import { Sample } from '../../../sample/sample';

@Component({
	selector: 'app-sample-movements-info',
	templateUrl: './sample-movements-info.component.html'
})
export class SampleMovementsInfoComponent {
	@Input() sample: Sample;
}
