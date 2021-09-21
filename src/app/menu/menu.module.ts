import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';
import { MenuComponent }   from './menu.component';
import { MenuPermissionDirective } from './menu-permission.directive';
import { MenuParentPermissionDirective } from './menu-parent-permission.directive';

@NgModule({
  imports: [
    SharedModule
  ],
  exports: [
    MenuComponent,
  ],
  declarations: [
    MenuParentPermissionDirective,
    MenuPermissionDirective,
    MenuComponent,
  ],
  providers: [],
})
export class MenuModule { }
