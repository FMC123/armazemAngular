import { Directive, Input, HostBinding } from '@angular/core';

import { AuthService } from './../auth/auth.service';

@Directive({
  selector: '[appMenuPermission]'
})
export class MenuPermissionDirective {
  @Input('appMenuPermission') menu: string;

  @HostBinding('hidden')
  get hidden(): boolean {
    return !this.auth.hasPermission(this.menu);
  }

  constructor(private auth: AuthService) {}
}
