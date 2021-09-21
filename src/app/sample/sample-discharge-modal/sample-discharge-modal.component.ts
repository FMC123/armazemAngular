import { Sample } from '../sample';
import { Router } from '@angular/router';
import { ErrorHandler } from '../../shared/errors/error-handler';
import {
	OnDestroy,
	AfterViewInit,
	Component,
	EventEmitter,
	Input,
	OnInit,
	Output,
	ViewChildren
} from '@angular/core';
import {
	AbstractControl,
	FormBuilder,
	FormControl,
	FormGroup,
	ValidatorFn,
	Validators
} from '@angular/forms';
import { Subscription } from 'rxjs/Rx';

@Component({
	selector: 'app-sample-discharge-modal',
	templateUrl: './sample-discharge-modal.component.html'
})
export class SampleDischargeModalComponent {
	@Output() close: EventEmitter<void> = new EventEmitter<void>(false);
	@Output() submit: EventEmitter<string> = new EventEmitter<string>(false);
	@Input() Sample: Sample;

	constructor(private router: Router) {}

	onSubmit(password: string) {
		this.submit.emit(password);
		(<any>jQuery)('.modal').modal('hide');
	}
}
