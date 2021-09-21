import { Component, OnInit } from '@angular/core';

import { AuthService } from './../auth.service';
import { Notification } from './../../shared/notification/notification';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  constructor(private auth: AuthService) { }

  ngOnInit() {
    Notification.clearErrors();
  }

  get rememberedCredentials() {
    return this.auth.rememberedCredentials;
  }
}
