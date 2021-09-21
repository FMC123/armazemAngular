import { IntegrationZimMoveListComponent } from './integration-zim-move-list.component';
import { LayoutComponent } from '../../layout/layout.component';
import { AuthGuard } from '../../auth/auth.guard';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'integration/zim',
        component: LayoutComponent,
        canActivateChild: [ AuthGuard ],
        children: [
          {
            path: '',
            component: IntegrationZimMoveListComponent
          }
        ]
      }
    ])
  ],
  providers: [

  ],
  exports: [
    RouterModule
  ]
})
export class IntegrationZimMoveRoutingModule { }
