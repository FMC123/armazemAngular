import { Transportation } from '../../transportation/transportation';
import { ShippingAuthorization } from '../shipping-authorization';
import { Router } from '@angular/router';
import { ErrorHandler } from '../../shared/errors/error-handler';
import { OnDestroy, AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChildren } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Rx';

@Component({
  selector: 'app-shipping-authorization-batch-operation-modal',
  templateUrl: './shipping-authorization-batch-operation-modal.component.html'
})
export class ShippingAuthorizationBatchOperationModalComponent {
  @Output() close: EventEmitter<void> = new EventEmitter<void>(false);
  @Input() shippingAuthorization: ShippingAuthorization;

  constructor(
    private router: Router,
  ) {}

  open(transportation: Transportation) {
    (<any>jQuery)('.modal').modal('hide');
    this.router.navigate(['/shipping-authorization', this.shippingAuthorization.id, 'transportation', transportation.id]);
  }

}
