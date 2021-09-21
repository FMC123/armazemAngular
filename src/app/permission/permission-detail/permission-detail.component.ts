
import { Component, OnInit, OnDestroy } from '@angular/core';

import { Notification } from './../../shared/notification/notification';
import { ErrorHandler, ModalManager, Search } from '../../shared/shared.module';
import { Logger } from '../../shared/logger/logger';
import { Page } from '../../shared/page/page';
import { DbGroup } from 'app/permission/dbGroup';
import { PermissionService } from 'app/permission/permission.service';

@Component({
  selector: 'app-permission-detail',
  templateUrl: './permission-detail.component.html'
})
export class PermissionDetailComponent implements OnInit {

  constructor(
    private permissionService: PermissionService,
    private errorHandler: ErrorHandler,
    private logger: Logger
  ) { }

  ngOnInit() {
    Notification.clearErrors();

  }

}
