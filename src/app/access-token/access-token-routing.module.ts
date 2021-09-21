import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';

import { AccessTokenListComponent } from './access-token-list/access-token-list.component';
import { LayoutComponent } from "app/layout/layout.component";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'access-token',
        component: LayoutComponent,
        children: [
          {
            path: '',
            component: AccessTokenListComponent
          }
        ]
      }
    ])
  ],
  providers: [],
  exports: [
    RouterModule
  ]
})
export class AccessTokenRoutingModule { }
