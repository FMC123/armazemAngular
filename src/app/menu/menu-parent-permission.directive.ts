import { Directive, OnInit, Input, HostBinding, ContentChildren } from '@angular/core';

import { MenuPermissionDirective } from './menu-permission.directive';
import { AuthService } from './../auth/auth.service';

@Directive({
  selector: '[appMenuParentPermission]'
})
export class MenuParentPermissionDirective {

  @ContentChildren(MenuPermissionDirective) children;

  @HostBinding('hidden')
  get hidden(){
    if (!this.children || this.children.length <= 0) {
      return true;
    }
    return !this.children.some( c => !c.hidden );
  }

  constructor() {}

}
