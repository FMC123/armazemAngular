import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { ErrorHandler } from '../../shared/shared.module';
import { AuthService } from '../auth.service';
import { Notification } from './../../shared/notification/notification';

@Component({
  selector: 'app-warehouse-login',
  templateUrl: './warehouse-login.component.html'
})
export class WarehouseLoginComponent implements OnInit {
  loading: boolean = false;

  constructor(
    private router: Router,
    private auth: AuthService,
    private errorHandler: ErrorHandler
  ) { }

  ngOnInit() {
    Notification.clearErrors();
  }

  get warehouses(){
    return this.auth.warehouses;
  }

  select(warehouseId) {
    this.loading = true;
    this.auth.warehouseLogin(warehouseId).then(() => {
      this.router.navigate(['']);
    }).catch((error) => this.handleError(error));
  }

  handleError(error) {
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }

  logoff() {
    this.auth.logoff();
    this.router.navigate(['/login']);
  }

}
